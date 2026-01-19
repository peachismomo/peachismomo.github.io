export function formatJobDates(dateStart: Date, dateEnd?: Date): string {
  const start = new Date(dateStart);
  const end = dateEnd ? new Date(dateEnd) : null;

  const startStr = `${start.toLocaleString("default", { month: "short" })} ${start.getFullYear()}`;
  const endStr = end
    ? `${end.toLocaleString("default", { month: "short" })} ${end.getFullYear()}`
    : "Present";

  return `${startStr} - ${endStr}`;
}
