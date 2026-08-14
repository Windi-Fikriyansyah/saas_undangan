import React from 'react';
import SectionWrapper from './SectionWrapper';

export default function GalleryBlock({ data, config }: { data: any, config: any }) {
  const photos = data?.step3?.gallery || [
    "https://via.placeholder.com/600x800",
    "https://via.placeholder.com/800x600",
    "https://via.placeholder.com/600x600",
    "https://via.placeholder.com/800x800",
    "https://via.placeholder.com/600x400",
  ];

  const mergedConfig = {
    bgType: 'color',
    bgColor: 'bg-gray-900',
    padding: 'py-20 md:py-32',
    ...config
  };

  return (
    <SectionWrapper config={mergedConfig}>
      <div className="flex flex-col items-center justify-center text-center space-y-12 w-full">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Galeri Momen
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Kenangan manis yang tak terlupakan dalam perjalanan cinta kami.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 w-full space-y-4">
          {photos.map((photoUrl: string, idx: number) => (
            <div key={idx} className="break-inside-avoid overflow-hidden rounded-xl">
              {/* Using standard img to avoid next/image domain config issues for arbitrary urls */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photoUrl} 
                alt={`Gallery ${idx}`} 
                className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700 ease-in-out cursor-pointer"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
