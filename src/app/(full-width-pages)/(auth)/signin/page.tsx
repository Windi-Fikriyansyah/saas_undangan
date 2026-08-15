import SignInForm from "@/components/auth/SignInForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | Undangan Digital SaaS",
  description: "Masuk ke akun Anda untuk mengelola undangan digital",
};

export default async function SignIn() {
  // If user is already authenticated, redirect to appropriate dashboard
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const isAdmin = (session.user as any).isAdmin;
    redirect(isAdmin ? "/admin" : "/dashboard");
  }

  return <SignInForm />;
}
