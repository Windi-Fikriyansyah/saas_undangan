import { prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding Templates...");

  // Seed Minimalist Template
  const minimalist = await prisma.template.upsert({
    where: { id: "minimalist-1" },
    update: {},
    create: {
      id: "minimalist-1",
      name: "minimalist-1",
      category: "Minimalist",
      tier: "BASIC",
      isActive: true,
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
    update: {},
    create: {
      id: "rustic-1",
      name: "rustic-1",
      category: "Rustic",
      tier: "BASIC",
      isActive: true,
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

  console.log("Seeded Templates:", minimalist.name, rustic.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
