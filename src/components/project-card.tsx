import Link from "next/link";
import { CommitmentMeter } from "~/components/commitment-meter";
import { GradientAvatar } from "~/components/gradient-avatar";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { seededColor } from "~/lib/avatar";
import type { CommitmentLevel } from "~/lib/types";

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  category_tags: string[];
  skills_needed: string[];
  commitment_level: CommitmentLevel;
  creatorUsername: string;
  creatorActive: boolean;
  memberCount: number;
  memberUsernames: string[];
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const accent = project.category_tags[0]
    ? seededColor(project.category_tags[0])
    : "var(--color-primary)";

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card
        className="h-full gap-3 overflow-hidden border-l-4 py-5 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md"
        style={{ borderLeftColor: accent }}
      >
        <div className="flex flex-col gap-3 px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <GradientAvatar name={project.creatorUsername} size={36} />
              <div>
                <h3 className="font-display font-semibold leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  @{project.creatorUsername}
                </p>
              </div>
            </div>
            <CommitmentMeter
              level={project.commitment_level}
              showLabel={false}
            />
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>

          {project.skills_needed.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.skills_needed.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="flex">
                {project.memberUsernames.slice(0, 3).map((name) => (
                  <GradientAvatar
                    key={name}
                    name={name}
                    size={24}
                    ring
                    className="-ml-2 first:ml-0"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {project.memberCount}{" "}
                {project.memberCount === 1 ? "builder" : "builders"}
              </span>
            </div>

            {project.creatorActive && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="pulse-ring size-2 rounded-full bg-success" />
                active
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
