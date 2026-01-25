"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { CopyButton } from "./copy-button";

interface PasswordCellProps {
  value: string;
  label: string;
}

/**
 * A cell that displays a masked password/secret with reveal toggle and copy button
 */
export function PasswordCell({ value, label }: PasswordCellProps) {
  const [revealed, setRevealed] = useState(false);

  // Generate masked value with same length as actual
  const maskedValue = "•".repeat(Math.min(value.length, 12));

  return (
    <div className="flex items-center gap-1">
      <code className="font-mono text-sm min-w-20">
        {revealed ? value : maskedValue}
      </code>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setRevealed(!revealed)}
        aria-label={revealed ? "Hide" : "Reveal"}
      >
        <HugeiconsIcon
          icon={revealed ? ViewOffIcon : ViewIcon}
          strokeWidth={2}
        />
      </Button>
      <CopyButton value={value} label={label} />
    </div>
  );
}
