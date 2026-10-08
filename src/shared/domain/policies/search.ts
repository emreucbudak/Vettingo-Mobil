export function matchesText(query: string, values: string[]) {
  const text = values.join(" ").toLocaleLowerCase("tr-TR");
  return query
    .trim()
    .toLocaleLowerCase("tr-TR")
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}
