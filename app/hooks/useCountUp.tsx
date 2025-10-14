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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // For reduced motion, just set the final value
      if (numberRef.current) {
        numberRef.current.innerText = endValue.toLocaleString();
      }
      return;
    }

    gsap.fromTo(
      target,
      { innerText: 0 },
      {
        innerText: endValue,
        duration: 2.5,
        ease: "power2.out",
        delay: delay,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        },
        snap: { innerText: 1 },
        onUpdate: function () {
          // parse innerText safely
          const currentVal = parseInt(this.targets()[0].innerText || "0", 10);
          if (numberRef.current) {
            numberRef.current.innerText = currentVal.toLocaleString();
          }
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [endValue, triggerRef, delay]);

  return numberRef;
}
