"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/builders", label: "Builders" },
];

export function NavLinks({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            pathname.startsWith(link.href)
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/profile"
        className={cn(
          "text-sm transition-colors hover:text-foreground",
          pathname === "/profile" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        @{username}
      </Link>
    </div>
  );
}
