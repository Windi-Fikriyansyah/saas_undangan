import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function HomeBlock({ data, config }: { data: any, config: any }) {
  // Extracting client data
  const groomNickName = data?.step1?.groomNickname || 'Romeo';
  const brideNickName = data?.step1?.brideNickname || 'Juliet';
  
  // Default config
  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-white',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-serif italic text-gray-800">
          Selamat Datang
        </h2>
        
        <p className="text-gray-600 max-w-2xl leading-relaxed text-sm md:text-base">
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
        </p>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
          (Ar-Rum: 21)
        </p>

        <div className="pt-12">
          <p className="text-lg text-gray-700 mb-2">Pernikahan dari</p>
          <h3 className="font-serif text-4xl md:text-5xl text-brand-500">
            {groomNickName} & {brideNickName}
          </h3>
        </div>
      </div>
    </SectionWrapper>
  );
}
