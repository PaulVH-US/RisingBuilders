import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { GOAL_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS } from "~/lib/constants";

interface Filters {
  skill?: string;
  interest?: string;
  goal?: string;
}

function buildHref(params: Filters) {
  const sp = new URLSearchParams();
  if (params.skill) sp.set("skill", params.skill);
  if (params.interest) sp.set("interest", params.interest);
  if (params.goal) sp.set("goal", params.goal);
  const qs = sp.toString();
  return qs ? `/builders?${qs}` : "/builders";
}

// Server-rendered filter chips for the builders directory: filter collaborators
// by skill, interest, or goal. Mirrors the project feed filters.
export function BuilderFilters({ skill, interest, goal }: Filters) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 w-16 text-xs font-medium text-muted-foreground">
          Skill
        </span>
        {SKILL_OPTIONS.map((option) => {
          const active = skill === option;
          return (
            <Link
              key={option}
              href={buildHref({
                skill: active ? undefined : option,
                interest,
                goal,
              })}
            >
              <Badge
                variant={active ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
              >
                {option}
              </Badge>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 w-16 text-xs font-medium text-muted-foreground">
          Interest
        </span>
        {INTEREST_OPTIONS.map((option) => {
          const active = interest === option;
          return (
            <Link
              key={option}
              href={buildHref({
                skill,
                interest: active ? undefined : option,
                goal,
              })}
            >
              <Badge
                variant={active ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
              >
                {option}
              </Badge>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 w-16 text-xs font-medium text-muted-foreground">
          Goal
        </span>
        {GOAL_OPTIONS.map((option) => {
          const active = goal === option.value;
          return (
            <Link
              key={option.value}
              href={buildHref({
                skill,
                interest,
                goal: active ? undefined : option.value,
              })}
            >
              <Badge
                variant={active ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
              >
                {option.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      {(skill || interest || goal) && (
        <Link
          href="/builders"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}
