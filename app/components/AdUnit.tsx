"use client";

import { useEffect } from "react";

interface AdUnitProps {
  adSlot: string;
  layout?: "banner" | "sidebar" | "square";
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({ adSlot, layout = "banner" }: AdUnitProps) {
  useEffect(() => {
    try {
      const timeout = setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 300);
      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    banner: { display: "block", textAlign: "center" },
    sidebar: { display: "block", width: "100%", height: "100%", margin: "0 auto" },
    square: { display: "block", width: "336px", height: "280px", margin: "0 auto" },
  };

  return (
    <ins
      className="adsbygoogle"
      style={styles[layout] || styles.banner}
      data-ad-client="ca-pub-8855354849568036"
      data-ad-slot={adSlot}
      data-ad-format={layout === "banner" ? "auto" : undefined}
      data-full-width-responsive="true"
    ></ins>
  );
}
