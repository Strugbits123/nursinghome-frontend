"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(endValue: number, triggerRef: React.RefObject<HTMLElement>) {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (numberRef.current && triggerRef.current) {
      gsap.fromTo(
        numberRef.current,
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
            const val = Math.floor(this.targets()[0].innerText as number);
            numberRef.current!.innerText = val.toLocaleString(); // adds commas
          },
        }
      );
    }
  }, [endValue, triggerRef]);

  return numberRef;
}
