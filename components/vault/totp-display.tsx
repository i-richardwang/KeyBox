"use client";

import { useState, useEffect, useRef } from "react";
import { generateTotpCode, getTotpRemainingSeconds } from "@/lib/totp";
import { CopyButton } from "./copy-button";

interface TotpDisplayProps {
  secret: string;
}

/**
 * Displays a live TOTP code with countdown indicator
 * Code refreshes automatically every 30 seconds
 */
export function TotpDisplay({ secret }: TotpDisplayProps) {
  const [code, setCode] = useState(() => generateTotpCode(secret));
  const [remaining, setRemaining] = useState(() => getTotpRemainingSeconds());

  // Use ref to track previous remaining value without triggering effect re-runs
  const prevRemainingRef = useRef(remaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = getTotpRemainingSeconds();
      setRemaining(newRemaining);

      // Regenerate code when timer resets (remaining jumped from low to high)
      if (newRemaining === 30 || newRemaining > prevRemainingRef.current) {
        setCode(generateTotpCode(secret));
      }

      prevRemainingRef.current = newRemaining;
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  // If code is empty, the secret is invalid
  if (!code) {
    return (
      <span className="text-muted-foreground text-xs">Invalid secret</span>
    );
  }

  // Format code with space: "123 456"
  const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;

  // Calculate stroke dash for circular progress
  const circumference = 2 * Math.PI * 8; // radius = 8
  const progress = (remaining / 30) * circumference;

  return (
    <div className="flex items-center gap-2">
      {/* Circular countdown indicator */}
      <svg className="size-5 -rotate-90" viewBox="0 0 20 20">
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
        />
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000"
        />
      </svg>
      <code className="font-mono text-sm tracking-wider">{formattedCode}</code>
      <CopyButton value={code} label="2FA code" />
    </div>
  );
}
