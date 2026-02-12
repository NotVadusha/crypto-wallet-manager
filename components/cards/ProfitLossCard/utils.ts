import type { ChartDataPoint } from "@/lib/types";

export function getYAxisDomain(data: ChartDataPoint[]): [number, number] {
  if (!data.length) return [0, 100];

  const values = data.map((d) => d.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const range = dataMax - dataMin;
  const padding = range > 0 ? Math.max(range * 0.15, 50) : 50;

  return [dataMin - padding, dataMax + padding];
}
