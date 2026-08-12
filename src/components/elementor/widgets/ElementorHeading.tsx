import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorHeading: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const Tag = (settings.header_size as keyof JSX.IntrinsicElements) || 'h2';
  const text = settings.title || '';
  const link = settings.link?.url;

  const content = <span dangerouslySetInnerHTML={{ __html: text }} />;

  return (
    <Tag className="elementor-heading-title elementor-size-default">
      {link ? (
        <a href={link} target={settings.link?.is_external ? '_blank' : '_self'}>
          {content}
        </a>
      ) : (
        content
      )}
    </Tag>
  );
};
