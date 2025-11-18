// <== SHADCN-UI UTILS ==>
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// <== SHADCN-UI UTILS FUNCTION ==>
export function cn(...inputs: ClassValue[]): string {
  // RETURN MERGED CLASSES
  return twMerge(clsx(inputs));
}
