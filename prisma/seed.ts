import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding Templates...");

  // Seed Minimalist Template
  const minimalist = await prisma.template.upsert({
    where: { id: "minimalist-1" },
    update: {
      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
    },
    create: {
      id: "minimalist-1",
      name: "minimalist-1",
      category: "Minimalist",
      tier: "BASIC",
      isActive: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      configJson: {
        colors: {
          primary: "#1e3a8a",
          secondary: "#bfdbfe",
          accent: "#d97706",
          background: "#f8fafc",
          text: "#1f2937",
        },
        typography: {
          headingFont: "playfair",
          bodyFont: "inter",
        },
        layout: {
          heroStyle: "center",
        },
        features: {
          showGallery: true,
          showLoveStory: true,
          showLiveStream: true,
          showGift: true,
        },
      },
    },
  });

  // Seed Rustic Template
  const rustic = await prisma.template.upsert({
    where: { id: "rustic-1" },
    update: {
      thumbnailUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop"
    },
    create: {
      id: "rustic-1",
      name: "rustic-1",
      category: "Rustic",
      tier: "BASIC",
      isActive: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
      configJson: {
        colors: {
          primary: "#9c6644", // Brown/Earthy
          secondary: "#e6ccb2",
          accent: "#7f4f24",
          background: "#ede0d4",
          text: "#432818",
        },
        typography: {
          headingFont: "great-vibes",
          bodyFont: "lora",
        },
        layout: {
          heroStyle: "center",
        },
        features: {
          showGallery: true,
          showLoveStory: true,
          showLiveStream: true,
          showGift: true,
        },
      },
    },
  });

  // Seed Elegan Template
  const elegan = await prisma.template.upsert({
    where: { id: "elegan-1" },
    update: {
      thumbnailUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop"
    },
    create: {
      id: "elegan-1",
      name: "elegan-1",
      category: "Premium",
      tier: "PREMIUM",
      isActive: true,
      thumbnailUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
      configJson: {
        colors: {
          primary: "#d4af37",
          secondary: "#1e293b",
          background: "#0f172a",
          text: "#e2e8f0",
          accent: "#fde047",
        },
        typography: {
          headingFont: "playfair",
          bodyFont: "inter",
        },
        layout: {
          heroStyle: "center",
        },
        features: {
          showGallery: true,
          showLoveStory: true,
          showLiveStream: false,
          showGift: true,
        },
      },
    },
  });

  console.log("Seeded Templates:", minimalist.name, rustic.name, elegan.name);

  // Seed Admin User
  const admin = await prisma.vendor.upsert({
    where: { email: "diwin6634@gmail.com" },
    update: {
      isAdmin: true,
      isOnboarded: true,
      planType: "BUSINESS"
    },
    create: {
      name: "Super Admin",
      email: "diwin6634@gmail.com",
      isAdmin: true,
      isOnboarded: true,
      planType: "BUSINESS",
      quotaUsed: 0
    }
  });

  console.log("Seeded Admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
