const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const template = await prisma.template.upsert({
    where: { id: 'elegan-1' },
    update: {
      name: 'Elegan',
      category: 'Premium',
      tier: 'PREMIUM',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop',
      configJson: {
        colorScheme: {
          primary: '#d4af37',
          secondary: '#1e293b',
          background: '#0f172a',
          text: '#e2e8f0',
          accent: '#fde047'
        },
        typography: {
          headingFont: 'playfair',
          bodyFont: 'inter'
        },
        features: {
          showGallery: true,
          showLoveStory: true,
          showGift: true,
          showRsvp: true
        }
      }
    },
    create: {
      id: 'elegan-1',
      name: 'Elegan',
      category: 'Premium',
      tier: 'PREMIUM',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop',
      configJson: {
        colorScheme: {
          primary: '#d4af37',
          secondary: '#1e293b',
          background: '#0f172a',
          text: '#e2e8f0',
          accent: '#fde047'
        },
        typography: {
          headingFont: 'playfair',
          bodyFont: 'inter'
        },
        features: {
          showGallery: true,
          showLoveStory: true,
          showGift: true,
          showRsvp: true
        }
      }
    }
  });
  console.log('Template created/updated:', template.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
