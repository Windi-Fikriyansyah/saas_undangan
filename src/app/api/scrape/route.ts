import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chromium, Route, Request as PlaywrightRequest } from "playwright";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Ensure Node.js doesn't timeout the request early
export const maxDuration = 60; // 60 seconds (for Vercel/Next.js)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const isSuperAdmin = (session?.user as any)?.isAdmin === true || session?.user?.email === "diwin6634@gmail.com";
    if (!session?.user || !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { url, name, category } = await req.json();

    if (!url || !name) {
      return NextResponse.json({ error: "URL and Name are required" }, { status: 400 });
    }

    // Generate unique ID for this template
    const templateId = "scraped-" + crypto.randomUUID().slice(0, 8);
    const scrapeDir = path.join(process.cwd(), "public", "scraped", templateId);
    
    // Create specific asset directories
    const dirs = {
       images: path.join(scrapeDir, "assets", "images"),
       css: path.join(scrapeDir, "assets", "css"),
       fonts: path.join(scrapeDir, "assets", "fonts"),
       js: path.join(scrapeDir, "assets", "js"),
       other: path.join(scrapeDir, "assets", "other")
    };
    
    Object.values(dirs).forEach(d => {
       if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    // Launch Playwright
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    const assetMap = new Map<string, string>(); // Original URL -> Local relative path
    const cssFiles: { path: string, content: string, originalUrl: string }[] = []; // Store downloaded CSS paths
    const downloadPromises: Promise<void>[] = []; // Track active downloads

    // Listen to responses and download assets
    page.on('response', (response) => {
      const request = response.request();
      const resourceType = request.resourceType();
      const reqUrl = request.url();
      
      const isImageExt = reqUrl.match(/\.(png|jpg|jpeg|webp|svg|gif|avif)(\?|$)/i);
      const isFontExt = reqUrl.match(/\.(woff|woff2|ttf|otf|eot)(\?|$)/i);
      const isDataExt = reqUrl.match(/\.(json|txt|xml)(\?|$)/i);
      
      // We only care about specific resource types or specific file extensions (fonts/images/json often loaded via fetch)
      if (['stylesheet', 'image', 'font', 'script', 'fetch', 'xhr'].includes(resourceType) || isFontExt || isImageExt || isDataExt) {
        const downloadPromise = (async () => {
          try {
            if (response.status() === 200) {
            // Check if it's a data URI (ignore)
            if (reqUrl.startsWith('data:')) return;

            const urlObj = new URL(reqUrl);
            let filename = path.basename(urlObj.pathname);
            
            // Generate a safe unique filename if it doesn't have an extension or is generic
            if (!filename || filename === '/' || filename.length > 50) {
               filename = crypto.createHash('md5').update(reqUrl).digest('hex') + getExtension(resourceType);
            }
            // Append hash to prevent collisions
            const uniqueFilename = crypto.createHash('md5').update(reqUrl).digest('hex').substring(0, 6) + '_' + filename;
            
            let subDir = 'other';
            if (resourceType === 'stylesheet') subDir = 'css';
            else if (resourceType === 'image' || isImageExt) subDir = 'images';
            else if (resourceType === 'font' || isFontExt) subDir = 'fonts';
            else if (resourceType === 'script') subDir = 'js';
            else if (isDataExt) subDir = 'js';

            const localRelativePath = `/scraped/${templateId}/assets/${subDir}/${uniqueFilename}`;
            const localAbsolutePath = path.join((dirs as any)[subDir], uniqueFilename);
            
            // Get buffer and save
            const buffer = await response.body();
            fs.writeFileSync(localAbsolutePath, buffer);
            
            assetMap.set(reqUrl, localRelativePath);

            if (subDir === 'css') {
               cssFiles.push({ path: localAbsolutePath, content: buffer.toString('utf-8'), originalUrl: reqUrl });
            }
          }
        } catch (e) {
          // Ignore failures on individual assets (e.g., CORS, aborted requests)
        }
      })();
      downloadPromises.push(downloadPromise);
    }
  });

    // Block unnecessary requests (tracking, ads) to speed up loading
    await page.route('**/*', (route: Route) => {
      const req = route.request();
      const rt = req.resourceType();
      const u = req.url();
      // Block media (audio/video) during scrape to save bandwidth, block tracking scripts
      if (['media', 'websocket'].includes(rt) || u.includes('google-analytics') || u.includes('facebook.com') || u.includes('tiktok.com')) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // Go to URL and wait until network is mostly idle
    let rawHtml = "";
    try {
      const pageResponse = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      if (pageResponse) {
         rawHtml = await pageResponse.text(); // Get EXACT original HTML from server!
      }
      // Trigger lazy loading by scrolling incrementally to catch gallery images
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 400; // scroll down 400px at a time
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 150); // wait 150ms between scrolls to allow IntersectionObservers to fire
        });
      });
      
      // Scroll back up to reset state
      await page.evaluate(() => { window.scrollTo(0, 0); });
      await page.waitForTimeout(2000);
      
      // Force Playwright to fetch any un-downloaded images found in the raw HTML
      // (This guarantees gallery lightboxes and hidden background images are captured)
      if (rawHtml) {
         // Broad regex to catch ALL image URLs (including external domains) to ensure complete portability
         const absRegex = new RegExp(`https?:(?:\\\\/\\\\/|//)[^"'\\s<>;&]+\\.(?:jpg|jpeg|png|webp|svg|gif)`, 'gi');
         const relRegex = new RegExp(`(?:\\\\/|/)?wp-content(?:\\\\/|/)uploads(?:\\\\/|/)[^"'\\s<>;&]+\\.(?:jpg|jpeg|png|webp|svg|gif)`, 'gi');
         
         const foundUrls = new Set<string>();
         
         let match;
         while ((match = absRegex.exec(rawHtml)) !== null) {
            foundUrls.add(match[0].replace(/\\\//g, '/'));
         }
         while ((match = relRegex.exec(rawHtml)) !== null) {
            let relativePath = match[0].replace(/\\\//g, '/');
            if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;
            try { foundUrls.add(new URL(relativePath, url).href); } catch(e) {}
         }

         const urlsToForceFetch = Array.from(foundUrls).filter(u => !assetMap.has(u));
         
         if (urlsToForceFetch.length > 0) {
            await page.evaluate(async (urls) => {
               await Promise.allSettled(urls.map(u => {
                  return new Promise((resolve) => {
                     const img = new Image();
                     img.onload = resolve;
                     img.onerror = resolve;
                     img.src = u; // Trigger actual browser image download (bypasses Cloudflare fetch blocks)
                  });
               }));
            }, urlsToForceFetch);
            // Give time for the network listener to process these fetches
            await page.waitForTimeout(4000);
         }
      }
      
    } catch (e: any) {
      console.log("Playwright goto timeout/error (continuing):", e.message);
    }

    if (!rawHtml) {
      rawHtml = await page.content(); // Fallback
    }
    
    // Wait for all pending asset downloads to finish before closing browser
    await Promise.allSettled(downloadPromises);
    await browser.close();

    // Use pure string replacement instead of Cheerio to guarantee 100% code fidelity
    // Cheerio can corrupt Elementor's data-settings JSON entities, breaking JS animations
    let finalHtml = rawHtml;
    
    // Remove tracking scripts safely without parsing DOM
    finalHtml = finalHtml.replace(/<script[^>]*google-analytics[^>]*>[\s\S]*?<\/script>/gi, '');
    finalHtml = finalHtml.replace(/<script[^>]*facebook\.net[^>]*>[\s\S]*?<\/script>/gi, '');

    // Global String Replacement for all intercepted assets (covers inline styles, data-settings, lazy-src, Elementor JSON)
    // Sort keys by length descending to prevent partial replacements
    const sortedOriginalUrls = Array.from(assetMap.keys()).sort((a, b) => b.length - a.length);

    for (const originalUrl of sortedOriginalUrls) {
      const localPath = assetMap.get(originalUrl)!;
      
      // 1. Replace Absolute URLs
      finalHtml = finalHtml.split(originalUrl).join(localPath);
      
      // 2. Replace Escaped JSON versions (e.g. https:\/\/example.com)
      const escapedUrl = originalUrl.replace(/\//g, '\\/');
      const escapedLocalPath = localPath.replace(/\//g, '\\/');
      finalHtml = finalHtml.split(escapedUrl).join(escapedLocalPath);

      // 3. Replace Relative URLs (to catch href="/wp-content/...")
      try {
         const urlObj = new URL(originalUrl);
         if (urlObj.pathname && urlObj.pathname.length > 5 && urlObj.pathname !== '/') {
            // Replace standard relative paths
            finalHtml = finalHtml.split(`"${urlObj.pathname}"`).join(`"${localPath}"`);
            finalHtml = finalHtml.split(`'${urlObj.pathname}'`).join(`'${localPath}'`);
            
            // Replace escaped relative paths in JSON settings
            const escapedPath = urlObj.pathname.replace(/\//g, '\\/');
            finalHtml = finalHtml.split(`"${escapedPath}"`).join(`"${escapedLocalPath}"`);
         }
      } catch(e) {}
    }

    // Rewrite URLs inside downloaded CSS files
    const cssUrlRegex = /url\(['"]?(.*?)['"]?\)/gi;
    for (const css of cssFiles) {
       let updatedCss = css.content.replace(cssUrlRegex, (match, urlValue) => {
          if (urlValue.startsWith('data:')) return match;
          
          let absoluteUrl = urlValue;
          if (!urlValue.startsWith('http')) {
             try {
                absoluteUrl = new URL(urlValue, css.originalUrl).href;
             } catch(e) { return match; }
          }
          
          const localPath = assetMap.get(absoluteUrl);
          if (localPath) {
             return `url("${localPath}")`;
          }
          return match;
       });
       
       fs.writeFileSync(css.path, updatedCss);
    }

    // Save to database
    const template = await prisma.template.create({
      data: {
        id: templateId,
        name,
        category,
        tier: "PREMIUM",
        isActive: true,
        thumbnailUrl: "/images/placeholder-template.jpg", // default thumbnail
        configJson: {
          isScraped: true,
          originalUrl: url,
          html: finalHtml,
        }
      }
    });

    return NextResponse.json({ success: true, templateId: template.id });

  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function getExtension(resourceType: string) {
  switch (resourceType) {
    case 'stylesheet': return '.css';
    case 'script': return '.js';
    case 'image': return '.jpg';
    case 'font': return '.woff2';
    default: return '.bin';
  }
}
