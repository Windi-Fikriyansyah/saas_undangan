import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorButton: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const text = settings.text || 'Click Here';
  const link = settings.link?.url;
  
  // Basic button styles, mapping Elementor settings
  const buttonStyle: React.CSSProperties = {
    backgroundColor: settings.background_color || '#333',
    color: settings.button_text_color || '#fff',
    borderRadius: settings.border_radius ? `${settings.border_radius.top || 0}px ${settings.border_radius.right || 0}px ${settings.border_radius.bottom || 0}px ${settings.border_radius.left || 0}px` : '4px',
    padding: settings.text_padding ? `${settings.text_padding.top || 10}px ${settings.text_padding.right || 20}px ${settings.text_padding.bottom || 10}px ${settings.text_padding.left || 20}px` : '12px 24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontWeight: 500,
  };

  const alignMap: any = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    justify: 'justify-between w-full'
  };
  
  const alignClass = alignMap[settings.align] || 'justify-start';

  const btnElement = (
    <span className="elementor-button-content-wrapper flex items-center justify-center gap-2">
      {settings.selected_icon?.value && (
        <span className="elementor-button-icon">
          {/* For now, just render the class name as an icon if it's fontawesome */}
          <i className={settings.selected_icon.value} />
        </span>
      )}
      <span className="elementor-button-text">{text}</span>
    </span>
  );

  return (
    <div className={`elementor-button-wrapper flex ${alignClass}`}>
      {link ? (
        <a href={link} style={buttonStyle} className="elementor-button" target={settings.link?.is_external ? '_blank' : '_self'}>
          {btnElement}
        </a>
      ) : (
        <button style={buttonStyle} className="elementor-button">
          {btnElement}
        </button>
      )}
    </div>
  );
};
