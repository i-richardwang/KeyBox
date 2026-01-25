"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  label: string;
}

/**
 * A button that copies a value to clipboard and shows feedback
 */
export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
    >
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
      />
    </Button>
  );
}
