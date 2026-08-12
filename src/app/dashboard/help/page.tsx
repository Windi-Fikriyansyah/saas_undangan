import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bantuan & FAQ | SaaS Undangan Digital",
  description: "Pusat Bantuan Vendor",
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Pusat Bantuan & FAQ
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Pertanyaan Umum (FAQ)
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-6">
                <h4 className="mb-2 font-medium text-black dark:text-white">
                  Bagaimana cara membuat undangan baru?
                </h4>
                <p className="text-sm text-gray-500">
                  Pergi ke menu "Buat Order Baru" di Sidebar, lalu isi formulir dengan nama klien dan nomor WhatsApp klien. Setelah order dibuat, klien akan menerima link untuk mengisi data mereka sendiri.
                </p>
              </div>
              <div className="mb-6">
                <h4 className="mb-2 font-medium text-black dark:text-white">
                  Apakah saya bisa mengedit data tamu?
                </h4>
                <p className="text-sm text-gray-500">
                  Data tamu secara otomatis terbentuk ketika mereka membuka link undangan atau ketika Anda mengirimkan pesan WA menggunakan fitur "Kirim Undangan (WA)".
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-black dark:text-white">
                  Kapan masa aktif undangan habis?
                </h4>
                <p className="text-sm text-gray-500">
                  Masa aktif undangan bergantung pada paket Anda. Untuk pengguna Pro, masa aktif undangan akan terus berlanjut (Selamanya). Undangan akan expired otomatis 30 hari setelah acara untuk pengguna gratis.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Kontak Dukungan
              </h3>
            </div>
            <div className="p-6.5">
              <p className="mb-4 text-sm text-gray-500">
                Apakah Anda mengalami kendala teknis atau memiliki pertanyaan seputar tagihan? Tim dukungan kami siap membantu Anda.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@undangan.com"
                  className="inline-flex items-center justify-center rounded-md border border-brand-500 py-3 px-6 text-center font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-600 lg:px-8 xl:px-10"
                >
                  Kirim Email
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md bg-success py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
