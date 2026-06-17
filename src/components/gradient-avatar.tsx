import { avatarGradient, initials } from "~/lib/avatar";
import { cn } from "~/lib/utils";

interface GradientAvatarProps {
  name: string;
  size?: number;
  className?: string;
  /** Ring matching the page background, for overlapping avatar piles. */
  ring?: boolean;
}

// A colorful, deterministic initials avatar. Pure/server-safe.
export function GradientAvatar({
  name,
  size = 36,
  className,
  ring = false,
}: GradientAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white",
        ring && "ring-2 ring-background",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        backgroundImage: avatarGradient(name),
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
