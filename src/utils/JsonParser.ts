export function ReadJson<T>(jsonData: unknown): T[] {
  return jsonData as T[];
}
