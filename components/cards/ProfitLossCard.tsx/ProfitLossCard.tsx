"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Area, AreaChart, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Upload } from "lucide-react";
import GrowthTriangle from "@/components/GrowthTriangle";

type TimePeriod = "1H" | "6H" | "1D" | "1W" | "1M" | "All";

const timePeriodLabels: Record<TimePeriod, string> = {
  "1H": "Past Hour",
  "6H": "Past 6 Hours",
  "1D": "Past Day",
  "1W": "Past Week",
  "1M": "Past Month",
  All: "All Time",
};

function generateChartData(period: TimePeriod) {
  const baseData: Record<TimePeriod, number[]> = {
    "1H": [210, 215, 218, 220, 216, 219, 222, 223],
    "6H": [180, 195, 210, 225, 215, 220, 230, 218, 225, 210, 220, 223],
    "1D": [
      150, 165, 180, 200, 210, 225, 215, 230, 220, 225, 210, 218, 225, 220, 215,
      222, 218, 223,
    ],
    "1W": [
      100, 130, 160, 140, 180, 200, 175, 210, 195, 220, 205, 230, 215, 225, 210,
      220, 223,
    ],
    "1M": [
      50, 80, 120, 90, 140, 170, 130, 190, 160, 200, 180, 220, 195, 210, 230,
      215, 225, 210, 220, 223,
    ],
    All: [
      20, 60, 40, 100, 80, 150, 120, 180, 140, 200, 170, 220, 190, 230, 210,
      225, 215, 220, 223,
    ],
  };

  return baseData[period].map((value, index) => ({
    time: index,
    value,
  }));
}

const profitValues: Record<TimePeriod, number> = {
  "1H": 13.21,
  "6H": 43.12,
  "1D": 223.43,
  "1W": 523.87,
  "1M": 1173.43,
  All: 2203.43,
};

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(Math.floor(el.getBoundingClientRect().width));

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.floor(entry.contentRect.width));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

const ProfitLossCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("6H");
  const { ref: chartContainerRef, width: chartWidth } = useContainerWidth();

  const chartData = useMemo(
    () => generateChartData(selectedPeriod),
    [selectedPeriod]
  );

  const profitValue = profitValues[selectedPeriod];
  const isPositive = profitValue >= 0;

  return (
    <Card className="w-full max-w-3xl gap-0 pb-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <GrowthTriangle value={profitValue} />
            <span className="text-muted-foreground">Profit/Loss</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="size-3.5" />
          </button>
        </div>

        <ToggleGroup
          type="single"
          value={selectedPeriod}
          onValueChange={(value) => {
            if (value) setSelectedPeriod(value as TimePeriod);
          }}
          size="sm"
          className="gap-0"
        >
          {(["1H", "6H", "1D", "1W", "1M", "All"] as TimePeriod[]).map(
            (period) => (
              <ToggleGroupItem
                key={period}
                value={period}
                className="h-6 px-3 py-2 text-xs font-normal data-[state=on]:bg-primary/10 data-[state=on]:text-primary text-muted-foreground rounded-2xl!"
              >
                {period}
              </ToggleGroupItem>
            )
          )}
        </ToggleGroup>
      </CardHeader>

      <CardContent className="px-4 pb-0">
        <div className="flex items-start justify-between px-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[40px] font-normal">
              {isPositive ? "+" : "-"}${Math.abs(profitValue).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              {timePeriodLabels[selectedPeriod]}
            </span>
          </div>
        </div>

        <div ref={chartContainerRef} className="mt-2 w-full overflow-hidden">
          <AreaChart
            width={chartWidth || 700}
            height={120}
            data={chartData}
            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5100" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#FF5100" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["dataMin - 20", "dataMax + 10"]} hide />
            <Area
              type="natural"
              dataKey="value"
              stroke="#FF5100"
              strokeWidth={2}
              fill="url(#profitGradient)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossCard;
