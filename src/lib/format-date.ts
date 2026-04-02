type DateInput = Date | string;

export function formatDateIndonesia(
  value: DateInput,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    ...options,
  }).format(date);
}
