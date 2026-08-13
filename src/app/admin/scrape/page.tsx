import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ScrapeForm from "./ScrapeForm";

export const metadata = {
  title: "Scrape Web | SaaS Undangan",
  description: "Scrape Elementor/WordPress templates",
};

export default async function ScrapePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Double check admin role
  const isSuperAdmin = (session.user as any).isAdmin === true || session.user.email === "diwin6634@gmail.com";
  if (!isSuperAdmin) {
    redirect("/admin");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Web Scraper</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Scrape halaman website (WordPress/Elementor) dan jadikan sebagai template undangan.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
        <ScrapeForm />
      </div>
    </div>
  );
}
