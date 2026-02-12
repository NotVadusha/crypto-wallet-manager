import type { TimePeriod } from "@/lib/types";

export const timePeriodLabels: Record<TimePeriod, string> = {
  "1H": "Past Hour",
  "6H": "Past 6 Hours",
  "1D": "Past Day",
  "1W": "Past Week",
  "1M": "Past Month",
  All: "All Time",
};

export const PERIODS: TimePeriod[] = ["1H", "6H", "1D", "1W", "1M", "All"];
