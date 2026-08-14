export function getPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function interpolate<T>(value: T, data: Record<string, any>): T {
  if (typeof value === "string") {
    // If the value is EXACTLY a single variable (e.g. "{{gallery.images}}"), return the object directly
    const exactMatch = value.match(/^\{\{\s*([^}]+)\s*\}\}$/);
    if (exactMatch) {
      const result = getPath(data, exactMatch[1].trim());
      if (result !== undefined && typeof result !== "string") {
        return result as T;
      }
    }

    return value.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, path) => {
      const result = getPath(data, path.trim());
      return result == null ? "" : String(result);
    }) as T;
  }
  if (Array.isArray(value)) return value.map((v) => interpolate(v, data)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as any).map(([k, v]) => [k, interpolate(v, data)])) as T;
  }
  return value;
}
