import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function SouvenirBlock({ data, config, guestName }: { data: any, config: any, guestName?: string }) {
  const isSouvenirEnabled = data?.step3?.isSouvenirEnabled ?? true;

  if (!isSouvenirEnabled) return null;

  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-[#1a1a1a]', // Dark elegant background
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto text-white">
        <h2 className="text-3xl md:text-4xl font-serif">
          Penukaran Souvenir
        </h2>
        <p className="text-gray-400">
          Tunjukkan QR Code ini kepada penerima tamu kami untuk menukarkan souvenir eksklusif.
        </p>
        
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-4 text-gray-900 mt-8">
          <div className="w-48 h-48 bg-gray-200 border-2 border-gray-300 border-dashed flex items-center justify-center rounded-lg">
            <span className="text-gray-400 text-sm">QR Code<br/>(Generate via Klien)</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Berlaku untuk</p>
            <p className="font-serif text-xl mt-1">{guestName || 'Tamu Undangan'}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
