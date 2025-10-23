"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(
  endValue: number,
  triggerRef: React.RefObject<HTMLElement>,
  delay: number = 0
) {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!numberRef.current || !triggerRef.current) return;

    const target = numberRef.current;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      target.innerText = endValue.toLocaleString();
      return;
    }

    const tl = gsap.fromTo(
      target,
      { innerText: 0 },
      {
        innerText: endValue,
        duration: 2.5,
        ease: "power2.out",
        delay: delay,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 115%", // start animation slightly below viewport
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
        snap: { innerText: 1 },
        onUpdate: function () {
          const currentVal = parseInt(this.targets()[0].innerText || "0", 10);
          target.innerText = currentVal.toLocaleString();
        },
      }
    );

    return () => {
      // Kill all ScrollTriggers and timeline on cleanup
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, [endValue, triggerRef, delay]);

  return numberRef;
}
