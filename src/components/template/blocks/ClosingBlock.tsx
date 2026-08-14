import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function ClosingBlock({ data, config }: { data: any, config: any }) {
  const groomNickName = data?.step1?.groomNickname || 'Romeo';
  const brideNickName = data?.step1?.brideNickname || 'Juliet';
  
  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-white',
    padding: 'py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
        </p>
        <p className="text-gray-800 font-semibold uppercase tracking-widest text-sm mt-8">
          Terima Kasih
        </p>
        
        <div className="pt-12 border-t border-gray-200 mt-12 w-full max-w-sm">
          <h2 className="font-serif text-5xl md:text-6xl text-brand-500 italic">
            {groomNickName} & {brideNickName}
          </h2>
        </div>
      </div>
    </SectionWrapper>
  );
}
