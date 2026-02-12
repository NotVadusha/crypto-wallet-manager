"use client";

import { motion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motionButtonPreset } from "@/components/ui/motion-button";
import GrowthArrow from "@/components/GrowthArrow";
import { Upload } from "lucide-react";
import { PERIODS } from "./constants";
import type { TimePeriod } from "@/lib/types";

const MotionToggleGroupItem = motion.create(ToggleGroupItem);

export interface ProfitLossHeaderProps {
  totalProfitLoss: number;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export function ProfitLossHeader({
  totalProfitLoss,
  selectedPeriod,
  onPeriodChange,
}: ProfitLossHeaderProps) {
  return (
    <div className="flex flex-row items-center p-0 justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <GrowthArrow value={totalProfitLoss} />
          <span className="text-muted-foreground">Profit/Loss</span>
        </div>
        <Upload className="size-4 text-muted-foreground" />
      </div>

      <ToggleGroup
        type="single"
        value={selectedPeriod}
        onValueChange={(value) => {
          if (value) onPeriodChange(value as TimePeriod);
        }}
        size="sm"
        className="gap-0"
      >
        {PERIODS.map((period) => (
          <MotionToggleGroupItem
            key={period}
            value={period}
            className="h-6 px-3 py-2 text-xs font-normal data-[state=on]:bg-primary/10 data-[state=on]:text-primary text-muted-foreground rounded-2xl!"
            {...motionButtonPreset}
          >
            {period}
          </MotionToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
