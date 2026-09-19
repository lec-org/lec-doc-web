export function downloadFilename(header: unknown, fallback: string): string {
  if (typeof header !== "string") return fallback;
  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = header.match(/filename="?([^";]+)"?/i)?.[1];
  const value = encoded ?? plain;
  if (!value) return fallback;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
