import { SavedPlant } from "../types";

const DB_NAME = "floraid_storage_db";
const DB_VERSION = 1;
const STORE_NAME = "plants_collection";
const LOCAL_STORAGE_KEY = "floraid_my_plants_collection";
const LEGACY_STORAGE_KEY = "floraid_garden_plants";

/**
 * Open or create IndexedDB instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB non supportato in questo ambiente"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Impossibile aprire IndexedDB"));
    };
  });
}

/**
 * Clean up legacy storage items to prevent QuotaExceededError
 */
export function cleanupLegacyStorage(): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      // Remove duplicate legacy key if present to free valuable quota
      if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
  } catch (e) {
    // Ignore quota or access errors in restricted iframes
  }
}

/**
 * Load saved plants synchronously for initial React state
 */
export function getSavedPlantsSync(): SavedPlant[] {
  cleanupLegacyStorage();
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }

    const stored =
      localStorage.getItem(LOCAL_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // Graceful fallback without throwing or polluting console
  }

  return [];
}

/**
 * Load plants from IndexedDB (with fallback to localStorage)
 */
export async function getSavedPlants(): Promise<SavedPlant[]> {
  cleanupLegacyStorage();

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const idbPlants = req.result as SavedPlant[];
        if (Array.isArray(idbPlants) && idbPlants.length > 0) {
          resolve(idbPlants);
        } else {
          // Fallback to sync localStorage
          resolve(getSavedPlantsSync());
        }
      };

      req.onerror = () => {
        resolve(getSavedPlantsSync());
      };
    });
  } catch (err) {
    return getSavedPlantsSync();
  }
}

/**
 * Save plants to IndexedDB and quota-safely to localStorage
 */
export async function saveSavedPlants(plants: SavedPlant[]): Promise<void> {
  // 1. Save to IndexedDB (virtually unlimited quota for images)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Clear and put all
    store.clear();
    for (const plant of plants) {
      store.put(plant);
    }
  } catch (idbErr) {
    // Fallback quietly if IndexedDB is blocked
  }

  // 2. Save to localStorage with quota protection
  try {
    if (typeof window === "undefined" || !window.localStorage) return;

    // Clean up duplicate key
    localStorage.removeItem(LEGACY_STORAGE_KEY);

    // Try saving directly
    const serialized = JSON.stringify(plants);
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    localStorage.setItem("floraid_my_plants_initialized", "true");
  } catch (quotaError: any) {
    // QuotaExceededError handling: create a lightweight version without large images for localStorage
    try {
      const lightweightPlants = plants.map((p) => {
        const copy = { ...p };
        // If image is large data URL, truncate or remove only in localStorage cache
        if (copy.plantData && copy.plantData.analyzedImage && copy.plantData.analyzedImage.startsWith("data:")) {
          // Keep lightweight placeholder in localStorage (full image is safe in IndexedDB)
          copy.plantData = {
            ...copy.plantData,
            analyzedImage: copy.plantData.analyzedImage.length > 50000 
              ? "" // keep empty in localStorage cache, IndexedDB holds original
              : copy.plantData.analyzedImage,
          };
        }
        return copy;
      });

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweightPlants));
    } catch (fallbackError) {
      // If even lightweight fails, clear unnecessary storage items and do not crash
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (_) {}
    }
  }
}
