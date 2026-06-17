import { COMMITMENT_LABELS } from "~/lib/constants";
import type { CommitmentLevel } from "~/lib/types";
import { cn } from "~/lib/utils";

const FILLED: Record<CommitmentLevel, number> = { low: 1, medium: 2, high: 3 };
const BAR_HEIGHTS = ["h-2", "h-3", "h-4"];

// Three rising bars visualising commitment (low/medium/high), filled amber.
export function CommitmentMeter({
  level,
  showLabel = true,
  className,
}: {
  level: CommitmentLevel;
  showLabel?: boolean;
  className?: string;
}) {
  const filled = FILLED[level];

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={COMMITMENT_LABELS[level]}
    >
      <span className="inline-flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "w-1.5 rounded-[1px]",
              BAR_HEIGHTS[i],
              i < filled ? "bg-sunrise" : "bg-border",
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-xs capitalize text-muted-foreground">
          {level}
        </span>
      )}
    </span>
  );
}
