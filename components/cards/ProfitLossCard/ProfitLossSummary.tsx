"use client";

import { NumberFlow } from "@/components/ui/number-flow";

export interface ProfitLossSummaryProps {
  value: number;
  label: string;
}

export function ProfitLossSummary({ value, label }: ProfitLossSummaryProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[2.5rem] font-normal">
        <NumberFlow
          value={value}
          format={{
            style: "currency",
            currency: "USD",
            signDisplay: "always",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
        />
      </span>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
