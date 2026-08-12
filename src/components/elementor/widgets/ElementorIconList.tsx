import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorIconList: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const iconList = settings.icon_list || [];
  if (!iconList || iconList.length === 0) return null;

  const layout = settings.view || 'traditional'; // traditional (vertical) or inline (horizontal)
  const layoutClass = layout === 'inline' ? 'flex-row flex-wrap' : 'flex-col';

  const alignMap: any = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  };
  const alignClass = alignMap[settings.align] || 'justify-start';

  const iconColor = settings.icon_color || 'inherit';
  const textColor = settings.text_color || 'inherit';

  return (
    <div className={`elementor-icon-list-wrapper w-full`}>
      <ul className={`elementor-icon-list-items flex ${layoutClass} ${alignClass} gap-3 m-0 p-0 list-none`}>
        {iconList.map((item: any, index: number) => {
          const icon = item.selected_icon?.value;
          const text = item.text || '';
          const link = item.link?.url;

          const content = (
            <span className="elementor-icon-list-text" style={{ color: textColor }}>
              {text}
            </span>
          );

          const iconContent = icon ? (
            <span className="elementor-icon-list-icon flex items-center justify-center shrink-0" style={{ color: iconColor }}>
              <i className={icon} />
            </span>
          ) : null;

          const innerContent = (
            <>
              {iconContent}
              {content}
            </>
          );

          return (
            <li key={item.id || index} className="elementor-icon-list-item flex items-center gap-2 m-0 p-0">
              {link ? (
                <a href={link} className="flex items-center gap-2 no-underline hover:underline" target={item.link?.is_external ? '_blank' : '_self'}>
                  {innerContent}
                </a>
              ) : (
                innerContent
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
