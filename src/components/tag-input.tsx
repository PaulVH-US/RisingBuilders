"use client";

import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface TagInputProps {
  name: string;
  label: string;
  placeholder?: string;
  suggestions?: readonly string[];
  defaultValue?: string[];
}

function normalize(tag: string) {
  return tag.trim().toLowerCase();
}

export function TagInput({
  name,
  label,
  placeholder = "Type and press Enter or click Add",
  suggestions = [],
  defaultValue = [],
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

      <div className="flex gap-2">
        <Input
          ref={inputRef}
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
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(draft)}
          disabled={!draft.trim()}
          className="shrink-0"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Quick add:</span>
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
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
            >
              <Badge
                variant="outline"
                className="cursor-pointer text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                + other
              </Badge>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
