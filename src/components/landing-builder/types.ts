import { z } from "zod";

// Base block definition
export interface BlockDefinition<T = any> {
  type: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  defaultData: T;
  schema: z.ZodType<T>;
  component: React.ComponentType<{ data: T; isPreview?: boolean }>;
  editor?: React.ComponentType<{ data: T; onChange: (data: T) => void }>;
}

// Instance of a block in the builder
export interface BlockInstance {
  id: string; // unique uuid for the instance
  type: string;
  data: any;
}
