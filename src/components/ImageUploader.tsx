import React, { useState, useRef } from "react";
import { Upload, Camera, Sparkles, Image as ImageIcon, CheckCircle, ShieldCheck } from "lucide-react";
import { SAMPLE_PLANTS, SamplePlantItem } from "../data/samplePlants";

interface ImageUploaderProps {
  onAnalyze: (base64Image: string, notes?: string) => void;
  onSelectSample: (sample: SamplePlantItem) => void;
  onOpenCamera: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  onSelectSample,
  onOpenCamera,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Carica un file immagine valido (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = () => {
    if (selectedImage) {
      onAnalyze(selectedImage, userNotes);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Editorial Hero Intro */}
      <div className="text-center space-y-3 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Riconoscimento Botanico & Diagnosi Sanitaria AI</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          Cura le tue piante con la precisione di un esperto botanico
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
          Carica o scatta una foto per identificare all'istante la specie, diagnosticare problemi fogliari e ricevere un{" "}
          <strong className="text-emerald-800 font-semibold">programma di irrigazione su misura</strong>.
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-200/40 p-6 sm:p-8">
        {!selectedImage ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                dragActive
                  ? "border-emerald-600 bg-emerald-50/50 scale-[1.01]"
                  : "border-stone-300 hover:border-emerald-500 bg-stone-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100/80 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                Trascina qui la foto della pianta
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                Supporta primi piani di foglie, fiori, steli o la pianta intera nel suo vaso.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Sfoglia Immagini</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenCamera}
                  className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>Usa Fotocamera</span>
                </button>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-stone-500 pt-4 sm:pt-6 border-t border-stone-200/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>Oltre 400.000 specie</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>Diagnosi malattie & parassiti</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>Irrigazione su misura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>Dati botanici verificati</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Selected Image */
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-1/2 aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md">
                <img
                  src={selectedImage}
                  alt="Anteprima pianta selezionata"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                >
                  Cambia foto
                </button>
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Note opzionali o sintomi osservati
                  </label>
                  <p className="text-xs text-stone-500 mb-2">
                    Esempio: "Foglie ingiallite in basso", "Comprata una settimana fa", "Innaffiata 2 giorni fa".
                  </p>
                  <textarea
                    rows={3}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Aggiungi dettagli per una diagnosi ancora più precisa..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleStartAnalysis}
                    disabled={isLoading}
                    className="flex-1 py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Identifica e Analizza Ora</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    disabled={isLoading}
                    className="py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preset Quick Showcase / Try It Now */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Non hai una foto a portata di mano?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Clicca su una di queste piante per esplorarne all'istante l'analisi completa in stile PictureThis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {SAMPLE_PLANTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-600 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={sample.thumbnail}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-stone-900/70 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {sample.difficulty}
                </div>
              </div>
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {sample.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 italic truncate">
                    {sample.scientificName}
                  </p>
                </div>
                <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-700 font-medium">
                  <span>Vedi scheda</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
