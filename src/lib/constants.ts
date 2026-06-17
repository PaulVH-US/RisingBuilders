import type { CommitmentLevel, Goal } from "~/lib/types";

// Suggested tag vocabularies. Free-form tags are still allowed; these power the
// quick-add chips during onboarding, project creation, and feed filtering.
export const SKILL_OPTIONS = [
  "coding",
  "design",
  "marketing",
  "product",
  "writing",
  "data",
  "video",
  "business",
] as const;

export const INTEREST_OPTIONS = [
  "AI",
  "education",
  "health",
  "climate",
  "productivity",
  "community",
  "sports",
  "food",
  "sustainability",
  "gaming",
] as const;

export const CATEGORY_OPTIONS = INTEREST_OPTIONS;

export const GOAL_OPTIONS: {
  value: Goal;
  label: string;
  description: string;
}[] = [
  {
    value: "start",
    label: "Start a project",
    description: "I have an idea and want to build a team.",
  },
  {
    value: "join",
    label: "Join a project",
    description: "I want to contribute my skills to someone's build.",
  },
  {
    value: "explore",
    label: "Explore",
    description: "I'm here to look around and meet builders.",
  },
];

export const COMMITMENT_OPTIONS: {
  value: CommitmentLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "low",
    label: "Low",
    description: "A few hours a week / weekend project",
  },
  { value: "medium", label: "Medium", description: "Steady weekly progress" },
  { value: "high", label: "High", description: "All-in, building fast" },
];

export const GOAL_LABELS: Record<Goal, string> = {
  start: "Starting a project",
  join: "Looking to join",
  explore: "Exploring",
};

export const COMMITMENT_LABELS: Record<CommitmentLevel, string> = {
  low: "Low commitment",
  medium: "Medium commitment",
  high: "High commitment",
};
