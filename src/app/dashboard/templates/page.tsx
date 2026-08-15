import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  
  if (!(session?.user as any)?.id) {
    redirect("/signin");
  }

  // Fetch templates for the list
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Menu Template
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-7.5">
              <h3 className="font-medium text-black dark:text-white">
                Daftar Template Tersedia
              </h3>
            </div>
            <div className="p-4 sm:p-6 xl:p-7.5">
              {templates.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada template.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {templates.map((tpl) => (
                    <div key={tpl.id} className="flex items-center justify-between border-b border-stroke pb-4 last:border-b-0 last:pb-0 dark:border-strokedark">
                      <div>
                        <h4 className="font-semibold text-black dark:text-white">{tpl.name}</h4>
                        <p className="text-xs text-gray-500">{tpl.category} • {tpl.tier}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/preview/template/${tpl.id}`}
                          target="_blank"
                          className="text-sm text-brand-500 hover:underline"
                        >
                          Preview
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
