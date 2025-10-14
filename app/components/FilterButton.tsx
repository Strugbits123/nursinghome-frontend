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
  <div className="relative inline-block shrink-0">
      {/* Filter Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={className || "flex items-center justify-center w-auto md:w-[183px] h-10 md:h-[44px] rounded-lg bg-white border border-gray-300 px-3 md:px-4 gap-x-2 relative text-sm md:text-base whitespace-nowrap flex-nowrap"}
      >
        {iconLeft && <img src={iconLeft} style={{ width: iconLeftWidth, height: iconLeftHeight }} />}
        <span className={(textWhite ? "text-white " : "text-black ") + "whitespace-nowrap"}>{label}</span>
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
          className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center text-black text-xs md:text-base shadow hover:bg-gray-300 transition"
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
            <div className="bg-white border border-gray-300 shadow-lg rounded-lg min-w-full md:min-w-[9rem] md:w-36 p-2">
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
