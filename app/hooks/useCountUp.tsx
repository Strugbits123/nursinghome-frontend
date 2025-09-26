"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(
  endValue: number,
  triggerRef: React.RefObject<HTMLElement>
) {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!numberRef.current || !triggerRef.current) return; // ✅ guard

    const target = numberRef.current;

    gsap.fromTo(
      target,
      { innerText: 0 },
      {
        innerText: endValue,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 80%",
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
  }, [endValue, triggerRef]);

  return numberRef;
}
