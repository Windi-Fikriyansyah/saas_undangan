import { weddingSchema, blockSchemas, type WeddingConfig } from "@/types/wedding";

export function validateWeddingConfig(input: unknown): WeddingConfig {
  const parsed = weddingSchema.parse(input);
  for (const block of parsed.blocks) {
    const schema = blockSchemas[block.type as keyof typeof blockSchemas];
    if (schema) schema.parse(block.props);
  }
  return parsed;
}

export function safeValidateWeddingConfig(input: unknown) {
  const result = weddingSchema.safeParse(input);
  if (!result.success) return { success: false as const, errors: result.error.flatten() };
  for (const block of result.data.blocks) {
    const schema = blockSchemas[block.type as keyof typeof blockSchemas];
    if (schema) {
      const check = schema.safeParse(block.props);
      if (!check.success) return { success: false as const, errors: check.error.flatten(), blockId: block.id };
    }
  }
  return { success: true as const, data: result.data };
}
