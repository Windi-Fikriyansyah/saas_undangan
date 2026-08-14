import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function CoverBlock({ data, config }: { data: any, config: any }) {
  // Extracting client data or using mock data
  const groomNickName = data?.step1?.groomNickname || 'Romeo';
  const brideNickName = data?.step1?.brideNickname || 'Juliet';
  
  // Default config if not provided in JSON
  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-[#F9F7F1]', // Elegant cream background default
    padding: 'py-0', // Cover usually takes full screen
    animation: 'animate-in fade-in zoom-in duration-1000',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig} className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-6">
        <p className="text-sm tracking-[0.2em] uppercase text-gray-500 font-semibold mb-4">
          The Wedding Of
        </p>
        
        <h1 className="font-serif text-6xl md:text-8xl text-gray-800 italic">
          {groomNickName} <span className="text-brand-500 font-sans text-5xl md:text-7xl mx-2">&</span> {brideNickName}
        </h1>
        
        <div className="w-16 h-[1px] bg-gray-400 my-8"></div>
        
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Kami mengundang Anda untuk merayakan momen kebahagiaan penyatuan cinta kami.
        </p>

        <button className="mt-12 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-brand-500 transition-colors shadow-lg tracking-widest text-sm uppercase">
          Buka Undangan
        </button>
      </div>
    </SectionWrapper>
  );
}
