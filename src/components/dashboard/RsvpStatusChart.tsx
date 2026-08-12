"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface RsvpStatusChartProps {
  hadir: number;
  tidakHadir: number;
  ragu: number;
  pending: number;
}

export default function RsvpStatusChart({ hadir, tidakHadir, ragu, pending }: RsvpStatusChartProps) {
  const total = hadir + tidakHadir + ragu + pending;

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#10B981", "#EF4444", "#F59E0B", "#6B7280"], // Success, Danger, Warning, Gray
    labels: ["Hadir", "Tidak Hadir", "Ragu-ragu", "Belum RSVP"],
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 600,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Tamu",
              fontSize: "14px",
              color: "#64748B",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
  };

  const series = [hadir, tidakHadir, ragu, pending];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik RSVP
          </h3>
          <p className="text-sm text-gray-500">Konfirmasi kehadiran tamu</p>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreDotIcon />
        </button>
      </div>

      <div className="flex justify-center mt-6">
        {total === 0 ? (
          <div className="flex h-48 w-full items-center justify-center text-gray-400">
            Belum ada data RSVP
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={300}
          />
        )}
      </div>
    </div>
  );
}
