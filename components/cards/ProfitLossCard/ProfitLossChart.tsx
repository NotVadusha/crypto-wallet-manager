"use client";

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatChartDate } from "@/lib/chart-utils";
import type { ChartDataPoint, TimePeriod } from "@/lib/types";
import { getYAxisDomain } from "./utils";
import { ProfitLossTooltip } from "./ProfitLossTooltip";

const CHART_HEIGHT = 120;

export interface ProfitLossChartProps {
  data: ChartDataPoint[];
  selectedPeriod: TimePeriod;
  chartWidth: number;
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onHoveredPointChange: (point: ChartDataPoint | null) => void;
}

export function ProfitLossChart({
  data,
  selectedPeriod,
  chartWidth,
  isLoading,
  containerRef,
  onHoveredPointChange,
}: ProfitLossChartProps) {
  const yDomain = getYAxisDomain(data);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden relative"
      onMouseLeave={() => onHoveredPointChange(null)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart
          width={chartWidth || 700}
          height={CHART_HEIGHT}
          data={data}
          margin={{ top: 12, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FF5100" stopOpacity={0} />
              <stop offset="100%" stopColor="#FF5100" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => formatChartDate(ts, selectedPeriod)}
            axisLine={false}
            tickLine={false}
            hide
          />
          <YAxis domain={yDomain} hide />
          <Tooltip
            content={
              <ProfitLossTooltip setHoveredPoint={onHoveredPointChange} />
            }
            cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
          />
          <Area
            type="natural"
            dataKey="value"
            stroke="#FF5100"
            strokeWidth={2}
            fill="url(#profitGradient)"
            baseValue={yDomain[0]}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
