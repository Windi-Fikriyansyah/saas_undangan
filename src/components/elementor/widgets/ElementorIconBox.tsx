import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorIconBox: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const icon = settings.selected_icon?.value || '';
  const title = settings.title_text || '';
  const description = settings.description_text || '';
  
  const iconPositionMap: any = {
    left: 'flex-row',
    top: 'flex-col',
    right: 'flex-row-reverse',
  };
  
  const iconPosition = settings.icon_position || 'top';
  const flexDirection = iconPositionMap[iconPosition] || 'flex-col';
  
  const alignMap: any = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
    justify: 'text-justify items-stretch',
  };
  const alignClass = alignMap[settings.text_align] || 'text-center items-center';

  const iconStyle: React.CSSProperties = {
    color: settings.primary_color || 'inherit',
    fontSize: settings.icon_size?.size ? `${settings.icon_size.size}${settings.icon_size.unit || 'px'}` : '32px',
    padding: settings.icon_padding?.size ? `${settings.icon_padding.size}${settings.icon_padding.unit || 'px'}` : '0px',
  };

  const titleStyle: React.CSSProperties = {
    color: settings.title_color || 'inherit',
  };
  
  const TitleTag = (settings.title_size as keyof JSX.IntrinsicElements) || 'h3';

  return (
    <div className={`elementor-icon-box-wrapper flex ${flexDirection} ${alignClass} gap-4 w-full`}>
      {icon && (
        <div className="elementor-icon-box-icon" style={iconStyle}>
          <i className={icon} />
        </div>
      )}
      <div className="elementor-icon-box-content flex flex-col gap-2">
        {title && (
          <TitleTag className="elementor-icon-box-title font-semibold m-0" style={titleStyle}>
            {title}
          </TitleTag>
        )}
        {description && (
          <p className="elementor-icon-box-description text-gray-600 m-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
