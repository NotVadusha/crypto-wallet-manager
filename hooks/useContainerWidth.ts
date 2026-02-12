"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

export const useContainerWidth = (): { ref: RefObject<HTMLDivElement | null>; width: number } => {
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
};
