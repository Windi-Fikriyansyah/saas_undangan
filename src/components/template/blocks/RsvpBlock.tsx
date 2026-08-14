import React from 'react';
import SectionWrapper from './SectionWrapper';
import RsvpForm from '../RsvpForm';

export default function RsvpBlock({ data, config, orderId, guestName }: { data: any, config: any, orderId?: string, guestName?: string }) {
  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-[#F9F7F1]',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
            Kehadiran & Ucapan
          </h2>
          <p className="text-gray-500">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-2 md:p-8">
          <RsvpForm 
            orderId={orderId || 'preview-mode'} 
            defaultName={guestName || ''}
            config={{
              typography: { headingFont: 'serif' }
            }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
