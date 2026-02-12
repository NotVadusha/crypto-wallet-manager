"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import { getProfitLossHistory } from "@/app/actions/chart";
import type {
  ChartDataPoint,
  ProfitLossChartResult,
  TimePeriod,
} from "@/lib/types";
import { timePeriodLabels } from "./constants";
import { ProfitLossHeader } from "./ProfitLossHeader";
import { ProfitLossSummary } from "./ProfitLossSummary";
import { ProfitLossChart } from "./ProfitLossChart";

export interface ProfitLossCardProps {
  initialData: ProfitLossChartResult;
}

export default function ProfitLossCard({ initialData }: ProfitLossCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("6H");
  const [chartData, setChartData] = useState<ChartDataPoint[]>(
    initialData.data
  );
  const [profitLoss, setProfitLoss] = useState({
    total: initialData.totalProfitLoss,
    percent: initialData.totalProfitLossPercent,
  });
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { ref: chartContainerRef, width: chartWidth } = useContainerWidth();

  const fetchChartData = useCallback(async (period: TimePeriod) => {
    setIsLoading(true);
    setHoveredPoint(null);

    try {
      const result = await getProfitLossHistory(period);
      setChartData(result.data);
      setProfitLoss({
        total: result.totalProfitLoss,
        percent: result.totalProfitLossPercent,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPeriod === "6H") {
      setHoveredPoint(null);
      setChartData(initialData.data);
      setProfitLoss({
        total: initialData.totalProfitLoss,
        percent: initialData.totalProfitLossPercent,
      });
      return;
    }

    fetchChartData(selectedPeriod);
  }, [selectedPeriod]); // eslint-disable-line react-hooks/exhaustive-deps -- only refetch when period changes; initialData used only for 6H

  const displayValue = hoveredPoint ? hoveredPoint.value : profitLoss.total;
  const summaryLabel = hoveredPoint
    ? hoveredPoint.date
    : timePeriodLabels[selectedPeriod];

  return (
    <Card className="w-full max-w-160 h-62 gap-0 p-5 pb-0 overflow-hidden rounded-md">
      <CardHeader className="flex flex-row items-center p-0 justify-between">
        <ProfitLossHeader
          totalProfitLoss={profitLoss.total}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <ProfitLossSummary value={displayValue} label={summaryLabel} />
        </div>

        <ProfitLossChart
          data={chartData}
          selectedPeriod={selectedPeriod}
          chartWidth={chartWidth ?? 0}
          isLoading={isLoading}
          containerRef={chartContainerRef}
          onHoveredPointChange={setHoveredPoint}
        />
      </CardContent>
    </Card>
  );
}
