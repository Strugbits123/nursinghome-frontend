'use client';

import React from "react";


interface FilterButtonProps {
  label: string;
  iconLeft?: string;
  iconRight?: string;
  options?: (string | number)[];
  value?: string | number;
  onSelect?: (val: string | number) => void;
  className?: string;
  textWhite?: boolean;
  iconLeftWidth?: string;
  iconLeftHeight?: string;
  iconRightWidth?: string;
  iconRightHeight?: string;

  // ✅ Add these for custom content
  children?: React.ReactNode;
  onClear?: () => void;
}


export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  iconLeft,
  iconRight,
  options,
  value,
  onSelect,
  className,
  textWhite,
  iconLeftWidth,
  iconLeftHeight,
  iconRightWidth,
  iconRightHeight,
  children,
  onClear,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      {/* Filter Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={className || "flex items-center justify-center w-[183px] h-[44px] rounded-lg bg-white border border-gray-300 px-4 gap-x-2 relative"}
      >
        {iconLeft && <img src={iconLeft} style={{ width: iconLeftWidth, height: iconLeftHeight }} />}
        <span className={textWhite ? "text-white" : "text-black"}>{label}</span>
        {iconRight && (
          <img
            src={iconRight}
            style={{
              width: iconRightWidth,
              height: iconRightHeight,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        )}
      </button>

      {/* ✅ Clear button outside, top-right */}
      {value && onClear && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-black shadow hover:bg-gray-300 transition"
          title="Clear filter"
        >
          ×
        </button>
      )}

      {/* Dropdown / children */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50">
          {children ? (
            children
          ) : options ? (
            <div className="bg-white border border-gray-300 shadow-lg rounded-lg w-36 p-2">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-black text-sm"
                  onClick={() => {
                    onSelect?.(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

