import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { SavedPlant } from "../types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  plant: SavedPlant | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  plant,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !plant) return null;

  const plantName = plant.nickname || plant.plantData.identification.commonName;
  const scientific = plant.plantData.identification.scientificName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 flex items-start justify-between border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Eliminare da Le mie piante?
              </h3>
              <p className="text-xs text-stone-500">
                L'operazione rimuoverà la pianta dalla tua collezione
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with plant preview */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3.5 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            {plant.plantData.analyzedImage ? (
              <img
                src={plant.plantData.analyzedImage}
                alt={plantName}
                className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-stone-200 text-stone-500 flex items-center justify-center text-xl shrink-0">
                🌿
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                {plantName}
              </h4>
              <p className="font-serif italic text-xs text-stone-500 truncate">
                {scientific}
              </p>
              <span className="text-[10px] text-stone-400">
                Aggiunta il {new Date(plant.addedAt).toLocaleDateString("it-IT")}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Verranno rimossi anche il promemoria dell'irrigazione e lo storico registrato per questa pianta.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Elimina Pianta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
