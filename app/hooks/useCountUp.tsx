"use client";

import { useEffect, useRef } from "react";

export function useCountUp(
  endValue: number,
  triggerRef: React.RefObject<HTMLElement>,
  delay: number = 0
) {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = numberRef.current;
    const trigger = triggerRef.current;
    if (!target || !trigger) return;

    target.innerText = "0";

    let hasAnimated = false;
    let observer: IntersectionObserver;

    const countUp = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      let start = 0;
      const duration = 2500; // 2.5s same as GSAP
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * endValue);
        target.innerText = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          target.innerText = endValue.toLocaleString();
        }
      };

      setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp();
            observer.unobserve(trigger);
          }
        });
      },
      {
        threshold: 0.5, // when 50% visible
      }
    );

    observer.observe(trigger);

    return () => {
      if (observer && trigger) observer.unobserve(trigger);
    };
  }, [endValue, triggerRef, delay]);

  return numberRef;
}
