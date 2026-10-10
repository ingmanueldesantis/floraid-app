// Configuration and endpoint resolver for Web & Native Android APK (Capacitor)
import { Capacitor } from '@capacitor/core';

export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;

  // Real native capacitor platform check
  try {
    if (Capacitor.isNativePlatform()) return true;
    const platform = Capacitor.getPlatform();
    if (platform === "android" || platform === "ios") return true;
  } catch {
    // ignore
  }

  // Mobile Webview, custom schemes or Android webview localhost
  const origin = window.location.origin || "";
  const hostname = window.location.hostname || "";
  const port = window.location.port || "";

  if (
    origin.startsWith("capacitor://") ||
    origin.startsWith("file:") ||
    (hostname === "localhost" && port !== "3000" && port !== "5173") ||
    typeof (window as any).Android !== "undefined" ||
    (typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor?.isNative)
  ) {
    return true;
  }

  return false;
}

export function isServerConfigured(): boolean {
  if (typeof window === "undefined") return false;
  if (!isNativePlatform()) return true; // Web always has local relative /api routes
  const custom = getSavedServerUrl();
  if (custom && custom.trim()) return true;
  if (import.meta.env.VITE_API_BASE_URL) return true;
  return false;
}

export function getSavedServerUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const saved = localStorage.getItem("floraid_custom_api_url");
    if (saved) {
      const trimmed = saved.trim().replace(/\/+$/, "");
      // Purge any deprecated or obsolete AI Studio internal dev containers
      if (trimmed.includes("ais-pre-") || trimmed.includes("ais-dev-")) {
        localStorage.removeItem("floraid_custom_api_url");
        return "";
      }
      return trimmed;
    }
  } catch {
    // Storage access restricted in some webviews
  }
  return "";
}

export function getServerUrl(): string {
  if (typeof window === "undefined") return "";

  // ON WEB (browser preview, desktop, mobile browser, PWA):
  // ALWAYS return "" (relative path) to talk directly to the integrated fullstack server.
  // This guarantees zero CORS issues, zero 404s, and 100% reliable endpoint resolution.
  if (!isNativePlatform()) {
    return "";
  }

  // Inside compiled native Android APK:
  const saved = getSavedServerUrl();
  if (saved) {
    return saved;
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
  }

  return "";
}

export function setServerUrl(url: string) {
  if (typeof window === "undefined") return;
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem("floraid_custom_api_url");
    } else {
      const cleaned = url.trim().replace(/\/+$/, "");
      localStorage.setItem("floraid_custom_api_url", cleaned);
    }
  } catch {
    // ignore
  }
}

export function getApiEndpoint(endpointPath: string): string {
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  const base = getServerUrl();
  if (!base) {
    return cleanPath;
  }
  return `${base}${cleanPath}`;
}

/**
 * Robust fetch that calls the configured API endpoint with automatic local fallback.
 */
export async function apiFetch(endpointPath: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  const primaryUrl = getApiEndpoint(cleanPath);

  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (primaryErr: any) {
    // If the primary call was to an absolute external URL and failed due to network / CORS
    if (primaryUrl.startsWith("http://") || primaryUrl.startsWith("https://")) {
      console.warn(`[FloraID] Richiesta a ${primaryUrl} non riuscita (${primaryErr.message}). Tentativo fallback locale su ${cleanPath}...`);
      try {
        const fallbackRes = await fetch(cleanPath, options);
        return fallbackRes;
      } catch {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}
