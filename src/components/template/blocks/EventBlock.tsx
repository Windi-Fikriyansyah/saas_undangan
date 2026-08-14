import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function EventBlock({ data, config }: { data: any, config: any }) {
  const events = data?.step2?.events || [
    {
      name: "Akad Nikah",
      date: "Minggu, 20 Agustus 2026",
      time: "08:00 WIB - Selesai",
      location: "Masjid Raya",
      address: "Jl. Contoh Alamat No. 123",
    },
    {
      name: "Resepsi",
      date: "Minggu, 20 Agustus 2026",
      time: "11:00 WIB - Selesai",
      location: "Gedung Serbaguna",
      address: "Jl. Contoh Alamat No. 124",
    }
  ];

  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-white',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
            Jadwal Acara
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i dalam rangkaian acara pernikahan kami:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {events.map((evt: any, idx: number) => (
            <div key={idx} className="bg-[#F9F7F1] rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <h3 className="font-serif text-2xl text-brand-500 mb-6">{evt.name}</h3>
              
              <div className="space-y-4 text-gray-700 w-full">
                <div className="flex flex-col items-center pb-4 border-b border-gray-200">
                  <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-1">Tanggal</span>
                  <span className="font-medium">{evt.date}</span>
                </div>
                
                <div className="flex flex-col items-center pb-4 border-b border-gray-200">
                  <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-1">Pukul</span>
                  <span className="font-medium">{evt.time}</span>
                </div>
                
                <div className="flex flex-col items-center pt-2">
                  <span className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-1">Tempat</span>
                  <span className="font-semibold text-lg">{evt.location}</span>
                  <span className="text-sm mt-1">{evt.address}</span>
                </div>
              </div>

              <a 
                href={evt.mapUrl || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 px-6 py-2 border border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors text-sm"
              >
                Lihat Lokasi
              </a>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
