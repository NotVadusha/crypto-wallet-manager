import type { TimePeriod } from "./types";

export const formatChartDate = (timestampMs: number, period: TimePeriod): string => {
  const d = new Date(timestampMs);

  if (period === "1H" || period === "6H" || period === "1D") {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (period === "1W") {
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }

  if (period === "1M") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};
