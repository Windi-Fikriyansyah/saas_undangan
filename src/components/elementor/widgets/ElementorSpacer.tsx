import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorSpacer: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const space = settings.space?.size || 50;
  const unit = settings.space?.unit || 'px';

  return (
    <div 
      className="elementor-spacer" 
      style={{ height: `${space}${unit}` }} 
    />
  );
};
