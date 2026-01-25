import { generateSync } from "otplib";

/**
 * Generate a TOTP code from a base32 secret
 * @param secret - Base32 encoded TOTP secret
 * @returns 6-digit TOTP code or empty string if invalid
 */
export function generateTotpCode(secret: string): string {
  try {
    const cleanSecret = secret.replace(/\s/g, "").toUpperCase();
    return generateSync({ secret: cleanSecret, strategy: "totp" });
  } catch {
    return "";
  }
}

/**
 * Get remaining seconds until the current TOTP code expires
 * TOTP codes refresh every 30 seconds
 * @returns Number of seconds remaining (1-30)
 */
export function getTotpRemainingSeconds(): number {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}
