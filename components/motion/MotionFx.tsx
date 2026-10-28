"use client";

/**
 * React Bits–style INTERACTION effects, ported into this repo and powered by
 * GSAP (see MotionText.tsx for why they are ports rather than imports).
 *
 * All effects are pointer-driven and cheap: no layout thrash inside rAF, no
 * WebGL. Every one no-ops under `prefers-reduced-motion: reduce`.
 */

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* useSpotlight — feeds `--mx` / `--my` to a `.spotlight-overlay` child */
/* ------------------------------------------------------------------ */

export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;

      const setX = gsap.quickSetter(el, "--mx", "px");
      const setY = gsap.quickSetter(el, "--my", "px");

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        setX(event.clientX - rect.left);
        setY(event.clientY - rect.top);
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return ref;
}

/* ------------------------------------------------------------------ */
/* Tilt — 3D card tilt toward the cursor (React Bits "TiltedCard").    */
/* Requires `perspective` on the parent.                              */
/* ------------------------------------------------------------------ */

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the card corner. */
  max?: number;
  /** Scale applied while hovering. */
  scale?: number;
};

export function Tilt({ children, className = "", max = 6, scale = 1.015 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) return;

      const quick = { ease: "power3.out", duration: 0.55 } as const;
      const rotateX = gsap.quickTo(el, "rotateX", quick);
      const rotateY = gsap.quickTo(el, "rotateY", quick);
      const zoom = gsap.quickTo(el, "scale", quick);

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY(px * max * 2);
        rotateX(-py * max * 2);
        zoom(scale);
      };

      const reset = () => {
        rotateX(0);
        rotateY(0);
        zoom(1);
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", reset);
      el.addEventListener("pointercancel", reset);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", reset);
        el.removeEventListener("pointercancel", reset);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`[transform-style:preserve-3d] ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollReveal — animates in once, the first time it enters view.     */
/* Deliberately uses gsap.from(): content is visible at rest, so a      */
/* missing IntersectionObserver can never leave the page blank.        */
/* ------------------------------------------------------------------ */

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
};

export function ScrollReveal({
  children,
  className = "",
  y = 22,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      gsap.from(el, {
        y,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        delay,
        clearProps: "opacity,transform",
      });
    };

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          reveal();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aurora — two slow-drifting light blobs behind the hero.             */
/* ------------------------------------------------------------------ */

export function Aurora({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blobs = ref.current?.querySelectorAll<HTMLElement>("[data-blob]");
      if (!blobs || blobs.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        blobs.forEach((blob, index) => {
          gsap.to(blob, {
            xPercent: index % 2 === 0 ? 16 : -14,
            yPercent: index % 2 === 0 ? 10 : -12,
            scale: 1.14,
            duration: 16 + index * 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 1.2,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span
        data-blob
        className="absolute -left-[14%] -top-[42%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.20),transparent_66%)] blur-[64px] will-change-transform"
      />
      <span
        data-blob
        className="absolute -right-[10%] -top-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.18),transparent_66%)] blur-[64px] will-change-transform"
      />
    </div>
  );
}
