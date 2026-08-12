import React from 'react';
import { ElementorSettings } from '../types';

/**
 * Maps Elementor settings to React inline styles.
 * Note: Elementor settings are highly complex and can contain responsive values
 * (e.g., `margin`, `margin_tablet`, `margin_mobile`) and pseudo-classes.
 * For this initial robust version, we parse standard properties.
 */
export function mapElementorStyles(settings: ElementorSettings): React.CSSProperties {
  if (!settings) return {};

  const style: React.CSSProperties = {};

  // Background
  if (settings.background_background === 'classic') {
    if (settings.background_color) {
      style.backgroundColor = settings.background_color;
    }
    if (settings.background_image?.url) {
      style.backgroundImage = `url(${settings.background_image.url})`;
      style.backgroundPosition = settings.background_position || 'center center';
      style.backgroundRepeat = settings.background_repeat || 'no-repeat';
      style.backgroundSize = settings.background_size || 'cover';
    }
  } else if (settings.background_background === 'gradient') {
    // Basic gradient support
    if (settings.background_color && settings.background_color_b) {
      const type = settings.background_gradient_type || 'linear';
      const angle = settings.background_gradient_angle?.size || 180;
      if (type === 'linear') {
        style.backgroundImage = `linear-gradient(${angle}deg, ${settings.background_color}, ${settings.background_color_b})`;
      } else {
        style.backgroundImage = `radial-gradient(at center center, ${settings.background_color}, ${settings.background_color_b})`;
      }
    }
  }

  // Padding
  if (settings.padding) {
    style.padding = `${settings.padding.top || 0}${settings.padding.unit || 'px'} ${settings.padding.right || 0}${settings.padding.unit || 'px'} ${settings.padding.bottom || 0}${settings.padding.unit || 'px'} ${settings.padding.left || 0}${settings.padding.unit || 'px'}`;
  }
  
  // Margin
  if (settings.margin) {
    style.margin = `${settings.margin.top || 0}${settings.margin.unit || 'px'} ${settings.margin.right || 0}${settings.margin.unit || 'px'} ${settings.margin.bottom || 0}${settings.margin.unit || 'px'} ${settings.margin.left || 0}${settings.margin.unit || 'px'}`;
  }

  // Border
  if (settings.border_border && settings.border_border !== 'none') {
    style.borderStyle = settings.border_border;
    if (settings.border_width) {
      style.borderWidth = `${settings.border_width.top || 0}px ${settings.border_width.right || 0}px ${settings.border_width.bottom || 0}px ${settings.border_width.left || 0}px`;
    }
    if (settings.border_color) {
      style.borderColor = settings.border_color;
    }
  }

  // Border Radius
  if (settings.border_radius) {
    style.borderRadius = `${settings.border_radius.top || 0}px ${settings.border_radius.right || 0}px ${settings.border_radius.bottom || 0}px ${settings.border_radius.left || 0}px`;
  }

  // Box Shadow
  if (settings.box_shadow_box_shadow_type === 'yes' && settings.box_shadow_box_shadow) {
    const bs = settings.box_shadow_box_shadow;
    style.boxShadow = `${bs.horizontal}px ${bs.vertical}px ${bs.blur}px ${bs.spread}px ${bs.color}`;
  }

  // Typography (used often in widgets)
  if (settings.typography_typography === 'custom') {
    if (settings.typography_font_family) style.fontFamily = settings.typography_font_family;
    if (settings.typography_font_size?.size) style.fontSize = `${settings.typography_font_size.size}${settings.typography_font_size.unit || 'px'}`;
    if (settings.typography_font_weight) style.fontWeight = settings.typography_font_weight;
    if (settings.typography_text_transform) style.textTransform = settings.typography_text_transform as any;
    if (settings.typography_font_style) style.fontStyle = settings.typography_font_style;
    if (settings.typography_line_height?.size) style.lineHeight = `${settings.typography_line_height.size}${settings.typography_line_height.unit || 'em'}`;
    if (settings.typography_letter_spacing?.size) style.letterSpacing = `${settings.typography_letter_spacing.size}px`;
  }

  // Text Color
  if (settings.text_color) {
    style.color = settings.text_color;
  }
  
  if (settings.title_color) { // Specific to heading widget
    style.color = settings.title_color;
  }

  // Alignment
  if (settings.align) {
    style.textAlign = settings.align as any;
  }

  // Width (used in columns or containers)
  if (settings._column_size) {
    style.width = `${settings._column_size}%`;
  }
  if (settings.content_width === 'full') {
    style.width = '100%';
    style.maxWidth = '100%';
  }

  return style;
}

export function getElementorClasses(settings: ElementorSettings): string {
  if (!settings) return "";
  const classes = [];
  
  // E.g., custom classes provided in advanced settings
  if (settings.css_classes) {
    classes.push(settings.css_classes);
  }

  return classes.join(" ");
}
