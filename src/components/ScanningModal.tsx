import React, { useState, useEffect } from "react";
import { Sparkles, Leaf, Check, Loader2 } from "lucide-react";

interface ScanningModalProps {
  isOpen: boolean;
  imagePreview: string | null;
}

export const ScanningModal: React.FC<ScanningModalProps> = ({ isOpen, imagePreview }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Scansione morfologica della lamina fogliare...",
    "Confronto tassonomico con oltre 400.000 specie botaniche...",
    "Diagnosi clinica di parassiti e stress idrico...",
    "Elaborazione del piano di irrigazione su misura...",
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white text-center shadow-2xl space-y-6">
        {/* Photo Container with animated laser scan */}
        <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-stone-950 border-2 border-emerald-500/40 shadow-inner">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Scansione in corso"
              className="w-full h-full object-cover filter brightness-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-400">
              <Leaf className="w-16 h-16 animate-pulse" />
            </div>
          )}

          {/* Laser Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line" />

          {/* Viewfinder corner lines */}
          <div className="absolute inset-4 border border-emerald-400/30 rounded-xl pointer-events-none" />
        </div>

        {/* Text and Steps */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>AI Botanica in elaborazione</span>
          </div>

          <h3 className="font-serif text-xl font-bold">
            Identificazione in corso...
          </h3>

          <p className="text-sm text-stone-300 h-10 flex items-center justify-center font-medium">
            {steps[stepIndex]}
          </p>
        </div>

        {/* Progress Step Indicator dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === stepIndex
                  ? "w-8 bg-emerald-400"
                  : i < stepIndex
                  ? "w-3 bg-emerald-600"
                  : "w-3 bg-stone-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
