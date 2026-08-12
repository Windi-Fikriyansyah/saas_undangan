import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorIcon: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const icon = settings.selected_icon?.value;
  if (!icon) return null;

  const alignMap: any = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };
  
  const alignClass = alignMap[settings.align] || 'justify-center';
  
  const linkUrl = settings.link?.url;
  
  const iconStyle: React.CSSProperties = {
    color: settings.primary_color || 'inherit',
    fontSize: settings.size?.size ? `${settings.size.size}${settings.size.unit || 'px'}` : '32px',
  };

  const IconElement = () => (
    <div className={`elementor-icon-wrapper flex ${alignClass}`}>
      <div className="elementor-icon" style={iconStyle}>
        <i className={icon} />
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} target={settings.link?.is_external ? '_blank' : '_self'}>
        <IconElement />
      </a>
    );
  }

  return <IconElement />;
};
