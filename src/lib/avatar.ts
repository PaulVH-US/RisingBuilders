// Deterministic gradient avatars derived from a seed string (username).
// Same seed always yields the same colors, so a builder looks consistent
// across the feed, member lists, and chat, with no profile images needed.

function hashString(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

// A small, on-brand palette (indigo → violet → magenta → coral → amber) so
// avatars feel cohesive instead of a noisy rainbow, while still distinguishing
// builders from one another.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.55 0.18 272), oklch(0.58 0.2 296))",
  "linear-gradient(135deg, oklch(0.58 0.2 300), oklch(0.6 0.2 330))",
  "linear-gradient(135deg, oklch(0.6 0.2 330), oklch(0.64 0.2 8))",
  "linear-gradient(135deg, oklch(0.63 0.19 18), oklch(0.72 0.16 48))",
  "linear-gradient(135deg, oklch(0.5 0.16 262), oklch(0.57 0.19 288))",
  "linear-gradient(135deg, oklch(0.62 0.19 350), oklch(0.66 0.18 22))",
];

export function avatarGradient(seed: string): string {
  return AVATAR_GRADIENTS[hashString(seed || "?") % AVATAR_GRADIENTS.length];
}

// A stable accent color for a category/tag, used for the card's accent border.
export function seededColor(
  seed: string,
  lightness = 0.6,
  chroma = 0.16,
): string {
  const hue = hashString(seed || "?") % 360;
  return `oklch(${lightness} ${chroma} ${hue})`;
}

export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
