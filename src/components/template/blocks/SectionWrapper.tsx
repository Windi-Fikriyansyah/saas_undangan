import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  config?: any;
  className?: string;
  id?: string;
}

export default function SectionWrapper({ children, config, className = '', id }: SectionWrapperProps) {
  // Parsing styling props dari JSON config
  const bgType = config?.bgType || 'color'; // 'color', 'image', 'video'
  const bgColor = config?.bgColor || 'bg-white'; // tailwind class atau hex
  const bgImage = config?.bgImage || '';
  const bgVideo = config?.bgVideo || '';
  const padding = config?.padding || 'py-16 md:py-24';
  const animation = config?.animation || 'animate-fade-in-up';
  
  // Construct dynamic classes
  let containerClasses = `relative w-full flex flex-col items-center justify-center overflow-hidden ${padding} ${className}`;
  
  // Handling background color if it's a valid tailwind class or hex
  const isHexColor = bgColor.startsWith('#');
  if (!isHexColor && bgType === 'color') {
    containerClasses += ` ${bgColor}`;
  }

  return (
    <section 
      id={id}
      className={containerClasses}
      style={{
        backgroundColor: isHexColor ? bgColor : undefined,
      }}
    >
      {/* Background Image Handling */}
      {bgType === 'image' && bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Background Video Handling */}
      {bgType === 'video' && bgVideo && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay if there's a background media to ensure text is readable */}
      {(bgType === 'image' || bgType === 'video') && (
        <div className="absolute inset-0 z-0 bg-black/40" />
      )}

      {/* Content Container */}
      <div className={`relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 ${animation}`}>
        {children}
      </div>
    </section>
  );
}
