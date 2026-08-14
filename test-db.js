const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function check() { 
  const order = await prisma.order.findFirst({ 
    orderBy: { updatedAt: 'desc' }, 
    include: { template: true } 
  }); 
  
  if (order && order.template) { 
    const blocks = order.template.configJson.blocks;
    const rawHtmlBlock = blocks.find(b => b.type === 'raw-html');
    if (rawHtmlBlock) {
      console.log('HTML Length:', rawHtmlBlock.html.length); 
      const regex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
      let match;
      const vars = new Set();
      while ((match = regex.exec(rawHtmlBlock.html)) !== null) {
        vars.add(match[1].trim());
      }
      console.log('Variables extracted:', Array.from(vars));
    } else { 
      console.log('No raw-html theme found in latest order'); 
    } 
  }
} 
check().finally(() => prisma.$disconnect());
