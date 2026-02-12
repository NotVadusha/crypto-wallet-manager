"use client";

import { useRef, useEffect, createElement } from "react";
import "number-flow";

interface NumberFlowProps {
  value: number;
  format?: Intl.NumberFormatOptions;
  locales?: Intl.LocalesArgument;
  className?: string;
}

type NumberFlowElement = HTMLElement & {
  update(v: number): void;
  format?: Intl.NumberFormatOptions;
  locales?: Intl.LocalesArgument;
};

export const NumberFlow = ({
  value,
  format,
  locales,
  className,
}: NumberFlowProps) => {
  const ref = useRef<NumberFlowElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.update !== "function") return;
    if (format != null) el.format = format;
    if (locales != null) el.locales = locales;
    el.update(value);
  }, [value, format, locales]);

  return createElement("number-flow", { ref, className });
};
