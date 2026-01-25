"use client";

import { cn } from "@/lib/utils";
import { COLOR_SOLID_CLASSES } from "@/lib/colors";
import { COLOR_PALETTE, type ColorName } from "@/lib/types/account";

interface ColorPickerProps {
  value: string;
  onChange: (color: ColorName) => void;
}

/**
 * A simple color picker grid for selecting badge colors
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-6 h-6 rounded-md transition-all",
            COLOR_SOLID_CLASSES[color],
            value === color
              ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
              : "hover:scale-110"
          )}
          title={color}
        />
      ))}
    </div>
  );
}
