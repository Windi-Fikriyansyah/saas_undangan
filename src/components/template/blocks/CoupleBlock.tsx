import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function CoupleBlock({ data, config }: { data: any, config: any }) {
  const groomName = data?.step1?.groomName || 'Romeo Montague';
  const brideName = data?.step1?.brideName || 'Juliet Capulet';
  
  const groomParent = data?.step1?.groomParents || 'Bapak Montague & Ibu Montague';
  const brideParent = data?.step1?.brideParents || 'Bapak Capulet & Ibu Capulet';

  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-[#F9F7F1]',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
        
        {/* Groom */}
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-48 h-64 bg-gray-300 rounded-t-[100px] rounded-b-[10px] mb-6 overflow-hidden shadow-lg border-4 border-white">
            {/* Placeholder for Groom Image */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Foto Pria</div>
          </div>
          <h3 className="font-serif text-3xl text-gray-800 mb-2">{groomName}</h3>
          <p className="text-gray-500 text-sm">
            Putra dari <br/><span className="font-semibold text-gray-700">{groomParent}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:flex flex-col items-center justify-center h-full">
          <span className="font-serif text-6xl text-brand-500">&</span>
        </div>
        <div className="md:hidden flex items-center justify-center">
          <span className="font-serif text-5xl text-brand-500">&</span>
        </div>

        {/* Bride */}
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-48 h-64 bg-gray-300 rounded-t-[100px] rounded-b-[10px] mb-6 overflow-hidden shadow-lg border-4 border-white">
            {/* Placeholder for Bride Image */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Foto Wanita</div>
          </div>
          <h3 className="font-serif text-3xl text-gray-800 mb-2">{brideName}</h3>
          <p className="text-gray-500 text-sm">
            Putri dari <br/><span className="font-semibold text-gray-700">{brideParent}</span>
          </p>
        </div>

      </div>
    </SectionWrapper>
  );
}
