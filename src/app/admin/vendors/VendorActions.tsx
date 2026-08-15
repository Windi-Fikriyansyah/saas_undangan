"use client";

import { useState } from "react";
import { updateVendorPlan } from "@/app/actions/admin";
import { toast } from "sonner";

export default function VendorActions({ vendorId, currentPlan }: { vendorId: string, currentPlan: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState(currentPlan);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateVendorPlan(vendorId, plan);
      setIsOpen(false);
      toast.success("Berhasil update vendor");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Gagal update vendor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary hover:underline text-sm"
      >
        Edit Plan
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark z-50 p-3">
          <label className="block text-xs font-medium mb-2">Ubah Plan:</label>
          <select 
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full rounded border border-stroke bg-transparent px-2 py-1 text-sm outline-none dark:border-strokedark mb-3"
          >
            <option value="FREE_TRIAL">Free Trial</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="BUSINESS">Business</option>
          </select>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-black dark:hover:text-white"
            >
              Batal
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isLoading}
              className="rounded bg-brand-500 px-3 py-1 text-xs text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
