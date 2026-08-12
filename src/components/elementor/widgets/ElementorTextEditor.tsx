import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorTextEditor: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const editorContent = settings.editor || '';

  return (
    <div 
      className="elementor-text-editor elementor-clearfix"
      dangerouslySetInnerHTML={{ __html: editorContent }}
    />
  );
};
