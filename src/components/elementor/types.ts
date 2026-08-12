export interface ElementorSettings {
  [key: string]: any;
}

export interface ElementorElement {
  id: string;
  elType: 'section' | 'column' | 'widget' | 'container' | string;
  widgetType?: string;
  settings: ElementorSettings;
  elements: ElementorElement[];
  isInner?: boolean;
}

export interface ElementorTemplate {
  version: string;
  title: string;
  type: string;
  content: ElementorElement[];
}
