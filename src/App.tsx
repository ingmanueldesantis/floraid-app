import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ImageUploader } from "./components/ImageUploader";
import { PlantAnalysisView } from "./components/PlantAnalysisView";
import { MyGardenView } from "./components/MyGardenView";
import { ExploreEncyclopediaView } from "./components/ExploreEncyclopediaView";
import { CameraModal } from "./components/CameraModal";
import { ScanningModal } from "./components/ScanningModal";
import { AppSettingsModal } from "./components/AppSettingsModal";
import { PlantAnalysisResult, SavedPlant } from "./types";
import { SAMPLE_PLANTS, SamplePlantItem } from "./data/samplePlants";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { getApiEndpoint, isNativePlatform, isServerConfigured } from "./services/apiConfig";
import {
  getSavedPlantsSync,
  getSavedPlants,
  saveSavedPlants,
  cleanupLegacyStorage,
} from "./services/storageService";
import { compressImage } from "./utils/imageCompressor";
import { identifyPlantOffline } from "./services/offlineBotanicalService";

export default function App() {
  const [activeTab, setActiveTab] = useState<"identify" | "garden" | "explore">("identify");
  const [currentPlant, setCurrentPlant] = useState<PlantAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningImagePreview, setScanningImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Saved Plants with robust IndexedDB + quota-safe LocalStorage persistence
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>(() => {
    return getSavedPlantsSync();
  });

  // On mount, load from IndexedDB (asynchronous high-capacity storage)
  useEffect(() => {
    cleanupLegacyStorage();
    getSavedPlants()
      .then((plants) => {
        if (plants && plants.length > 0) {
          setSavedPlants(plants);
        }
      })
      .catch(() => {});
  }, []);

  // Sync saved plants safely across sessions
  useEffect(() => {
    saveSavedPlants(savedPlants).catch(() => {});
  }, [savedPlants]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Identify photo via AI server endpoint or offline botanical engine
  const handleAnalyzeImage = async (imageBase64: string, notes?: string) => {
    let processedImage = imageBase64;
    try {
      processedImage = await compressImage(imageBase64, 1200, 1200, 0.82);
    } catch {
      processedImage = imageBase64;
    }

    setScanningImagePreview(processedImage);
    setIsScanning(true);

    // If running in native Android APK without an external server URL configured,
    // use the high-precision Offline Botanical Engine directly for instant recognition
    if (isNativePlatform() && !isServerConfigured()) {
      try {
        const offlineData = await identifyPlantOffline(processedImage, notes);
        setCurrentPlant(offlineData);
        setActiveTab("identify");
        showToast(
          `Pianta identificata: ${offlineData.identification.commonName}! (Motore Botanico Offline)`,
          "success"
        );
      } catch (err: any) {
        showToast("Impossibile analizzare l'immagine. Riprova con un'altra foto.", "error");
      } finally {
        setIsScanning(false);
      }
      return;
    }

    try {
      // Determine MIME type
      const mimeMatch = processedImage.match(/^data:(image\/[a-zA-Z0-9+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(getApiEndpoint("/api/identify-plant"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: processedImage,
          mimeType,
          userNotes: notes,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Errore durante l'identificazione della pianta.");
      }

      const data: PlantAnalysisResult = await res.json();

      if (!data.isPlant && (!data.identification?.commonName || data.identification.commonName.toLowerCase().includes("sconosciut"))) {
        showToast(
          "L'immagine non sembra contenere una pianta o un fiore chiaramente riconoscibile. Prova a scattare una foto più ravvicinata delle foglie o del fiore.",
          "error"
        );
        setIsScanning(false);
        return;
      }

      // Attach analyzed photo
      data.analyzedImage = processedImage;
      data.analyzedDate = new Date().toISOString();

      setCurrentPlant(data);
      setActiveTab("identify");
      showToast(`Pianta identificata: ${data.identification.commonName}!`, "success");
    } catch (err: any) {
      console.warn("Errore analisi server, attivazione motore botanico offline:", err?.message || err);
      // Graceful fallback: If network failed or server is unreachable, use Offline Botanical Engine seamlessly!
      try {
        const offlineData = await identifyPlantOffline(processedImage, notes);
        setCurrentPlant(offlineData);
        setActiveTab("identify");
        showToast(
          `Pianta identificata: ${offlineData.identification.commonName}! (Motore Botanico Offline)`,
          "success"
        );
      } catch {
        showToast(
          "Impossibile identificare la pianta in questo momento. Riprova con un'altra foto.",
          "error"
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Handle preset sample selection
  const handleSelectSample = (sample: SamplePlantItem) => {
    const data: PlantAnalysisResult = {
      ...sample.defaultData,
      analyzedImage: sample.imageUrl,
      analyzedDate: new Date().toISOString(),
    };
    setCurrentPlant(data);
    setActiveTab("identify");
    showToast(`Scheda caricata: ${sample.name}`);
  };

  // Save current plant to personal plants collection
  const handleSaveToGarden = async (customScheduleParams?: any) => {
    if (!currentPlant) return;

    let plantDataToSave = { ...currentPlant };
    if (
      plantDataToSave.analyzedImage &&
      plantDataToSave.analyzedImage.startsWith("data:") &&
      plantDataToSave.analyzedImage.length > 100000
    ) {
      try {
        plantDataToSave.analyzedImage = await compressImage(
          plantDataToSave.analyzedImage,
          800,
          800,
          0.78
        );
      } catch {}
    }

    // Check if already in collection
    const existingIndex = savedPlants.findIndex(
      (p) =>
        p.plantData.identification.scientificName.toLowerCase() ===
        plantDataToSave.identification.scientificName.toLowerCase()
    );

    const scheduleData = customScheduleParams || {
      daysInterval:
        plantDataToSave.customWateringSchedule?.recommendedBaseDays || 7,
      amountMl:
        plantDataToSave.customWateringSchedule?.recommendedAmountMl || 350,
      potSize: "medium",
      potMaterial: "terracotta",
      exposure: "bright_indirect",
      location: "indoor",
    };

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...savedPlants];
      updated[existingIndex] = {
        ...updated[existingIndex],
        customSchedule: scheduleData,
        plantData: plantDataToSave,
      };
      setSavedPlants(updated);
      showToast(`${plantDataToSave.identification.commonName} aggiornata in Le mie piante!`);
    } else {
      // Create new saved plant
      const newSaved: SavedPlant = {
        id: "plant_" + Date.now(),
        nickname: plantDataToSave.identification.commonName,
        plantData: plantDataToSave,
        addedAt: new Date().toISOString(),
        lastWatered: new Date().toISOString(),
        customSchedule: scheduleData,
        wateringHistory: [
          {
            date: new Date().toISOString(),
            notes: "Aggiunta a Le mie piante",
          },
        ],
      };
      setSavedPlants([newSaved, ...savedPlants]);
      showToast(
        `🎉 ${plantDataToSave.identification.commonName} salvata in Le mie piante!`,
        "success"
      );
    }
  };

  // Add plant directly from modal or catalog
  const handleAddPlant = async (newPlant: SavedPlant) => {
    let safePlant = { ...newPlant };
    if (
      safePlant.plantData?.analyzedImage &&
      safePlant.plantData.analyzedImage.startsWith("data:") &&
      safePlant.plantData.analyzedImage.length > 100000
    ) {
      try {
        safePlant.plantData = {
          ...safePlant.plantData,
          analyzedImage: await compressImage(
            safePlant.plantData.analyzedImage,
            800,
            800,
            0.78
          ),
        };
      } catch {}
    }

    setSavedPlants((prev) => [safePlant, ...prev]);
    showToast(
      `🎉 ${safePlant.nickname || safePlant.plantData.identification.commonName} aggiunta a Le mie piante!`,
      "success"
    );
  };

  // Update plant parameters (schedule, location, notes, nickname)
  const handleUpdatePlant = (plantId: string, updates: Partial<SavedPlant>) => {
    setSavedPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, ...updates } : p))
    );
    showToast("✓ Modifiche salvate con successo!", "success");
  };

  // Water a plant now
  const handleWaterPlant = (plantId: string) => {
    setSavedPlants((prev) =>
      prev.map((p) => {
        if (p.id === plantId) {
          const nowStr = new Date().toISOString();
          return {
            ...p,
            lastWatered: nowStr,
            wateringHistory: [
              { date: nowStr, notes: "Annaffiatura completata" },
              ...(p.wateringHistory || []),
            ],
          };
        }
        return p;
      })
    );
    showToast("💧 Annaffiatura registrata! Timer ricalcolato.");
  };

  // Remove plant from collection
  const handleRemovePlant = (plantId: string) => {
    const plantToRemove = savedPlants.find((p) => p.id === plantId);
    const plantName =
      plantToRemove?.nickname ||
      plantToRemove?.plantData.identification.commonName ||
      "Pianta";
    setSavedPlants((prev) => prev.filter((p) => p.id !== plantId));
    showToast(`"${plantName}" rimossa da Le mie piante.`);
  };

  // Camera capture callback
  const handleCameraCapture = (base64Data: string) => {
    setIsCameraOpen(false);
    handleAnalyzeImage(base64Data);
  };

  // Check if plant currently viewed is saved in garden
  const isCurrentPlantSaved = currentPlant
    ? savedPlants.some(
        (p) =>
          p.plantData.identification.scientificName.toLowerCase() ===
          currentPlant.identification.scientificName.toLowerCase()
      )
    : false;

  // Calculate plants due for watering count
  const plantsDueForWateringCount = savedPlants.filter((plant) => {
    const daysInterval =
      plant.customSchedule?.daysInterval ||
      plant.plantData.customWateringSchedule?.recommendedBaseDays ||
      7;
    if (!plant.lastWatered) return true;
    const diffMs = new Date().getTime() - new Date(plant.lastWatered).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return daysInterval - diffDays <= 0;
  }).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-2xl shadow-xl flex items-start gap-3 border animate-in slide-in-from-top duration-300 ${
            notification.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm font-medium">
            {notification.message}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gardenCount={savedPlants.length}
        plantsDueForWateringCount={plantsDueForWateringCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewScan={() => {
          setCurrentPlant(null);
          setActiveTab("identify");
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "identify" && (
          <>
            {currentPlant ? (
              <PlantAnalysisView
                plantData={currentPlant}
                onNewScan={() => {
                  setCurrentPlant(null);
                }}
                onSaveToGarden={handleSaveToGarden}
                onLogWateringNow={() => {
                  showToast("💧 Annaffiatura registrata per oggi!", "success");
                }}
                isSavedInGarden={isCurrentPlantSaved}
              />
            ) : (
              <ImageUploader
                onAnalyze={handleAnalyzeImage}
                onSelectSample={handleSelectSample}
                onOpenCamera={() => setIsCameraOpen(true)}
                isLoading={isScanning}
              />
            )}
          </>
        )}

        {activeTab === "garden" && (
          <MyGardenView
            savedPlants={savedPlants}
            onSelectPlant={(plant) => {
              setCurrentPlant(plant);
              setActiveTab("identify");
            }}
            onWaterPlant={handleWaterPlant}
            onRemovePlant={handleRemovePlant}
            onAddPlant={handleAddPlant}
            onUpdatePlant={handleUpdatePlant}
            onNewScan={() => {
              setCurrentPlant(null);
              setActiveTab("identify");
            }}
            onOpenCamera={() => {
              setIsCameraOpen(true);
            }}
          />
        )}

        {activeTab === "explore" && (
          <ExploreEncyclopediaView
            onSelectSample={handleSelectSample}
            onNewScan={() => {
              setCurrentPlant(null);
              setActiveTab("identify");
            }}
          />
        )}
      </main>

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Scanning AI Animation Modal */}
      <ScanningModal
        isOpen={isScanning}
        imagePreview={scanningImagePreview}
      />

      {/* APK & Server Configuration Modal */}
      <AppSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900 text-sm">
              FloraID
            </span>
            <span>·</span>
            <span>Identificatore Botanico & Cura delle Piante in stile PictureThis</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-600">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>🤖 App Android (APK) & GitHub Actions</span>
            </button>
            <span className="hidden sm:inline">·</span>
            <span>Riconoscimento Vision AI</span>
            <span className="hidden sm:inline">·</span>
            <span>Diagnosi Malattie</span>
            <span className="hidden sm:inline">·</span>
            <span>Irrigazione Personalizzata</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
