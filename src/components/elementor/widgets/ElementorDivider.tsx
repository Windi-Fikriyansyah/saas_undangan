import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorDivider: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const alignMap: any = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };
  
  const alignClass = alignMap[settings.align] || 'mx-auto';
  
  const width = settings.width?.size ? `${settings.width.size}${settings.width.unit || '%'}` : '100%';
  const style = settings.style || 'solid';
  const weight = settings.weight?.size || 1;
  const color = settings.color || '#e0e0e0';

  return (
    <div className="elementor-divider w-full flex items-center">
      <span 
        className={`elementor-divider-separator ${alignClass}`}
        style={{
          width,
          borderTopStyle: style as any,
          borderTopWidth: `${weight}px`,
          borderTopColor: color,
        }}
      />
    </div>
  );
};
