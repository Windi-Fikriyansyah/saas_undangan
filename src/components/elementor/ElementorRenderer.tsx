import React from 'react';
import { ElementorElement } from './types';
import { WidgetRegistry } from './WidgetRegistry';
import { mapElementorStyles, getElementorClasses } from './utils/styleMapper';

interface ElementorRendererProps {
  elements: ElementorElement[];
}

export const ElementorRenderer: React.FC<ElementorRendererProps> = ({ elements }) => {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return null;
  }

  return (
    <>
      {elements.map((el) => {
        const { id, elType, settings, elements: children } = el;
        const styles = mapElementorStyles(settings || {});
        const classes = getElementorClasses(settings || {});

        if (elType === 'section') {
          return (
            <section
              key={id}
              className={`elementor-section flex flex-wrap w-full relative ${classes}`}
              style={styles}
              data-id={id}
            >
              {/* Elementor sections usually have a background overlay and container inside */}
              {settings?.background_overlay_background && (
                <div className="elementor-background-overlay absolute inset-0 w-full h-full" style={{
                  backgroundColor: settings.background_overlay_color,
                  opacity: settings.background_overlay_opacity?.size || 0.5,
                }}></div>
              )}
              <div className="elementor-container flex w-full max-w-7xl mx-auto flex-wrap relative z-10">
                <ElementorRenderer elements={children} />
              </div>
            </section>
          );
        }

        if (elType === 'column') {
          // Elementor columns use flexbox, often defaulting to 100% width on mobile, and varying on desktop
          // If _column_size is present, it's mapped to width in styleMapper.
          return (
            <div
              key={id}
              className={`elementor-column flex flex-col relative min-h-[1px] ${classes}`}
              style={{
                width: settings?._column_size ? `${settings._column_size}%` : '100%',
                ...styles
              }}
              data-id={id}
            >
              <div className="elementor-widget-wrap flex flex-col w-full">
                <ElementorRenderer elements={children} />
              </div>
            </div>
          );
        }

        if (elType === 'container') {
          // Newer Elementor flexbox containers
          const direction = settings?.direction || 'column';
          const justify = settings?.justify_content || 'flex-start';
          const align = settings?.align_items || 'stretch';
          const wrap = settings?.wrap || 'nowrap';
          
          const containerStyles: React.CSSProperties = {
            ...styles,
            display: 'flex',
            flexDirection: direction as any,
            justifyContent: justify,
            alignItems: align,
            flexWrap: wrap as any,
          };

          return (
            <div key={id} className={`elementor-container flex ${classes}`} style={containerStyles} data-id={id}>
               <ElementorRenderer elements={children} />
            </div>
          );
        }

        if (elType === 'widget') {
          return <WidgetRegistry key={id} element={el} />;
        }

        // Unknown element type
        return (
          <div key={id} className="p-4 bg-red-100 text-red-700">
            Unknown Element Type: {elType}
          </div>
        );
      })}
    </>
  );
};
