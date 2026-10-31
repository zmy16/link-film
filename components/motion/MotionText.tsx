"use client";

/**
 * React Bits–style TEXT animations, ported into this repo and powered by GSAP.
 *
 * React Bits ships copy-paste source rather than an installable package, and
 * most of its text components assume `motion/react`. These are re-implemented
 * against GSAP so the site carries ONE animation library instead of two.
 *
 * Every component animates FROM a hidden state into the natural, final state —
 * so the server-rendered HTML already contains the full text (SEO + no-JS safe)
 * and `prefers-reduced-motion: reduce` simply skips the tween.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* ------------------------------------------------------------------ */
/* SplitText — per-character rise from behind a clipped word wrapper.  */
/* ------------------------------------------------------------------ */

type SplitTextProps = {
  text: string;
  className?: string;
  /** Seconds to wait before the first character moves. */
  delay?: number;
  /** Seconds between characters. */
  stagger?: number;
};

export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.026,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const chars = ref.current?.querySelectorAll<HTMLElement>("[data-split-char]");
      if (!chars || chars.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(chars, {
          yPercent: 118,
          opacity: 0,
          duration: 0.95,
          ease: "expo.out",
          stagger,
          delay,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          {Array.from(word).map((char, charIndex) => (
            <span
              key={`${char}-${charIndex}`}
              data-split-char
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* GradientText — blur-rise entrance + endless gold gradient sweep.    */
/* ------------------------------------------------------------------ */

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Set false for a static gradient with no continuous sweep. */
  animated?: boolean;
};

export function GradientText({
  children,
  className = "",
  delay = 0,
  animated = true,
}: GradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(el, {
          yPercent: 22,
          opacity: 0,
          filter: "blur(14px)",
          duration: 1.15,
          ease: "expo.out",
          delay,
        });

        /* The endless sweep used to be a `repeat: -1` GSAP tween here. It is
           now the CSS animation on `.gradient-sweep-animated` (app/globals.css):
           same picture, but zero main-thread work — the old tween rewrote
           `background-position` every frame and kept GSAP's ticker awake for as
           long as the tab was open, which is exactly what a low-end phone cannot
           afford while it is scrolling the card grid. */
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [animated] },
  );

  return (
    <span
      ref={ref}
      className={`gradient-sweep ${animated ? "gradient-sweep-animated" : ""} ${className}`}
      style={animated ? { animationDelay: `${delay + 0.5}s` } : undefined}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — renders the final value on the server, counts up on mount. */
/* ------------------------------------------------------------------ */

type CountUpProps = {
  to: number;
  className?: string;
  duration?: number;
  /** Zero-pad to two digits (matches the "05 provider" style). */
  pad?: boolean;
};

export function CountUp({
  to,
  className = "",
  duration = 1.5,
  pad = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (value: number) => {
    const rounded = String(Math.round(value));
    return pad ? rounded.padStart(2, "0") : rounded;
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: to,
          duration,
          ease: "power2.out",
          delay: 0.3,
          onUpdate: () => {
            el.textContent = format(counter.value);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
