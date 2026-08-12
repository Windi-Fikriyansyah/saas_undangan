import React from 'react';
import { ElementorElement } from './types';
import { mapElementorStyles, getElementorClasses } from './utils/styleMapper';

// Import Widgets
import { ElementorHeading } from './widgets/ElementorHeading';
import { ElementorTextEditor } from './widgets/ElementorTextEditor';
import { ElementorImage } from './widgets/ElementorImage';
import { ElementorButton } from './widgets/ElementorButton';
import { ElementorDivider } from './widgets/ElementorDivider';
import { ElementorSpacer } from './widgets/ElementorSpacer';
import { ElementorVideo } from './widgets/ElementorVideo';
import { ElementorIcon } from './widgets/ElementorIcon';
import { ElementorIconBox } from './widgets/ElementorIconBox';
import { ElementorImageBox } from './widgets/ElementorImageBox';
import { ElementorImageCarousel } from './widgets/ElementorImageCarousel';
import { ElementorGoogleMaps } from './widgets/ElementorGoogleMaps';
import { ElementorImageGallery } from './widgets/ElementorImageGallery';
import { ElementorIconList } from './widgets/ElementorIconList';
import { ElementorGuestbook } from './widgets/ElementorGuestbook';
import { ElementorWeddingWelcome } from './widgets/ElementorWeddingWelcome';
import { ElementorWeddingAudio } from './widgets/ElementorWeddingAudio';

interface WidgetRegistryProps {
  element: ElementorElement;
}

export const WidgetRegistry: React.FC<WidgetRegistryProps> = ({ element }) => {
  const { widgetType, settings, id } = element;
  
  if (!widgetType) {
    return <div className="text-red-500">Missing widgetType for element {id}</div>;
  }

  const styles = mapElementorStyles(settings);
  const classes = getElementorClasses(settings);

  // Widget Wrapper for margin/padding/backgrounds that apply to the widget container
  // In Elementor, every widget has an outer wrapper and an inner wrapper.
  const wrapperStyle = { ...styles }; 
  // We might need to separate typography styles from layout styles in a more complex setup, 
  // but for now, we apply them to the wrapper and let them inherit, or the widget handles it.

  const renderWidget = () => {
    switch (widgetType) {
      case 'heading':
        return <ElementorHeading settings={settings} />;
      case 'text-editor':
        return <ElementorTextEditor settings={settings} />;
      case 'image':
        return <ElementorImage settings={settings} />;
      case 'button':
        return <ElementorButton settings={settings} />;
      case 'divider':
        return <ElementorDivider settings={settings} />;
      case 'spacer':
        return <ElementorSpacer settings={settings} />;
      case 'video':
        return <ElementorVideo settings={settings} />;
      case 'icon':
        return <ElementorIcon settings={settings} />;
      case 'icon-box':
        return <ElementorIconBox settings={settings} />;
      case 'icon-list':
        return <ElementorIconList settings={settings} />;
      case 'image-box':
        return <ElementorImageBox settings={settings} />;
      case 'image-carousel':
        return <ElementorImageCarousel settings={settings} />;
      case 'image-gallery':
        return <ElementorImageGallery settings={settings} />;
      case 'google_maps':
        return <ElementorGoogleMaps settings={settings} />;
      case 'landingstarwedding-guestbook':
        return <ElementorGuestbook settings={settings} />;
      case 'landingstarwedding-wellcome':
        return <ElementorWeddingWelcome settings={settings} />;
      case 'landingstarwedding-audio':
        return <ElementorWeddingAudio settings={settings} />;
      default:
        // Fallback for unsupported widgets
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 text-center text-sm text-gray-500">
            Unsupported Widget: {widgetType}
          </div>
        );
    }
  };

  return (
    <div className={`elementor-widget elementor-widget-${widgetType} ${classes}`} style={wrapperStyle} data-id={id}>
      <div className="elementor-widget-container">
        {renderWidget()}
      </div>
    </div>
  );
};
