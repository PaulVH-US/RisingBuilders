import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

// Animated sunrise hero. The SVG scenery plays a one-time "sunrise" on load
// (sun rises, dawn brightens, rays bloom) and settles into a steady state with
// a gently breathing glow; the copy lifts in just after. All motion is disabled
// under prefers-reduced-motion (the static render is the rested scene).
export function SunriseHero() {
  return (
    <section className="relative isolate flex min-h-[82vh] items-center overflow-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full"
        viewBox="0 0 680 470"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15123a" />
            <stop offset="42%" stopColor="#3a2a72" />
            <stop offset="70%" stopColor="#8b4a86" />
            <stop offset="88%" stopColor="#d96a3c" />
            <stop offset="100%" stopColor="#f6ad44" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#f59a3c" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f59a3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-sun" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#fff6d2" />
            <stop offset="55%" stopColor="#ffd06b" />
            <stop offset="100%" stopColor="#f7973a" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="680" height="470" fill="url(#hero-sky)" />

        <circle cx="90" cy="70" r="1.4" fill="#fff" opacity="0.7" />
        <circle cx="180" cy="44" r="1" fill="#fff" opacity="0.5" />
        <circle cx="600" cy="60" r="1.5" fill="#fff" opacity="0.7" />
        <circle cx="520" cy="38" r="1" fill="#fff" opacity="0.45" />
        <circle cx="640" cy="110" r="1.1" fill="#fff" opacity="0.55" />
        <circle cx="44" cy="120" r="1" fill="#fff" opacity="0.4" />

        {/* Sun, glow and rays rise together on load */}
        <g className="sun-rise" style={{ transformOrigin: "center" }}>
          <ellipse
            className="glow-breathe"
            cx="340"
            cy="378"
            rx="250"
            ry="170"
            fill="url(#hero-glow)"
            opacity="0.55"
          />
          <g className="rays-in" fill="#ffe2a0" opacity="0.18">
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(0 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(30 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(60 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(90 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(120 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(150 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(180 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(210 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(240 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(270 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(300 340 378)"
            />
            <polygon
              points="340,180 347,378 333,378"
              transform="rotate(330 340 378)"
            />
          </g>
          <circle cx="340" cy="378" r="82" fill="url(#hero-sun)" />
        </g>

        {/* Static hills: the sun rises behind these */}
        <path
          d="M0,402 C140,366 290,386 420,376 C520,368 600,392 680,380 L680,470 L0,470 Z"
          fill="#2c2560"
          opacity="0.92"
        />
        <path
          d="M0,432 C160,406 320,424 460,412 C560,404 624,422 680,416 L680,470 L0,470 Z"
          fill="#161033"
        />

        {/* Dawn overlay darkens the scene at first, then clears */}
        <rect
          className="dawn"
          x="0"
          y="0"
          width="680"
          height="470"
          fill="#0d0a24"
          opacity="0"
        />
      </svg>

      {/* Blend the sky into the page background below the hero */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background" />

      {/* Hero copy lifts in just after the sun */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
        <span
          className="animate-rise rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
          style={{ animationDelay: "900ms" }}
        >
          For ambitious high school founders
        </span>
        <h1
          className="animate-rise font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: "1000ms" }}
        >
          Find serious collaborators.
          <br />
          <span className="text-warm">Go from idea to launch.</span>
        </h1>
        <p
          className="animate-rise max-w-xl text-balance text-lg text-white/85"
          style={{ animationDelay: "1150ms" }}
        >
          Rising Builders is a project-first network where high school students
          form small teams and build real things: startups, hackathon ideas,
          apps, and creative projects.
        </p>
        <div
          className="animate-rise flex flex-col items-center gap-3"
          style={{ animationDelay: "1300ms" }}
        >
          <Button
            asChild
            size="lg"
            className="border-0 bg-white text-primary hover:bg-white/90"
          >
            <Link href="/waitlist">
              Join the waitlist
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-sm font-semibold text-white/90">
            Launching July 1st. We&apos;ll email you when your spot is ready.
          </p>
        </div>
      </div>
    </section>
  );
}
