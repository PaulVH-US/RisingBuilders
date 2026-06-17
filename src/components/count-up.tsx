"use client";

import { useEffect, useState } from "react";

// Animates from 0 to `value` once on mount (eased). Stats that count up.
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start = 0;
    const duration = 700;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{n}</span>;
}
