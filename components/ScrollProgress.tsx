"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A single hairline under the header that fills as you move down the page.
 *
 * This replaces the "06 SITUS | ● LIVE" strip: same slot, same quiet weight,
 * but it reports something that is actually true (where you are in the list)
 * instead of a status nobody can act on.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const doc = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.style.transform = "scaleX(0)";

    const write = reduced
      ? (value: number) => {
          el.style.transform = `scaleX(${value})`;
        }
      : gsap.quickTo(el, "scaleX", { duration: 0.4, ease: "power2.out" });

    let frame = 0;
    const read = () => {
      frame = 0;
      const span = doc.scrollHeight - window.innerHeight;
      const progress = span > 0 ? window.scrollY / span : 0;
      write(Math.min(1, Math.max(0, progress)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
    >
      <div
        ref={ref}
        style={{ transform: "scaleX(0)" }}
        className="h-full w-full origin-left bg-gradient-to-r from-gold/45 via-gold to-gold"
      />
    </div>
  );
}
