import React, { useState } from "react";
import {
  Sprout,
  Droplets,
  Calendar,
  AlertCircle,
  CheckCircle,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  Sparkles,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Check,
} from "lucide-react";
import { SavedPlant, PlantAnalysisResult } from "../types";
import { GardenClimateAdvisor } from "./GardenClimateAdvisor";
import { AddPlantModal } from "./AddPlantModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { EditPlantModal } from "./EditPlantModal";

interface MyGardenViewProps {
  savedPlants: SavedPlant[];
  onSelectPlant: (plantData: PlantAnalysisResult) => void;
  onWaterPlant: (plantId: string) => void;
  onRemovePlant: (plantId: string) => void;
  onAddPlant: (plant: SavedPlant) => void;
  onUpdatePlant: (plantId: string, updates: Partial<SavedPlant>) => void;
  onNewScan: () => void;
  onOpenCamera: () => void;
}

export const MyGardenView: React.FC<MyGardenViewProps> = ({
  savedPlants,
  onSelectPlant,
  onWaterPlant,
  onRemovePlant,
  onAddPlant,
  onUpdatePlant,
  onNewScan,
  onOpenCamera,
}) => {
  const [filter, setFilter] = useState<"all" | "due" | "healthy">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<SavedPlant | null>(null);
  const [plantToEdit, setPlantToEdit] = useState<SavedPlant | null>(null);

  const getWateringStatus = (plant: SavedPlant) => {
    const daysInterval =
      plant.customSchedule?.daysInterval ||
      plant.plantData.customWateringSchedule?.recommendedBaseDays ||
      7;

    if (!plant.lastWatered) {
      return {
        isDue: true,
        daysLeft: 0,
        text: "Da innaffiare oggi (mai registrata)",
        badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      };
    }

    const last = new Date(plant.lastWatered);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysLeft = daysInterval - diffDays;

    if (daysLeft <= 0) {
      const overdueDays = Math.abs(daysLeft);
      return {
        isDue: true,
        daysLeft,
        text:
          overdueDays === 0
            ? "Innaffia oggi!"
            : `In ritardo di ${overdueDays} ${overdueDays === 1 ? "giorno" : "giorni"}!`,
        badgeClass: "bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse",
      };
    } else if (daysLeft === 1) {
      return {
        isDue: false,
        daysLeft,
        text: "Domani",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      };
    } else {
      return {
        isDue: false,
        daysLeft,
        text: `Tra ${daysLeft} giorni`,
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    }
  };

  const filteredPlants = savedPlants.filter((plant) => {
    const status = getWateringStatus(plant);
    if (filter === "due") return status.isDue;
    if (filter === "healthy") {
      return (plant.plantData.healthDiagnosis?.healthScore ?? 90) >= 80;
    }
    return true;
  });

  const dueCount = savedPlants.filter((p) => getWateringStatus(p).isDue).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in pb-16">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Collezione Personale Botanica</span>
            <span className="text-stone-300">·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Memoria locale sincronizzata
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Le mie piante
          </h1>
          <p className="text-sm text-stone-600">
            Monitora lo stato di salute, i turni di annaffiatura e gestisci liberamente la tua collezione botanica.
          </p>
        </div>

        {/* Primary Action: Add Plant */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Pianta</span>
          </button>
        </div>
      </div>

      {/* Geolocation & Seasonal Climate Advisor Module */}
      <GardenClimateAdvisor savedPlants={savedPlants} />

      {/* Filter Tabs & Auto-save Status Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            Tutte ({savedPlants.length})
          </button>

          <button
            onClick={() => setFilter("due")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "due"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Da Innaffiare ({dueCount})</span>
          </button>

          <button
            onClick={() => setFilter("healthy")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "healthy"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            In Ottima Salute
          </button>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 self-end sm:self-auto">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Le ultime modifiche vengono salvate automaticamente e mantenute ad ogni riapertura</span>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const status = getWateringStatus(plant);
            const daysInterval =
              plant.customSchedule?.daysInterval ||
              plant.plantData.customWateringSchedule?.recommendedBaseDays ||
              7;
            const amountMl =
              plant.customSchedule?.amountMl ||
              plant.plantData.customWateringSchedule?.recommendedAmountMl ||
              350;
            const health = plant.plantData.healthDiagnosis?.healthScore ?? 90;
            const plantDisplayName = plant.nickname || plant.plantData.identification.commonName;

            return (
              <div
                key={plant.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Plant Card Image & Badges */}
                  <div className="relative aspect-16/10 bg-stone-900 overflow-hidden">
                    {plant.plantData.analyzedImage ? (
                      <img
                        src={plant.plantData.analyzedImage}
                        alt={plantDisplayName}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                        <span className="text-3xl sm:text-4xl mb-1">🌿</span>
                        <span className="text-[11px] sm:text-xs font-medium text-stone-500">Foto personalizzata</span>
                      </div>
                    )}

                    {/* Health score tag */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Salute: {health}%</span>
                    </div>

                    {/* Action buttons on image overlay: Edit and Delete */}
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlantToEdit(plant);
                        }}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-stone-800 text-white transition-colors cursor-pointer"
                        title="Modifica parametri pianta"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlantToDelete(plant);
                        }}
                        className="p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Elimina da Le mie piante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div>
                      <h3
                        className="font-serif text-lg sm:text-xl font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1 leading-snug"
                        onClick={() => onSelectPlant(plant.plantData)}
                        title={plantDisplayName}
                      >
                        {plantDisplayName}
                      </h3>
                      <p className="font-serif italic text-xs text-stone-500 line-clamp-1">
                        {plant.plantData.identification.scientificName}
                      </p>
                    </div>

                    {/* Watering Status Box */}
                    <div className="p-3 sm:p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 truncate">
                          <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
                          <span className="truncate">Prossima Annaffiatura</span>
                        </span>
                        <span
                          className={`text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 rounded-lg border font-semibold shrink-0 text-center ${status.badgeClass}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-600 pt-1 border-t border-stone-200/50">
                        <span>Ogni {daysInterval} gg</span>
                        <span>Dose: ~{amountMl} ml</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onWaterPlant(plant.id)}
                    className="flex-1 py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Registra annaffiatura completata oggi"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Innaffia Ora</span>
                  </button>

                  <button
                    onClick={() => onSelectPlant(plant.plantData)}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Vedi scheda botanica completa"
                  >
                    <span>Scheda</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Add Plant Card in the Grid */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all group cursor-pointer min-h-[300px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-emerald-100 text-stone-500 group-hover:text-emerald-700 flex items-center justify-center mb-3 transition-colors">
              <Plus className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-stone-800 group-hover:text-emerald-900 transition-colors">
              Aggiungi un'altra pianta
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Scegli dal catalogo rapido, crea una scheda personalizzata o scatta una foto
            </p>
          </button>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            {filter === "all"
              ? "Nessuna pianta in Le mie piante"
              : "Nessuna pianta trovata con questo filtro"}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            {filter === "due"
              ? "Tutte le tue piante sono ben idratate! Nessuna irrigazione urgente richiesta oggi."
              : "La tua collezione è vuota. Puoi aggiungere piante dal catalogo con 1 click, inserirle manualmente o identificarle scattando una foto."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi la Tua Prima Pianta</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlant={onAddPlant}
        onStartPhotoScan={onNewScan}
        onStartCameraScan={onOpenCamera}
        existingPlants={savedPlants}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={plantToDelete !== null}
        plant={plantToDelete}
        onClose={() => setPlantToDelete(null)}
        onConfirm={() => {
          if (plantToDelete) {
            onRemovePlant(plantToDelete.id);
            setPlantToDelete(null);
          }
        }}
      />

      {/* Edit Plant Modal */}
      <EditPlantModal
        isOpen={plantToEdit !== null}
        plant={plantToEdit}
        onClose={() => setPlantToEdit(null)}
        onSave={(plantId, updates) => {
          onUpdatePlant(plantId, updates);
          setPlantToEdit(null);
        }}
      />
    </div>
  );
};
