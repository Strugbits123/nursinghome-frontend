"use client";

import React, { useEffect, useState  } from "react";

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
  const [size, setSize] = useState({ width: 320, height: 100 }); // default (sm)

  // Handle AdSense initialization
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

  // Responsive resizing
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setSize({ width: 320, height: 100 }); // sm
      else if (w < 1024) setSize({ width: 728, height: 90 }); // md
      else setSize({ width: 900, height: 90 }); // lg+
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    banner: {
      display: "block",
      textAlign: "center",
      width: `${size.width}px`,
      height: `${size.height}px`,
      border: "1px solid #d1d5db",
      margin: "0 auto",
    },
    sidebar: {
      display: "block",
      width: "100%",
      border: "1px solid #d1d5db",
      height: "100%",
      margin: "0 auto",
    },
    square: {
      display: "block",
      width: "400px",
      height: "150px",
      border: "1px solid #d1d5db",
      margin: "0 auto",
    },
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