"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getGuestsByClient, createGuestByClient, updateGuestByClient, deleteGuestByClient, bulkCreateGuestsByClient } from "@/app/actions/client-guest";
import * as XLSX from "xlsx";
import ShareLinksModal from "./ShareLinksModal";

interface Guest {
  id: string;
  name: string;
  waNumber: string | null;
  category: string | null;
  seatCount: number;
  rsvpStatus: string;
  rsvpCount: number;
  message: string | null;
  openCount: number;
}

interface ClientGuestManagerProps {
  clientToken: string;
  clientName: string;
  orderSlug: string;
}

export default function ClientGuestManager({ clientToken, clientName, orderSlug }: ClientGuestManagerProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    waNumber: "",
    category: "",
    seatCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getGuestsByClient(clientToken, search, statusFilter);
      setGuests(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [clientToken, search, statusFilter]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleOpenModal = (mode: "create" | "edit", guest?: Guest) => {
    setModalMode(mode);
    setError(null);
    if (mode === "edit" && guest) {
      setSelectedGuest(guest);
      setFormData({
        name: guest.name,
        waNumber: guest.waNumber || "",
        category: guest.category || "",
        seatCount: guest.seatCount,
      });
    } else {
      setSelectedGuest(null);
      setFormData({ name: "", waNumber: "", category: "", seatCount: 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Nama tamu harus diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (modalMode === "create") {
        await createGuestByClient(clientToken, formData);
      } else if (modalMode === "edit" && selectedGuest) {
        await updateGuestByClient(clientToken, selectedGuest.id, formData);
      }
      handleCloseModal();
      fetchGuests();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan tamu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (guestId: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus tamu "${name}"?`)) return;
    
    try {
      await deleteGuestByClient(clientToken, guestId);
      fetchGuests();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus tamu.");
    }
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { "Nama Tamu": "Tamu Contoh 1", "No. WhatsApp": "08123456789", "Kategori": "Keluarga", "Kuota Kursi": 2 },
      { "Nama Tamu": "Tamu Contoh 2", "No. WhatsApp": "", "Kategori": "Teman", "Kuota Kursi": 1 }
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tamu");
    XLSX.writeFile(workbook, "Template_Tamu.xlsx");
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setIsLoading(true);
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        const formattedGuests = data.map(row => ({
          name: row["Nama Tamu"] || "",
          waNumber: row["No. WhatsApp"] ? String(row["No. WhatsApp"]) : undefined,
          category: row["Kategori"] || undefined,
          seatCount: parseInt(row["Kuota Kursi"]) || 1,
        })).filter(g => g.name);

        if (formattedGuests.length === 0) {
          alert("Tidak ada data valid yang ditemukan dalam file. Pastikan kolom 'Nama Tamu' terisi.");
          return;
        }

        const result = await bulkCreateGuestsByClient(clientToken, formattedGuests);
        alert(result.message);
        fetchGuests();
      } catch (err: any) {
        console.error(err);
        alert("Gagal membaca file Excel atau memproses data.");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  const domain = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Tamu</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Kelola daftar tamu undangan untuk pesanan <span className="font-semibold text-blue-600 dark:text-blue-400">{clientName}</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Template
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Excel
            </button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={handleUploadExcel}
              className="hidden"
            />
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Bagikan Undangan
            </button>
            <button
              onClick={() => handleOpenModal("create")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Tamu
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Belum Respon</option>
              <option value="HADIR">Hadir</option>
              <option value="TIDAK_HADIR">Tidak Hadir</option>
              <option value="RAGU">Ragu-ragu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Tamu</th>
                <th className="px-6 py-4 font-semibold">No. WhatsApp</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">RSVP</th>
                <th className="px-6 py-4 font-semibold">Buka</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada tamu ditemukan.</td>
                </tr>
              ) : (
                guests.map((guest) => {
                  let badgeColor = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
                  if (guest.rsvpStatus === "HADIR") badgeColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                  else if (guest.rsvpStatus === "TIDAK_HADIR") badgeColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                  else if (guest.rsvpStatus === "RAGU") badgeColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";

                  return (
                    <tr key={guest.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{guest.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{guest.waNumber || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{guest.category || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                          {guest.rsvpStatus}
                        </span>
                        {guest.rsvpStatus === "HADIR" && <span className="ml-2 text-xs text-gray-500">({guest.rsvpCount} pax)</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{guest.openCount}x</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              const inviteLink = `${domain}/${orderSlug}?to=${guest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                              navigator.clipboard.writeText(inviteLink);
                              alert("Link undangan disalin!");
                            }}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Salin Link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenModal("edit", guest)}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id, guest.name)}
                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
              {modalMode === "create" ? "Tambah Tamu Baru" : "Edit Tamu"}
            </h3>

            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama Tamu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nomor WhatsApp <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={formData.waNumber}
                  onChange={(e) => setFormData({ ...formData, waNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kategori <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Keluarga/Teman"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kuota
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.seatCount}
                    onChange={(e) => setFormData({ ...formData, seatCount: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Links Modal */}
      <ShareLinksModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        guests={guests}
        domain={domain}
        orderSlug={orderSlug}
      />
    </div>
  );
}
