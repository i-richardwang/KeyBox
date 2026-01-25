"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { CopyButton } from "./copy-button";

interface SecretCellProps {
  value: string;
  label: string;
}

// Fixed-length mask to prevent length leakage
const MASK = "••••••••••••••••••••••••••••••••••••••••";

/**
 * A cell for displaying long secrets (API keys, etc.) with reveal toggle and copy.
 * Designed for longer values - shows truncated preview when revealed.
 */
export function SecretCell({ value, label }: SecretCellProps) {
  const [revealed, setRevealed] = useState(false);

  // Show first 16 and last 8 characters when revealed, for long keys
  const displayValue = revealed
    ? value.length > 32
      ? `${value.slice(0, 16)}...${value.slice(-8)}`
      : value
    : MASK;

  return (
    <div className="flex items-center gap-1">
      <code className="font-mono text-xs flex-1 truncate" title={revealed ? value : undefined}>
        {displayValue}
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
