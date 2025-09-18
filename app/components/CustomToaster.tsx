// components/CustomToaster.tsx
"use client"

import { Toaster } from "react-hot-toast";

export const CustomToaster = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    toastOptions={{
      duration: 4000,
      style: {
        background: "#1f2937",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
      success: {
        style: { background: "#16a34a" },
      },
      error: {
        style: { background: "#dc2626" }, 
      },
    }}
  />
);
