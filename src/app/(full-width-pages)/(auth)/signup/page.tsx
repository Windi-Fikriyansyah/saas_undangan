import SignUpForm from "@/components/auth/SignUpForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | Undangan Digital SaaS",
  description: "Daftar akun baru untuk membuat undangan digital",
};

export default async function SignUp() {
  // If user is already authenticated, redirect to appropriate dashboard
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const isAdmin = (session.user as any).isAdmin;
    redirect(isAdmin ? "/admin" : "/dashboard");
  }

  return <SignUpForm />;
}
