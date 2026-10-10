// Configuration and endpoint resolver for Web & Native Android APK (Capacitor)
import { Capacitor } from '@capacitor/core';

// Default live cloud backend URL when running inside a compiled Android APK
export const DEFAULT_PRODUCTION_SERVER = "https://ais-pre-7ee22x4yyiibnvp7uzlu3q-645235550319.europe-west2.run.app";

export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  
  // Capacitor native platform check
  if (Capacitor.isNativePlatform()) return true;

  // Additional check for mobile webview or capacitor origin
  const origin = window.location.origin;
  if (
    origin.startsWith("capacitor://") ||
    window.location.protocol === "file:"
  ) {
    return true;
  }

  return false;
}

export function isServerConfigured(): boolean {
  if (typeof window === "undefined") return false;
  const custom = localStorage.getItem("floraid_custom_api_url");
  if (custom && custom.trim()) return true;
  if (import.meta.env.VITE_API_BASE_URL) return true;
  if (!isNativePlatform()) return true; // Web preview has local proxy
  return false;
}

export function getServerUrl(): string {
  if (typeof window === "undefined") return "";

  const saved = localStorage.getItem("floraid_custom_api_url");
  if (saved && saved.trim()) {
    return saved.trim().replace(/\/+$/, "");
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
  }

  if (isNativePlatform()) {
    return DEFAULT_PRODUCTION_SERVER;
  }

  return "";
}

export function setServerUrl(url: string) {
  if (typeof window === "undefined") return;
  if (!url || !url.trim()) {
    localStorage.removeItem("floraid_custom_api_url");
  } else {
    localStorage.setItem("floraid_custom_api_url", url.trim().replace(/\/+$/, ""));
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

