import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCode(code: string): string {
  return code.trim().replace(/^\s+/gm, '')
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function formatApiResponse(response: any): string {
  return JSON.stringify(response, null, 2)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateApiKey(key: string): boolean {
  return key.length > 0 && key.startsWith('eyJ')
}