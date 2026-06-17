import { cn } from "~/lib/utils";

// Ascending bars: the "rising" mark. Tallest bar warms to coral.
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      role="img"
      aria-label="Rising Builders"
    >
      <rect
        x="1.5"
        y="15"
        width="3.6"
        height="7"
        rx="1.2"
        className="fill-primary"
      />
      <rect
        x="6.9"
        y="11"
        width="3.6"
        height="11"
        rx="1.2"
        className="fill-primary"
      />
      <rect
        x="12.3"
        y="7"
        width="3.6"
        height="15"
        rx="1.2"
        className="fill-primary"
      />
      <rect
        x="17.7"
        y="2"
        width="3.6"
        height="20"
        rx="1.2"
        className="fill-coral"
      />
    </svg>
  );
}

// Logo + gradient wordmark, used in the navbar and auth/landing pages.
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BrandLogo />
      <span className="text-rising font-display font-bold tracking-tight">
        Rising Builders
      </span>
    </span>
  );
}
