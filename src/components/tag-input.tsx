"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface TagInputProps {
  /** Form field name; values are submitted as repeated hidden inputs. */
  name: string;
  label: string;
  placeholder?: string;
  suggestions?: readonly string[];
  defaultValue?: string[];
}

function normalize(tag: string) {
  return tag.trim().toLowerCase();
}

// Chip-based multi-tag picker. Renders hidden inputs so it works inside a plain
// <form> posting to a server action, no client data layer needed.
export function TagInput({
  name,
  label,
  placeholder = "Type and press Enter",
  suggestions = [],
  defaultValue = [],
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = normalize(raw);
    if (!tag) return;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setDraft("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  const remainingSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium leading-none">{label}</span>

      {tags.map((tag) => (
        <input key={tag} type="hidden" name={name} value={tag} />
      ))}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) {
            removeTag(tags[tags.length - 1]);
          }
        }}
        placeholder={placeholder}
      />

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remainingSuggestions.map((s) => (
            <button key={s} type="button" onClick={() => addTag(s)}>
              <Badge
                variant="outline"
                className={cn("cursor-pointer hover:bg-accent")}
              >
                + {s}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
