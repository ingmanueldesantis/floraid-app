import React, { useState } from "react";
import { X, Server, Smartphone, Check, RefreshCw, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { getServerUrl, setServerUrl, DEFAULT_PRODUCTION_SERVER, isNativePlatform } from "../services/apiConfig";

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose }) => {
  const currentSaved = typeof window !== "undefined" ? localStorage.getItem("floraid_custom_api_url") || "" : "";
  const [apiUrl, setApiUrl] = useState<string>(currentSaved || (isNativePlatform() ? DEFAULT_PRODUCTION_SERVER : ""));
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setStatus("testing");
    setStatusMessage("Verifica connessione all'endpoint...");

    const target = (apiUrl.trim() || (isNativePlatform() ? DEFAULT_PRODUCTION_SERVER : "")).replace(/\/+$/, "");
    const testUrl = target ? `${target}/api/identify-plant` : `/api/identify-plant`;

    try {
      // Test options or small post to verify server reachability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(testUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // A 400 response means the server is reachable and active (it rejected empty body as expected)
      if (res.status === 400 || res.ok) {
        setStatus("success");
        setStatusMessage("Server connesso e reattivo con successo!");
      } else {
        setStatus("error");
        setStatusMessage(`Risposta server con codice HTTP ${res.status}`);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setStatus("error");
        setStatusMessage("Timeout connessione: il server non risponde entro 6 secondi.");
      } else {
        setStatus("error");
        setStatusMessage("Impossibile raggiungere il server. Verifica l'URL o la connessione.");
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
    setApiUrl(DEFAULT_PRODUCTION_SERVER);
    setServerUrl(DEFAULT_PRODUCTION_SERVER);
    setStatus("success");
    setStatusMessage("Ripristinato server cloud predefinito.");
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
              <h3 className="font-bold text-stone-900 text-base">Impostazioni APK & Connessione</h3>
              <p className="text-xs text-stone-500">FloraID Mobile v1.0.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
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
                Il progetto è configurato per generare automaticamente il file APK tramite GitHub Actions ad ogni esportazione su GitHub.
              </p>
            </div>
          </div>

          {/* Backend Server URL field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-stone-500" />
                URL Server Backend / API AI
              </label>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Ripristina predefinito
              </button>
            </div>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://ais-pre-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono text-stone-800 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-stone-500">
              Nell'APK Android, le richieste di identificazione e chat botanica puntano a questo server. Lascia vuoto per utilizzare l'origine locale se sei in modalità browser.
            </p>
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

          {/* Guide Summary */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs text-stone-600">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <span>🚀 Come scaricare l'APK da GitHub</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>Esporta o fai il push di questo progetto nella tua repository GitHub.</li>
              <li>La GitHub Action <strong>Build Android APK</strong> parte in automatico.</li>
              <li>Vai nella scheda <strong>Actions</strong> di GitHub, apri l'ultima esecuzione.</li>
              <li>Nella sezione <strong>Artifacts</strong>, scarica <strong>FloraID-Android-Debug-APK</strong>.</li>
              <li>Installa il file <code className="bg-stone-200 px-1 rounded">FloraID-Debug.apk</code> sul tuo telefono Android.</li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={status === "testing"}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === "testing" ? "animate-spin" : ""}`} />
            Testa Server
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl transition-colors"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
            >
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
