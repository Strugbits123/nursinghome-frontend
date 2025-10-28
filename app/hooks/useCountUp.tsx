"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Ensure the plugin is registered only once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useCountUp(
  endValue: number,
  triggerRef: React.RefObject<HTMLElement>,
  delay: number = 0
) {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = numberRef.current;
    const trigger = triggerRef.current;

    // Set initial text to endValue for accessibility and fallbacks
    if (target) {
      target.innerText = endValue.toLocaleString();
    }

    if (!target || !trigger) return;

    // --- Cleanup Variables ---
    let countUpTimeline: gsap.core.Tween;
    let scrollTriggerInstance: ScrollTrigger | undefined;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Set a starting innerText value for GSAP to animate from
    target.innerText = "0";

    // 💡 Mobile Fix: Defer ScrollTrigger creation to ensure correct dimensions are calculated
    const setupAnimation = () => {
        countUpTimeline = gsap.fromTo(
            target,
            { innerText: 0 },
            {
                innerText: endValue,
                duration: 2.5,
                ease: "power2.out",
                delay: delay,
                scrollTrigger: {
                    trigger: trigger,
                    // Use a slightly different start for better mobile reliability:
                    // Start when the center of the trigger hits 80% up the viewport
                    start: "center 80%", 
                    end: "bottom 0%", 
                    toggleActions: "play none none none", // Play once
                    // Ensures the ScrollTrigger is recalculated when certain events occur (like font loading)
                    refreshPriority: 1, 
                },
                snap: { innerText: 1 },
                onUpdate: function () {
                    const currentVal = Math.round(parseFloat(this.targets()[0].innerText));
                    target.innerText = currentVal.toLocaleString();
                },
                onComplete: () => {
                    target.innerText = endValue.toLocaleString();
                }
            }
        );
        
        // Store the specific ScrollTrigger instance for cleanup
        scrollTriggerInstance = countUpTimeline.scrollTrigger;

        // 💡 Crucial Fix for Inconsistent Layouts (e.g., mobile URL bar changing viewport)
        // Ensure the ScrollTrigger calculates start/end positions based on final layout
        ScrollTrigger.refresh();
    };

    // Use a small timeout (e.g., 50ms) to ensure GSAP runs after the browser paints
    const timer = setTimeout(setupAnimation, 50);

    return () => {
      clearTimeout(timer); // Clear the timeout if the component unmounts early
      
      // Cleanup: Kill *only* the specific ScrollTrigger and timeline
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (countUpTimeline) {
        countUpTimeline.kill();
      }
    };
  }, [endValue, triggerRef, delay]);

  return numberRef;
}