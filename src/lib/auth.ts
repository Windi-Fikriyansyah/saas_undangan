import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./db"
import { Adapter } from "next-auth/adapters"

// We create a custom adapter because NextAuth defaults to 'User', 
// but our schema explicitly uses 'Vendor' based on the requirements.
const customAdapter: Adapter = {
  ...PrismaAdapter(prisma as any),
  createUser: (data: any) => prisma.vendor.create({ 
    data: { 
      name: data.name ?? "Unnamed", 
      email: data.email,
    } 
  }) as any,
  getUser: (id: string) => prisma.vendor.findUnique({ where: { id } }) as any,
  getUserByEmail: (email: string) => prisma.vendor.findUnique({ where: { email } }) as any,
  async getUserByAccount(provider_providerAccountId: any) {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId },
      select: { vendor: true },
    })
    return (account?.vendor as any) ?? null
  },
  updateUser: (data: any) => prisma.vendor.update({ where: { id: data.id as string }, data: { name: data.name } }) as any,
  deleteUser: (id: string) => prisma.vendor.delete({ where: { id } }) as any,
  
  linkAccount: (data: any) => {
    const { userId, ...rest } = data;
    return prisma.account.create({ data: { ...rest, vendorId: userId } }) as any;
  },
  unlinkAccount: (provider_providerAccountId: any) => prisma.account.delete({ where: { provider_providerAccountId } }) as any,
  
  async getSessionAndUser(sessionToken: string) {
    const userAndSession = await prisma.session.findUnique({
      where: { sessionToken },
      include: { vendor: true },
    })
    if (!userAndSession) return null
    const { vendor, vendorId, ...session } = userAndSession
    return { user: vendor as any, session: { ...session, userId: vendorId } as any }
  },
  createSession: (data: any) => {
    const { userId, ...rest } = data;
    return prisma.session.create({ data: { ...rest, vendorId: userId } }) as any;
  },
  updateSession: (data: any) => prisma.session.update({ where: { sessionToken: data.sessionToken }, data }) as any,
  deleteSession: (sessionToken: string) => prisma.session.delete({ where: { sessionToken } }) as any,
}

export const authOptions: NextAuthOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "database", // Use DB session for active tracking of vendor sessions
  },
  debug: true,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session.user && user) {
        // Inject vendor ID and role to session
        (session.user as any).id = user.id;
        (session.user as any).isAdmin = user.isAdmin;
      }
      return session;
    },
  },
}
