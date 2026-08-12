import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorImageBox: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const imageUrl = settings.image?.url;
  const title = settings.title_text || '';
  const description = settings.description_text || '';
  
  const iconPositionMap: any = {
    left: 'flex-row',
    top: 'flex-col',
    right: 'flex-row-reverse',
  };
  
  const iconPosition = settings.position || 'top';
  const flexDirection = iconPositionMap[iconPosition] || 'flex-col';
  
  const alignMap: any = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
    justify: 'text-justify items-stretch',
  };
  const alignClass = alignMap[settings.text_align] || 'text-center items-center';

  const TitleTag = (settings.title_size as keyof JSX.IntrinsicElements) || 'h3';

  return (
    <div className={`elementor-image-box-wrapper flex ${flexDirection} ${alignClass} gap-4 w-full`}>
      {imageUrl && (
        <figure className="elementor-image-box-img m-0 shrink-0">
          <img 
            src={imageUrl} 
            alt={settings.image?.alt || title || 'image box'}
            className="max-w-full h-auto object-cover"
            style={{
              width: settings.image_size?.size ? `${settings.image_size.size}${settings.image_size.unit || 'px'}` : 'auto',
              borderRadius: settings.image_border_radius?.top ? `${settings.image_border_radius.top}px` : undefined,
            }}
          />
        </figure>
      )}
      <div className="elementor-image-box-content flex flex-col gap-2">
        {title && (
          <TitleTag className="elementor-image-box-title font-semibold m-0">
            {title}
          </TitleTag>
        )}
        {description && (
          <p className="elementor-image-box-description text-gray-600 m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
