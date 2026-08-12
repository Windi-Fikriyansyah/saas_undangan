"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyOpensChartProps {
  data: number[];
}

export default function MonthlyOpensChart({ data }: MonthlyOpensChartProps) {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: { text: "Total Undangan Dibuka" },
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kali`,
      },
    },
  };

  const series = [
    {
      name: "Tamu Buka",
      data: data,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Trafik Undangan Bulanan
          </h3>
          <p className="text-sm text-gray-500">Jumlah tamu yang membuka undangan per bulan</p>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreDotIcon />
        </button>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-2 min-w-[500px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
