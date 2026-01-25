import type { ColorName } from "@/lib/types/account";

/**
 * Badge style classes for each color (used in TypeBadge, TypeSelector, SettingsSheet)
 */
export const COLOR_BADGE_CLASSES: Record<ColorName, string> = {
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  lime: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

/**
 * Solid background classes for color picker swatches
 */
export const COLOR_SOLID_CLASSES: Record<ColorName, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
};

/**
 * Get badge class for a color, with fallback to slate
 */
export function getBadgeClass(color: string): string {
  return COLOR_BADGE_CLASSES[color as ColorName] || COLOR_BADGE_CLASSES.slate;
}

/**
 * Get solid background class for a color, with fallback to slate
 */
export function getSolidClass(color: string): string {
  return COLOR_SOLID_CLASSES[color as ColorName] || COLOR_SOLID_CLASSES.slate;
}
