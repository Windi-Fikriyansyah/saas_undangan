import crypto from "crypto";

/**
 * Generates a random cryptographic token for secure smart links.
 */
export function generateClientToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a URL-friendly slug from a given string.
 * Example: "Romeo & Juliet" -> "romeo-and-juliet-8341"
 */
export function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  
  return `${baseSlug}-${randomSuffix}`;
}
