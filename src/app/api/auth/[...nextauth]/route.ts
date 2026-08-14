import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export async function GET(req: Request, context: any) {
  const resolvedContext = { ...context };
  if (context?.params instanceof Promise) {
    resolvedContext.params = await context.params;
  }
  return handler(req, resolvedContext);
}

export async function POST(req: Request, context: any) {
  const resolvedContext = { ...context };
  if (context?.params instanceof Promise) {
    resolvedContext.params = await context.params;
  }
  return handler(req, resolvedContext);
}
