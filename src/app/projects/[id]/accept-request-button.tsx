"use client";

import { useState } from "react";
import { respondToRequest } from "~/app/projects/project-actions";
import { Button } from "~/components/ui/button";

const COLORS = [
  "var(--color-primary)",
  "var(--color-coral)",
  "var(--color-sunrise)",
  "var(--color-success)",
  "oklch(0.56 0.21 305)",
];

// 28 particles falling from the top: a quick "team formed!" celebration.
function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 6) * 40;
        const drift = ((i * 53) % 120) - 60;
        const rot = ((i * 97) % 540) + 180;
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative particles
            key={i}
            className="absolute size-2 rounded-[1px]"
            style={{
              left: `${left}%`,
              top: "-12px",
              background: COLORS[i % COLORS.length],
              animation: `confetti-fall ${900 + (i % 5) * 120}ms ease-in ${delay}ms forwards`,
              ["--cx" as string]: `${drift}px`,
              ["--cy" as string]: "70vh",
              ["--cr" as string]: `${rot}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

export function AcceptRequestButton({
  requestId,
  projectId,
  requesterId,
}: {
  requestId: string;
  projectId: string;
  requesterId: string;
}) {
  const [celebrate, setCelebrate] = useState(false);

  return (
    <form
      action={respondToRequest}
      onSubmit={() => setCelebrate(true)}
      className="flex-1"
    >
      <input type="hidden" name="request_id" value={requestId} />
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="requester_id" value={requesterId} />
      <input type="hidden" name="decision" value="accept" />
      <Button type="submit" size="sm" className="w-full">
        Accept
      </Button>
      {celebrate && <Confetti />}
    </form>
  );
}
