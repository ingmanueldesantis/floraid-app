import React, { useState } from "react";
import { X, Server, Smartphone, Check, RefreshCw, AlertCircle, ShieldCheck, Download, FolderArchive, GitBranch } from "lucide-react";
import { getSavedServerUrl, setServerUrl, isNativePlatform, getApiEndpoint } from "../services/apiConfig";

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose }) => {
  const currentSaved = getSavedServerUrl();
  const [apiUrl, setApiUrl] = useState<string>(currentSaved);
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setStatus("testing");
    setStatusMessage("Verifica connessione all'endpoint...");

    const target = apiUrl.trim().replace(/\/+$/, "");
    const testUrl = target ? `${target}/api/health` : "/api/health";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(testUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const info = await res.json().catch(() => ({}));
        setStatus("success");
        setStatusMessage(
          `Server connesso con successo! (FloraID v${info.version || "1.0"}, Gemini Vision AI attivo)`
        );
      } else {
        setStatus("error");
        setStatusMessage(`Risposta server con codice HTTP ${res.status}`);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setStatus("error");
        setStatusMessage("Timeout connessione: il server non risponde entro 10 secondi.");
      } else {
        setStatus("error");
        setStatusMessage(
          "Impossibile raggiungere il server (" + (err.message || "Failed to fetch") + "). Verifica la connessione o l'URL."
        );
      }
    }
  };

  const handleSave = () => {
    setServerUrl(apiUrl);
    setStatus("success");
    setStatusMessage("Configurazione salvata con successo!");
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleResetDefault = () => {
    setApiUrl("");
    setServerUrl("");
    setStatus("success");
    setStatusMessage("Ripristinato server predefinito (connessione locale diretta).");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Impostazioni Connessione & Server</h3>
              <p className="text-xs text-stone-500">FloraID Mobile v1.0.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Platform banner */}
          <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-semibold">
                {isNativePlatform() ? "Applicazione Android Nativa Attiva" : "Modalità Web & GitHub Ready"}
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Il backend elabora le foto botaniche tramite Google Gemini Vision AI per garantire il riconoscimento immediato di specie e malattie.
              </p>
            </div>
          </div>

          {/* Backend Server URL field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-stone-500" />
                URL Server Backend / API AI Gemini
              </label>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Ripristina Predefinito
              </button>
            </div>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Lascia vuoto per il server predefinito oppure inserisci l'URL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono text-stone-800 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
            <div className="text-[11px] text-stone-500 space-y-1">
              <p>
                <strong>Predefinito:</strong> L'applicazione si connette direttamente al server integrato di FloraID per riconoscere oltre 400.000 specie e diagnosticare la salute delle piante.
              </p>
              <p>
                <strong>Server personalizzato:</strong> Se installi l'APK su smartphone e hai ospitato il backend su un tuo dominio pubblico (Cloud Run, Render, Railway o ngrok), inserisci qui l'indirizzo.
              </p>
            </div>
          </div>

          {/* Status feedback */}
          {status !== "idle" && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                status === "testing"
                  ? "bg-stone-100 text-stone-700"
                  : status === "success"
                  ? "bg-emerald-100 text-emerald-900 font-medium"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status === "testing" && <RefreshCw className="w-4 h-4 animate-spin text-stone-600 shrink-0" />}
              {status === "success" && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
              {status === "error" && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Direct Download ZIP for GitHub */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-emerald-800" />
                <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                  Esportazione Rapida: Scarica Archivio ZIP
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Pronto
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Scarica il pacchetto completo con codice sorgente, icona FloraID, cartella nativa <code>android/</code> e workflow GitHub Actions per la compilazione automatica dell'APK.
            </p>
            <a
              href={getApiEndpoint("/api/download-zip")}
              download="floraid-project.zip"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Scarica floraid-project.zip (per GitHub)
            </a>
          </div>

          {/* Guide Summary */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2.5 text-xs text-stone-600">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-emerald-700" />
              <span>Come caricare su GitHub & Generare l'APK</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] leading-relaxed">
              <li>
                <strong>Crea un nuovo repository</strong> su GitHub (<a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">github.com/new</a>) chiamandolo ad es. <code className="bg-stone-200 px-1 rounded">floraid-app</code>.
              </li>
              <li>
                <strong>Carica i file</strong>: estrai lo ZIP e carica i file con l'opzione <em>"uploading an existing file"</em> su GitHub, oppure tramite Git push da terminale.
              </li>
              <li>
                <strong>Generazione automatica APK</strong>: GitHub avvierà subito l'Action <strong>Build Android APK</strong>.
              </li>
              <li>
                <strong>Download APK</strong>: nella scheda <strong>Actions</strong> di GitHub, apri l'ultima esecuzione e scarica l'artifact <strong>FloraID-Android-Debug-APK</strong>!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={status === "testing"}
            className="px-4 py-2 border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === "testing" ? "animate-spin" : ""}`} />
            <span>Test Connessione</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
