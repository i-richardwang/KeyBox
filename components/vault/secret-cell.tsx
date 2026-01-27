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
 */
export function SecretCell({ value, label }: SecretCellProps) {
  const [revealed, setRevealed] = useState(false);

  const displayValue = revealed ? value : MASK;

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
