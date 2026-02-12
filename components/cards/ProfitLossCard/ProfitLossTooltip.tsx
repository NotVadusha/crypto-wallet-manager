"use client";

import { useEffect } from "react";
import type { ChartDataPoint } from "@/lib/types";

export interface ProfitLossTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
  setHoveredPoint: (point: ChartDataPoint | null) => void;
}

export function ProfitLossTooltip({
  active,
  payload,
  setHoveredPoint,
}: ProfitLossTooltipProps) {
  const point = active && payload?.[0] ? payload[0].payload : null;

  useEffect(() => {
    setHoveredPoint(point);
  }, [point, setHoveredPoint]);

  if (!point) return null;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-foreground">
        $
        {point.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <div className="text-muted-foreground">{point.date}</div>
    </div>
  );
}
