import React, { useState } from "react";
import {
  Sun,
  Droplets,
  Thermometer,
  Layers,
  Scissors,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Heart,
  Calendar,
  Camera,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Check,
  BookOpen,
  Wind,
  Compass,
  Award,
  Flower2,
  Bug,
  Info,
} from "lucide-react";
import { PlantAnalysisResult } from "../types";
import { WateringCalculator } from "./WateringCalculator";
import { PlantDoctorChat } from "./PlantDoctorChat";

interface PlantAnalysisViewProps {
  plantData: PlantAnalysisResult;
  onNewScan: () => void;
  onSaveToGarden: (customSchedule?: any) => void;
  onLogWateringNow: () => void;
  isSavedInGarden: boolean;
}

export const PlantAnalysisView: React.FC<PlantAnalysisViewProps> = ({
  plantData,
  onNewScan,
  onSaveToGarden,
  onLogWateringNow,
  isSavedInGarden,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "wiki" | "care" | "watering" | "chat" | "curiosities"
  >("overview");

  const {
    identification,
    healthDiagnosis,
    careGuide,
    scientificClassification,
    botanicalCharacteristics,
    symbolismAndCulture,
    benefitsAndUses,
    usdaHardiness,
    popularCultivars,
    commonPestsAndDiseases,
  } = plantData;

  const healthScore = healthDiagnosis?.healthScore ?? 90;
  const isHealthy = healthScore >= 80;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={onNewScan}
            className="hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1 font-medium"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Nuova Identificazione</span>
          </button>
          <span>/</span>
          <span className="text-stone-800 font-semibold truncate max-w-xs">
            {identification.commonName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogWateringNow}
            className="px-3.5 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>Innaffiata Oggi</span>
          </button>

          <button
            onClick={() => onSaveToGarden()}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              isSavedInGarden
                ? "bg-stone-900 text-white hover:bg-stone-800"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {isSavedInGarden ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Le mie piante</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Aggiungi a Le mie piante</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Botanical Hero Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Photo & Health overlay */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] bg-stone-950">
            {plantData.analyzedImage ? (
              <img
                src={plantData.analyzedImage}
                alt={identification.commonName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-600">
                <Camera className="w-16 h-16" />
              </div>
            )}

            {/* PictureThis style Match Confidence */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-stone-900/85 backdrop-blur-md text-white text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium flex items-center gap-1.5 border border-white/10 max-w-[85%] truncate">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Corrispondenza: {identification.confidence}%</span>
            </div>

            {/* Health pill in photo corner */}
            <div
              className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between border ${
                isHealthy
                  ? "bg-emerald-950/85 text-emerald-200 border-emerald-500/30"
                  : "bg-amber-950/85 text-amber-200 border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isHealthy ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                )}
                <div className="text-xs min-w-0">
                  <span className="font-bold block truncate">Diagnosi Visiva</span>
                  <span className="text-[10px] sm:text-[11px] opacity-90 truncate block">{healthDiagnosis.status}</span>
                </div>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="font-serif font-bold text-base sm:text-lg leading-none">
                  {healthScore}/100
                </span>
                <span className="block text-[9px] sm:text-[10px] opacity-80">Indice Salute</span>
              </div>
            </div>
          </div>

          {/* Botanical Details Content */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              {/* Botanical Title Header */}
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
                  <span>Famiglia: {identification.family}</span>
                  <span>·</span>
                  <span>Genere: {identification.genus}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                  {identification.commonName}
                </h1>
                <p className="font-serif italic text-base sm:text-lg lg:text-xl text-stone-600 mt-1">
                  {identification.scientificName}
                </p>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
                <span className="bg-stone-100 text-stone-800 font-medium px-2.5 py-1 rounded-lg border border-stone-200/70">
                  Difficoltà: <strong>{identification.difficultyLevel}</strong>
                </span>

                {identification.toxicity?.isToxicToPets ? (
                  <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                    <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 shrink-0" />
                    <span>Tossica per Animali</span>
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                    <span>Pet Friendly</span>
                  </span>
                )}

                {benefitsAndUses?.airPurificationNasa && (
                  <span className="bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                    <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
                    <span>Filtro Aria NASA</span>
                  </span>
                )}

                {usdaHardiness?.zones && (
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {usdaHardiness.zones}
                  </span>
                )}

                <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium break-words">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
                  <span>Dati Scientifici Verificati</span>
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {identification.shortDescription}
              </p>
            </div>

            {/* Quick At-a-Glance Care Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-stone-100 text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-[10px] sm:text-xs block mb-0.5 sm:mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500 inline mr-1 shrink-0" />
                  Luce
                </span>
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs block truncate" title={careGuide?.light?.requirement || "Indiretta brillante"}>
                  {careGuide?.light?.requirement || "Indiretta brillante"}
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-[10px] sm:text-xs block mb-0.5 sm:mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500 inline mr-1 shrink-0" />
                  Irrigazione
                </span>
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs block truncate">
                  Ogni {careGuide?.watering?.summerFrequencyDays || 7} giorni
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-[10px] sm:text-xs block mb-0.5 sm:mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500 inline mr-1 shrink-0" />
                  Temperatura
                </span>
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs block truncate" title={careGuide?.temperatureAndHumidity?.idealRange || "18-24°C"}>
                  {careGuide?.temperatureAndHumidity?.idealRange || "18-24°C"}
                </span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="text-stone-400 text-[10px] sm:text-xs block mb-0.5 sm:mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 inline mr-1 shrink-0" />
                  Terreno
                </span>
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs block truncate" title={careGuide?.soilAndRepotting?.phRange ? `pH ${careGuide.soilAndRepotting.phRange}` : "Ben drenante"}>
                  {careGuide?.soilAndRepotting?.phRange ? `pH ${careGuide.soilAndRepotting.phRange}` : "Ben drenante"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (PictureThis Wiki Experience) */}
      <div className="border-b border-stone-200 -mx-1 sm:mx-0">
        <div className="flex gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar px-1 sm:px-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "overview"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Panoramica</span>
          </button>

          <button
            onClick={() => setActiveTab("wiki")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "wiki"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Wiki Enciclopedia</span>
          </button>

          <button
            onClick={() => setActiveTab("care")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "care"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
            <span>Guida Cura</span>
          </button>

          <button
            onClick={() => setActiveTab("watering")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "watering"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0" />
            <span>Irrigazione</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "chat"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Botanico AI</span>
          </button>

          <button
            onClick={() => setActiveTab("curiosities")}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === "curiosities"
                ? "border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600 shrink-0" />
            <span>Curiosità</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Health Doctor */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Health Diagnosis Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isHealthy
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isHealthy ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                    Referto Clinico Vegetale
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500">
                    Stato: <strong>{healthDiagnosis.status}</strong> · Indice di vitalità:{" "}
                    <strong>{healthScore}%</strong>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {healthDiagnosis.summary}
            </p>

            {/* Issues detected */}
            {healthDiagnosis.issuesDetected && healthDiagnosis.issuesDetected.length > 0 ? (
              <div className="space-y-3 pt-1">
                <h4 className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500">
                  Anomalie o Attenzioni Rilevate:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {healthDiagnosis.issuesDetected.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5 sm:space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs sm:text-sm text-amber-950">
                          {issue.title}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 shrink-0">
                          Gravità: {issue.severity}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-amber-900 leading-snug">
                        <p>
                          <strong>Sintomo:</strong> {issue.symptom}
                        </p>
                        <p>
                          <strong>Causa:</strong> {issue.cause}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-white/80 rounded-xl text-xs text-emerald-950 border border-amber-200/50 leading-relaxed">
                        <strong className="block text-emerald-900 mb-0.5">
                          💡 Trattamento consigliato:
                        </strong>
                        {issue.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 leading-snug">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Nessuna patologia fungina o parassitaria evidente riscontrata. La pianta presenta un vigore vegetativo eccellente.
                </span>
              </div>
            )}

            {/* Preventive Tips */}
            {healthDiagnosis.preventiveTips && healthDiagnosis.preventiveTips.length > 0 && (
              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500 mb-2.5">
                  Consigli di Mantenimento Preventivo:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-stone-700">
                  {healthDiagnosis.preventiveTips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60 leading-relaxed"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* PictureThis Wiki Highlights teaser card */}
          {benefitsAndUses && (
            <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-emerald-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dalla Scheda Wiki Ufficiale</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                    Purificazione dell'Aria & Fotosintesi Notturna CAM
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    {benefitsAndUses.bedroomNightOxygen}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("wiki")}
                  className="w-full sm:w-auto text-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  Esplora l'Enciclopedia Completa →
                </button>
              </div>
            </div>
          )}

          {/* Habitat & Toxicity Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Origini & Habitat Naturale
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {identification.fullDescription}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Sicurezza Domestica & Tossicità</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div
                  className={`p-3.5 rounded-xl border ${
                    identification.toxicity.isToxicToPets
                      ? "bg-rose-50/70 border-rose-200 text-rose-950"
                      : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  }`}
                >
                  <span className="font-bold block mb-1">
                    🐾 Animali Domestici (Cani & Gatti):{" "}
                    {identification.toxicity.isToxicToPets ? "Tossica" : "Sicura"}
                  </span>
                  <p>{identification.toxicity.petDetails}</p>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    identification.toxicity.isToxicToHumans
                      ? "bg-amber-50/70 border-amber-200 text-amber-950"
                      : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  }`}
                >
                  <span className="font-bold block mb-1">
                    👤 Esseri Umani & Bambini:{" "}
                    {identification.toxicity.isToxicToHumans ? "Attenzione" : "Innocua"}
                  </span>
                  <p>{identification.toxicity.humanDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PictureThis Botanical Wiki Encyclopedia */}
      {activeTab === "wiki" && (
        <div className="space-y-8">
          {/* Header intro */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>PictureThis Botanical Wiki Archive</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Scheda Scientifica & Enciclopedia: {identification.commonName}
              </h2>
              <p className="font-serif italic text-stone-300 text-sm">
                {identification.scientificName}
              </p>
              <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed pt-1">
                Tutte le caratteristiche botaniche morfologiche, classificazione tassonomica linneana, studio NASA sulla purificazione dell'aria, simbolismo e cultivar di questa specie.
              </p>
            </div>
          </div>

          {/* 1. Classificazione Scientifica Linneana (Tassonomia) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-1.5">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Classificazione Scientifica (Tassonomia)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Gerarchia tassonomica e sinonimi botanici ufficiali
                </p>
              </div>
              <span className="self-start sm:self-auto text-[10px] sm:text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-mono">
                ICN / APG IV
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Regno</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                  {scientificClassification?.kingdom || "Plantae"}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Phylum / Div.</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                  {scientificClassification?.phylum || "Tracheophyta"}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Classe</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                  {scientificClassification?.class || "Liliopsida"}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Ordine</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                  {scientificClassification?.order || "Asparagales"}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Famiglia</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm block truncate">
                  {scientificClassification?.family || identification.family}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Genere</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm italic block truncate">
                  {scientificClassification?.genus || identification.genus}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-200/60 col-span-2 sm:col-span-2">
                <span className="text-stone-400 block text-[9px] sm:text-[10px] uppercase font-bold">Specie</span>
                <span className="font-semibold text-stone-900 text-xs sm:text-sm italic block truncate">
                  {scientificClassification?.species || identification.scientificName}
                </span>
              </div>
            </div>

            {/* Botanical synonyms */}
            {scientificClassification?.botanicalSynonyms && scientificClassification.botanicalSynonyms.length > 0 && (
              <div className="pt-1 sm:pt-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5 sm:mb-2">
                  Sinonimi botanici noti:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                  {scientificClassification.botanicalSynonyms.map((syn, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-stone-100 text-stone-700 italic rounded-lg border border-stone-200/70"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Caratteristiche Botaniche & Morfologia */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Caratteristiche Botaniche & Morfologia</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Tratti distintivi di fusto, foglie, fiori e fioritura
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 sm:space-y-2">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                  🌿 Portamento & Dimensioni
                </span>
                <div className="space-y-1 text-stone-700 leading-snug">
                  <p><strong>Tipo di pianta:</strong> {botanicalCharacteristics?.plantType || "Perenne sempreverde"}</p>
                  <p><strong>Ciclo vitale:</strong> {botanicalCharacteristics?.lifespan || "Perenne"}</p>
                  <p><strong>Altezza matura:</strong> {botanicalCharacteristics?.matureHeight || "60-120 cm"}</p>
                  <p><strong>Larghezza chioma:</strong> {botanicalCharacteristics?.matureSpread || "30-60 cm"}</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 sm:space-y-2">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                  🍃 Lamina Fogliare
                </span>
                <div className="space-y-1 text-stone-700 leading-snug">
                  <p><strong>Colore foglie:</strong> {botanicalCharacteristics?.leafColor || "Verde scuro variegato"}</p>
                  <p><strong>Forma:</strong> {botanicalCharacteristics?.leafShape || "Spadiforme eretta"}</p>
                  <p><strong>Dimensioni foglia:</strong> {botanicalCharacteristics?.leafSize || "70-90 cm di lunghezza"}</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 sm:space-y-2">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                  🌸 Fioritura & Profumo
                </span>
                <div className="space-y-1 text-stone-700 leading-snug">
                  <p><strong>Colore dei fiori:</strong> {botanicalCharacteristics?.flowerColor || "Bianco-verdastro o crema"}</p>
                  <p><strong>Periodo di fioritura:</strong> {botanicalCharacteristics?.bloomTime || "Primavera - Estate"}</p>
                  <p><strong>Profumazione:</strong> {botanicalCharacteristics?.flowerFragrance || "Dolce profumo serale"}</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 sm:space-y-2">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                  🌡️ Zona di Rusticità USDA & Clima
                </span>
                <div className="space-y-1 text-stone-700 leading-snug">
                  <p><strong>Zone USDA:</strong> {usdaHardiness?.zones || "Zone 10 - 12"}</p>
                  <p><strong>Temperatura minima:</strong> {usdaHardiness?.minOutdoorTemp || "10°C (teme il gelo)"}</p>
                  {botanicalCharacteristics?.fruit && (
                    <p><strong>Frutti:</strong> {botanicalCharacteristics.fruit}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Benefici per la Salute & Studio NASA sulla Purificazione dell'Aria */}
          {benefitsAndUses && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-sky-600 shrink-0" />
                  <span>Purificazione dell'Aria NASA & Benefici Ambientali</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Efficacia documentata contro le tossine domestiche e metabolismo notturno
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 text-xs">
                <div className="p-3.5 sm:p-5 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-1.5 sm:space-y-2">
                  <span className="font-bold text-sky-950 text-xs sm:text-sm block flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Rapporto NASA Clean Air Study</span>
                  </span>
                  <p className="text-sky-900 leading-relaxed text-xs">
                    {benefitsAndUses.airPurificationNasa}
                  </p>
                </div>

                <div className="p-3.5 sm:p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5 sm:space-y-2">
                  <span className="font-bold text-emerald-950 text-xs sm:text-sm block flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Metabolismo Notturno CAM</span>
                  </span>
                  <p className="text-emerald-900 leading-relaxed text-xs">
                    {benefitsAndUses.bedroomNightOxygen}
                  </p>
                </div>
              </div>

              {benefitsAndUses.practicalUses && (
                <div className="p-3 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-700 leading-relaxed">
                  <strong className="block text-stone-900 mb-1">Usi Pratici & Applicazioni Tradizionali:</strong>
                  <p>{benefitsAndUses.practicalUses}</p>
                </div>
              )}
            </div>
          )}

          {/* 4. Simbolismo, Feng Shui & Origine dei Nomi Popolari */}
          {symbolismAndCulture && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Simbolismo, Feng Shui & Nomi Popolari</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Tradizione culturale, energia spirituale e storie etimologiche
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs">
                <div className="p-3.5 sm:p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                  <span className="font-bold text-amber-950 text-xs sm:text-sm block">
                    🎋 Principi Feng Shui & Disposizione Domestica:
                  </span>
                  <p className="text-amber-900 leading-relaxed text-xs">
                    {symbolismAndCulture.fengShui}
                  </p>
                </div>

                {symbolismAndCulture.popularNamesOrigins && symbolismAndCulture.popularNamesOrigins.length > 0 && (
                  <div className="space-y-2 sm:space-y-3 pt-1">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 block">
                      Perché si chiama così? L'origine dei nomi volgari:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                      {symbolismAndCulture.popularNamesOrigins.map((orig, idx) => (
                        <div
                          key={idx}
                          className="p-3 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1 sm:space-y-1.5"
                        >
                          <span className="font-bold text-stone-900 text-xs block">
                            {orig.name}
                          </span>
                          <p className="text-stone-600 text-[11px] sm:text-xs leading-relaxed">
                            {orig.originExplanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Cultivar & Varietà Notevoli (PictureThis Cultivars) */}
          {popularCultivars && popularCultivars.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Cultivar & Varietà Notevoli</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Le selezioni botaniche più amate e collezionate nel mondo
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs">
                {popularCultivars.map((cult, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1 sm:space-y-1.5 hover:border-purple-300 transition-colors"
                  >
                    <span className="font-bold text-stone-900 text-xs block font-serif">
                      {cult.name}
                    </span>
                    <p className="text-stone-600 text-[11px] sm:text-xs leading-relaxed">
                      {cult.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Parassiti e Malattie Comuni (PictureThis Doctor) */}
          {commonPestsAndDiseases && commonPestsAndDiseases.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 shadow-xs">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Dottore Piante: Parassiti e Malattie Comuni</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Sintomi frequenti, cause patogene e trattamenti specifici
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
                {commonPestsAndDiseases.map((pest, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-rose-950 text-xs block">
                        {pest.name}
                      </span>
                      <p className="text-rose-900 text-[11px] sm:text-xs mt-1 leading-snug">
                        <strong>Sintomi:</strong> {pest.symptoms}
                      </p>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl text-[11px] sm:text-xs text-stone-800 border border-rose-200/60 mt-2 leading-relaxed">
                      <strong className="text-emerald-800 block mb-0.5">Trattamento:</strong>
                      {pest.remedy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Complete Care Guide */}
      {activeTab === "care" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* 1. Luce */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                1. Luce & Esposizione
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Fabbisogno:</strong> {careGuide.light.requirement}
                </p>
                <p>
                  <strong>Ore consigliate:</strong> {careGuide.light.hoursPerDay}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  {careGuide.light.tips}
                </div>
              </div>
            </div>

            {/* 2. Annaffiatura */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                2. Annaffiatura & Frequenza
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Estate:</strong> ogni {careGuide.watering.summerFrequencyDays} giorni
                </p>
                <p>
                  <strong>Inverno:</strong> ogni {careGuide.watering.winterFrequencyDays} giorni
                </p>
                <p>
                  <strong>Quantità:</strong> {careGuide.watering.waterAmount}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  {careGuide.watering.technique}
                </div>
              </div>
            </div>

            {/* 3. Temperatura & Umidità */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                3. Temperatura & Umidità
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Intervallo ideale:</strong>{" "}
                  {careGuide.temperatureAndHumidity.idealRange}
                </p>
                <p>
                  <strong>Minima di sicurezza:</strong>{" "}
                  {careGuide.temperatureAndHumidity.minTolerance}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  {careGuide.temperatureAndHumidity.humidityRequirement}
                </div>
              </div>
            </div>

            {/* 4. Terriccio & Rinvaso */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                4. Terreno & Rinvaso
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Substrato:</strong> {careGuide.soilAndRepotting.soilMix}
                </p>
                <p>
                  <strong>pH ottimale:</strong> {careGuide.soilAndRepotting.phRange}
                </p>
                <p>
                  <strong>Frequenza rinvaso:</strong>{" "}
                  {careGuide.soilAndRepotting.repottingFrequency}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  <strong>Vaso consigliato:</strong> {careGuide.soilAndRepotting.potType}
                </div>
              </div>
            </div>

            {/* 5. Concimazione */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                5. Nutrizione & Concime
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Frequenza:</strong> {careGuide.fertilizer.frequency}
                </p>
                <p>
                  <strong>Tipo:</strong> {careGuide.fertilizer.type}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  <strong>Inverno:</strong> {careGuide.fertilizer.winterInstructions}
                </div>
              </div>
            </div>

            {/* 6. Potatura & Propagazione */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                6. Potatura & Talee
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs text-stone-700 leading-snug">
                <p>
                  <strong>Potatura:</strong> {careGuide.pruningAndPropagation.pruning}
                </p>
                <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl text-stone-600 border border-stone-200/60 leading-relaxed text-[11px] sm:text-xs">
                  <strong>Propagazione:</strong>{" "}
                  {careGuide.pruningAndPropagation.propagation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Custom Watering Schedule Planner */}
      {activeTab === "watering" && (
        <WateringCalculator
          plantData={plantData}
          onSaveToGarden={onSaveToGarden}
          onLogWateringNow={onLogWateringNow}
          isSavedInGarden={isSavedInGarden}
        />
      )}

      {/* Tab 5: Interactive Plant Doctor Chat */}
      {activeTab === "chat" && (
        <PlantDoctorChat plantData={plantData} />
      )}

      {/* Tab 6: Curiosities & Similar Species */}
      {activeTab === "curiosities" && (
        <div className="space-y-6">
          {/* Fun facts */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Curiosità Botaniche & Aneddoti</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {plantData.funFacts?.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5 sm:gap-3 leading-relaxed"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-emerald-800 shrink-0">
                    #{idx + 1}
                  </span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Similar species */}
          {plantData.similarSpecies && plantData.similarSpecies.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Come distinguerla da specie simili o sosia</span>
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                {plantData.similarSpecies.map((sim, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1 text-xs leading-relaxed"
                  >
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      {sim.name}
                    </span>
                    <p className="text-stone-600 text-[11px] sm:text-xs">
                      <strong>Differenza distintiva:</strong> {sim.distinction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
