export const statusLabels = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;
export type EventStatus = keyof typeof statusLabels;

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatTime(date: Date | string) {
  return (
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(date)) + " WIB"
  );
}

export function toDateTimeInput(date: Date | string) {
  return new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
}

export function fromDateTimeInput(value: string) {
  return value ? `${value}:00+07:00` : "";
}
