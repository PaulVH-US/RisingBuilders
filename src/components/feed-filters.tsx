import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import {
  CATEGORY_OPTIONS,
  COMMITMENT_OPTIONS,
  SKILL_OPTIONS,
} from "~/lib/constants";

interface Filters {
  tag?: string;
  skill?: string;
  commitment?: string;
}

function buildHref(params: Filters) {
  const sp = new URLSearchParams();
  if (params.tag) sp.set("tag", params.tag);
  if (params.skill) sp.set("skill", params.skill);
  if (params.commitment) sp.set("commitment", params.commitment);
  const qs = sp.toString();
  return qs ? `/projects?${qs}` : "/projects";
}

// Server-rendered filter chips. Each chip is a link that toggles a query param,
// so filtering needs no client state (PRD 6.3, simple tag filtering).
export function FeedFilters({ tag, skill, commitment }: Filters) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 w-20 text-xs font-medium text-muted-foreground">
          Interest
        </span>
        {CATEGORY_OPTIONS.map((option) => {
          const active = tag === option;
          return (
            <Link
              key={option}
              href={buildHref({
                tag: active ? undefined : option,
                skill,
                commitment,
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
        <span className="mr-1 w-20 text-xs font-medium text-muted-foreground">
          Skill needed
        </span>
        {SKILL_OPTIONS.map((option) => {
          const active = skill === option;
          return (
            <Link
              key={option}
              href={buildHref({
                tag,
                skill: active ? undefined : option,
                commitment,
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
        <span className="mr-1 w-20 text-xs font-medium text-muted-foreground">
          Commitment
        </span>
        {COMMITMENT_OPTIONS.map((option) => {
          const active = commitment === option.value;
          return (
            <Link
              key={option.value}
              href={buildHref({
                tag,
                skill,
                commitment: active ? undefined : option.value,
              })}
            >
              <Badge
                variant={active ? "default" : "outline"}
                className="cursor-pointer capitalize hover:bg-accent"
              >
                {option.value}
              </Badge>
            </Link>
          );
        })}
      </div>

      {(tag || skill || commitment) && (
        <Link
          href="/projects"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}
