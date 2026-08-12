const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.vendor.create({
      data: {
        name: "Test Vendor",
        email: "test@example.com",
      }
    });
    console.log("Vendor created:", user);

    const account = await prisma.account.create({
      data: {
        vendorId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "123456",
        access_token: "mock_token"
      }
    });
    console.log("Account created:", account);

    const session = await prisma.session.create({
      data: {
        sessionToken: "mock_session_token",
        vendorId: user.id,
        expires: new Date(Date.now() + 1000000)
      }
    });
    console.log("Session created:", session);

    // Clean up
    await prisma.vendor.delete({ where: { id: user.id } });
    console.log("Cleanup done.");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
