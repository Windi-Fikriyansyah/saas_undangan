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
    strategy: "jwt", // Use JWT so middleware can read the token at the edge
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      // On initial sign-in, user object is available from the adapter
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin ?? false;
        token.isOnboarded = user.isOnboarded ?? false;
        token.logoUrl = user.logoUrl ?? null;
      }
      
      // On every token refresh, re-fetch from DB to ensure role is up-to-date
      if (trigger === "update" || !user) {
        try {
          const dbUser = await prisma.vendor.findUnique({
            where: { id: token.id as string },
            select: { isAdmin: true, isOnboarded: true, logoUrl: true },
          });
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin;
            token.isOnboarded = dbUser.isOnboarded;
            token.logoUrl = dbUser.logoUrl;
          }
        } catch {
          // If DB lookup fails, keep existing token values
        }
      }
      
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token) {
        // Inject vendor ID and role from JWT token to session
        (session.user as any).id = token.id;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).isOnboarded = token.isOnboarded;
        (session.user as any).logoUrl = token.logoUrl;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // If the URL is relative, prepend base URL
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // If the URL is on the same origin, allow it
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
}
