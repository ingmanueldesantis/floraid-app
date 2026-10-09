import React, { useState, useEffect } from "react";
import { X, Sliders, Droplets, Check, Calendar, MapPin } from "lucide-react";
import { SavedPlant } from "../types";

interface EditPlantModalProps {
  isOpen: boolean;
  plant: SavedPlant | null;
  onClose: () => void;
  onSave: (plantId: string, updates: Partial<SavedPlant>) => void;
}

export const EditPlantModal: React.FC<EditPlantModalProps> = ({
  isOpen,
  plant,
  onClose,
  onSave,
}) => {
  const [nickname, setNickname] = useState("");
  const [daysInterval, setDaysInterval] = useState(7);
  const [amountMl, setAmountMl] = useState(350);
  const [location, setLocation] = useState("indoor");
  const [potMaterial, setPotMaterial] = useState("terracotta");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (plant) {
      setNickname(plant.nickname || plant.plantData.identification.commonName);
      setDaysInterval(
        plant.customSchedule?.daysInterval ||
        plant.plantData.customWateringSchedule?.recommendedBaseDays ||
        7
      );
      setAmountMl(
        plant.customSchedule?.amountMl ||
        plant.plantData.customWateringSchedule?.recommendedAmountMl ||
        350
      );
      setLocation(plant.customSchedule?.location || "indoor");
      setPotMaterial(plant.customSchedule?.potMaterial || "terracotta");
      setNotes(plant.wateringHistory?.[0]?.notes || "");
    }
  }, [plant]);

  if (!isOpen || !plant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plant.id, {
      nickname: nickname.trim(),
      customSchedule: {
        daysInterval,
        amountMl,
        potSize: plant.customSchedule?.potSize || "medium",
        potMaterial,
        exposure: plant.customSchedule?.exposure || "bright_indirect",
        location,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Modifica Scheda Pianta
              </h3>
              <p className="text-xs text-stone-500">
                Aggiorna frequenza, posizione e parametri di cura
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Nome o Soprannome Personalizzato
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Posizione
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs bg-white"
              >
                <option value="indoor">Interno casa</option>
                <option value="balcony">Balcone / Terrazzo</option>
                <option value="garden">Giardino esterno</option>
                <option value="office">Ufficio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Materiale Vaso
              </label>
              <select
                value={potMaterial}
                onChange={(e) => setPotMaterial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs bg-white"
              >
                <option value="terracotta">Terracotta</option>
                <option value="plastic">Plastica con fori</option>
                <option value="ceramic">Ceramica smaltata</option>
                <option value="ground">Piena terra</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Intervallo di Irrigazione</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg border border-emerald-300/60">
                Ogni {daysInterval} giorni
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[2, 3, 5, 7, 10, 14, 21, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysInterval(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    daysInterval === d
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  {d} gg
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Dose Acqua (ml)
              </label>
              <input
                type="number"
                min="50"
                max="3000"
                step="50"
                value={amountMl}
                onChange={(e) => setAmountMl(Number(e.target.value))}
                className="w-32 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva Modifiche</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
