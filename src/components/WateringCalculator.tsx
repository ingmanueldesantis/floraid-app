import React, { useState } from "react";
import {
  Droplets,
  Calendar,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";
import { PlantAnalysisResult } from "../types";
import { getApiEndpoint } from "../services/apiConfig";

interface WateringCalculatorProps {
  plantData: PlantAnalysisResult;
  onSaveToGarden?: (customizedSchedule: {
    daysInterval: number;
    amountMl: number;
    potSize: string;
    potMaterial: string;
    exposure: string;
    location: string;
  }) => void;
  onLogWateringNow?: () => void;
  isSavedInGarden?: boolean;
}

export const WateringCalculator: React.FC<WateringCalculatorProps> = ({
  plantData,
  onSaveToGarden,
  onLogWateringNow,
  isSavedInGarden = false,
}) => {
  const baseDays = plantData.customWateringSchedule?.recommendedBaseDays || 7;
  const baseAmount = plantData.customWateringSchedule?.recommendedAmountMl || 350;

  // Configuration factors
  const [potSize, setPotSize] = useState<string>("medium");
  const [potMaterial, setPotMaterial] = useState<string>("terracotta");
  const [exposure, setExposure] = useState<string>("bright_indirect");
  const [location, setLocation] = useState<string>("indoor");
  const [season, setSeason] = useState<string>("spring");
  const [indoorClimate, setIndoorClimate] = useState<string>("temperate");

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [adjustedSchedule, setAdjustedSchedule] = useState<{
    daysInterval: number;
    amountMl: number;
    explanation: string;
    proTips: string[];
    alertCondition: string;
  } | null>(null);

  const [wateredTodayNotification, setWateredTodayNotification] = useState(false);

  // Initial local estimate formula while waiting or as quick computation
  const computeLocalAdjustment = () => {
    let days = baseDays;
    let ml = baseAmount;

    // Pot size effect
    if (potSize === "small") {
      days = Math.max(3, Math.round(days * 0.75));
      ml = Math.round(ml * 0.6);
    } else if (potSize === "large") {
      days = Math.round(days * 1.35);
      ml = Math.round(ml * 1.7);
    } else if (potSize === "ground") {
      days = Math.round(days * 1.5);
      ml = Math.round(ml * 2.5);
    }

    // Pot material effect
    if (potMaterial === "terracotta") {
      days = Math.max(2, Math.round(days * 0.85)); // porous evaporates faster
    } else if (potMaterial === "plastic") {
      days = Math.round(days * 1.15); // retains humidity
    }

    // Exposure effect
    if (exposure === "direct_sun") {
      days = Math.max(2, Math.round(days * 0.7));
    } else if (exposure === "low_light") {
      days = Math.round(days * 1.4);
    }

    // Season effect
    if (season === "summer") {
      days = Math.max(2, Math.round(days * 0.65));
      ml = Math.round(ml * 1.2);
    } else if (season === "winter") {
      days = Math.round(days * 1.8);
      ml = Math.round(ml * 0.75);
    } else if (season === "autumn") {
      days = Math.round(days * 1.2);
    }

    // Heating climate
    if (indoorClimate === "heating_ac") {
      days = Math.max(2, Math.round(days * 0.85));
    }

    return { days, ml };
  };

  const handleRecalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch(getApiEndpoint("/api/calculate-watering"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantName: plantData.identification.commonName,
          scientificName: plantData.identification.scientificName,
          baseFrequencyDays: baseDays,
          potSize,
          potMaterial,
          exposure,
          location,
          season,
          indoorClimate,
        }),
      });

      if (!res.ok) {
        throw new Error("Errore API");
      }

      const data = await res.json();
      setAdjustedSchedule({
        daysInterval: data.adjustedDaysInterval || computeLocalAdjustment().days,
        amountMl: data.waterQuantityMl || computeLocalAdjustment().ml,
        explanation: data.scheduleExplanation,
        proTips: data.proTips || [],
        alertCondition: data.alertCondition,
      });
    } catch (e) {
      // Fallback local robust computation
      const local = computeLocalAdjustment();
      setAdjustedSchedule({
        daysInterval: local.days,
        amountMl: local.ml,
        explanation: `Frequenza calibrata per ${potMaterial === "terracotta" ? "vaso poroso in terracotta" : "vaso in plastica"} in stagione ${season}. La traspirazione richiede irrigazione a cadenza regolare.`,
        proTips: [
          "Verifica sempre che i primi 3-4 cm di terriccio siano asciutti prima di versare l'acqua.",
          "Svuota il sottovaso dopo 15 minuti dall'annaffiatura per evitare marciume alle radici.",
          "Usa acqua decantata a temperatura ambiente.",
        ],
        alertCondition: "Se le foglie inferiori ingialliscono e cadono con terreno umido, allunga l'intervallo.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const currentDays = adjustedSchedule ? adjustedSchedule.daysInterval : baseDays;
  const currentAmount = adjustedSchedule ? adjustedSchedule.amountMl : baseAmount;

  // Calculate upcoming scheduled dates
  const nextDates = [1, 2, 3, 4].map((multiplier) => {
    const d = new Date();
    d.setDate(d.getDate() + currentDays * multiplier);
    return d.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  });

  const handleWaterNowClick = () => {
    if (onLogWateringNow) {
      onLogWateringNow();
    }
    setWateredTodayNotification(true);
    setTimeout(() => setWateredTodayNotification(false), 4000);
  };

  const handleSaveGardenClick = () => {
    if (onSaveToGarden) {
      onSaveToGarden({
        daysInterval: currentDays,
        amountMl: currentAmount,
        potSize,
        potMaterial,
        exposure,
        location,
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Overview Metric Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <Droplets className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Programma Personalizzato di Irrigazione</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
              {plantData.identification.commonName}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {adjustedSchedule
                ? adjustedSchedule.explanation
                : plantData.careGuide?.watering?.summary ||
                  "Programma calibrato sulle esigenze fisiologiche della pianta."}
            </p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] sm:text-xs text-stone-300 font-medium">Ogni</span>
              <span className="font-serif text-2xl sm:text-4xl font-bold text-emerald-300 leading-none my-1 block">
                {currentDays}
              </span>
              <span className="block text-[11px] sm:text-xs text-stone-300">giorni</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
              <span className="block text-[11px] sm:text-xs text-stone-300 font-medium">Quantità</span>
              <span className="font-serif text-2xl sm:text-4xl font-bold text-teal-200 leading-none my-1 block">
                {currentAmount}
              </span>
              <span className="block text-[11px] sm:text-xs text-stone-300">ml stimati</span>
            </div>
          </div>
        </div>

        {/* Action bar inside banner */}
        <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleWaterNowClick}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Droplets className="w-4 h-4 shrink-0" />
              <span>Ho innaffiato oggi!</span>
            </button>

            {onSaveToGarden && (
              <button
                onClick={handleSaveGardenClick}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs sm:text-sm font-medium border border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSavedInGarden ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Aggiornato in Le mie piante</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Salva in Le mie piante</span>
                  </>
                )}
              </button>
            )}
          </div>

          {wateredTodayNotification && (
            <div className="text-xs bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Irrigazione registrata con successo! Timer azzerato.</span>
            </div>
          )}
        </div>
      </div>

      {/* Environmental Factors Configurator */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h4 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>Personalizza per il tuo ambiente domestico</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-500">
              Modifica i parametri del vaso e della stanza per ricalcolare con precisione l'evapotraspirazione.
            </p>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="self-start sm:self-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Ricalcolo in corso...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ricalcola con AI</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dimensione Vaso */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Dimensione del Vaso
            </label>
            <select
              value={potSize}
              onChange={(e) => setPotSize(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="small">Piccolo (diametro 10-15 cm)</option>
              <option value="medium">Medio (diametro 16-25 cm)</option>
              <option value="large">Grande (diametro &gt; 26 cm)</option>
              <option value="ground">In Piena Terra / Giardino</option>
            </select>
            <p className="text-[11px] text-stone-400">
              I vasi piccoli asciugano prima dei vasi capienti.
            </p>
          </div>

          {/* Materiale Vaso */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Materiale Vaso
            </label>
            <select
              value={potMaterial}
              onChange={(e) => setPotMaterial(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="terracotta">Terracotta classica (traspirante, rapida asciugatura)</option>
              <option value="plastic">Plastica o resina (trattiene umidità)</option>
              <option value="ceramic">Ceramica smaltata (trattiene umidità)</option>
            </select>
            <p className="text-[11px] text-stone-400">
              La terracotta dissipa l'acqua attraverso le pareti microporose.
            </p>
          </div>

          {/* Esposizione Luce */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Esposizione alla Luce
            </label>
            <select
              value={exposure}
              onChange={(e) => setExposure(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="bright_indirect">Luce brillante indiretta (consigliata)</option>
              <option value="direct_sun">Sole diretto per diverse ore</option>
              <option value="medium_shade">Mezz'ombra / luce moderata</option>
              <option value="low_light">Luce bassa / stanza poco illuminata</option>
            </select>
            <p className="text-[11px] text-stone-400">
              Più luce riceve la pianta, più rapida è la fotosintesi e il consumo idrico.
            </p>
          </div>

          {/* Posizione */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Collocazione
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="indoor">Interno appartamento / ufficio</option>
              <option value="balcony">Balcone o terrazzo coperto</option>
              <option value="garden">Giardino aperto / esterno</option>
            </select>
          </div>

          {/* Stagione */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Stagione Attuale
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="spring">Primavera (fase di risveglio vegetativo)</option>
              <option value="summer">Estate (picco caldo e traspirazione)</option>
              <option value="autumn">Autunno (rallentamento)</option>
              <option value="winter">Inverno (riposo vegetativo)</option>
            </select>
          </div>

          {/* Riscaldamento / Clima */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Clima della Stanza
            </label>
            <select
              value={indoorClimate}
              onChange={(e) => setIndoorClimate(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="temperate">Temperato naturale (18-22°C)</option>
              <option value="heating_ac">Termosifoni o aria condizionata attiva (secco)</option>
              <option value="humid">Ambiente umido (es. bagno finestrato, 65%+)</option>
            </select>
          </div>
        </div>

        {/* Dynamic tips if recalculated */}
        {adjustedSchedule?.proTips && adjustedSchedule.proTips.length > 0 && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Consigli specifici per la tua configurazione:</span>
            </div>
            <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
              {adjustedSchedule.proTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {adjustedSchedule?.alertCondition && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block">Campanello d'allarme idrico:</span>
              <span>{adjustedSchedule.alertCondition}</span>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Irrigation Calendar Forecast */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0" />
              <span>Prossime Date Previste (Prossime 4 irrigazioni)</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-stone-500">
              Previsione dinamica calcolata a intervalli di {currentDays} giorni.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {nextDates.map((dateStr, index) => (
            <div
              key={index}
              className={`p-2.5 sm:p-3.5 rounded-xl border text-center transition-all ${
                index === 0
                  ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <span className="block text-[9px] sm:text-[10px] uppercase font-semibold text-stone-500 truncate">
                {index === 0 ? "Prossima in assoluto" : `Irrigazione #${index + 1}`}
              </span>
              <span className="font-serif font-bold text-sm sm:text-base lg:text-lg text-stone-900 block mt-1 truncate">
                {dateStr}
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-800 font-medium block mt-0.5">
                {currentAmount} ml
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Watering Best Practices Card */}
      <div className="bg-stone-100/70 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-stone-200/60 space-y-3 sm:space-y-4">
        <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
          La Regola d'Oro Botanica per questa pianta
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs text-stone-700">
          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/70 space-y-1.5 sm:space-y-2 leading-relaxed">
            <span className="font-bold text-stone-900 block text-xs sm:text-sm">
              🖐️ Il Test del Dito (Finger Moisture Test)
            </span>
            <p className="text-[11px] sm:text-xs">
              {plantData.customWateringSchedule?.moistureIndicatorGuide ||
                plantData.careGuide?.watering?.soilMoistureCheck ||
                "Infila l'indice nel terreno fino alla seconda nocca. Se il terreno è freddo o terroso sul dito, aspetta ancora 2-3 giorni. Se è completamente asciutto, innaffia."}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-stone-200/70 space-y-1.5 sm:space-y-2 leading-relaxed">
            <span className="font-bold text-stone-900 block text-xs sm:text-sm">
              💧 Qualità dell'Acqua Consigliata
            </span>
            <p className="text-[11px] sm:text-xs">
              {plantData.customWateringSchedule?.waterQualityTips ||
                "Utilizza preferibilmente acqua a temperatura ambiente lasciata riposare per 24 ore per consentire l'evaporazione del cloro, evitando shock termici radicali."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
