import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, AlertCircle } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.warn("Fotocamera con facingMode fallita, riprovo con impostazioni standard:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (fallbackErr: any) {
        console.error("Accesso fotocamera negato:", fallbackErr);
        setCameraError(
          "Impossibile accedere alla fotocamera. Assicurati di aver concesso i permessi nel browser o carica una foto dalla memoria."
        );
        setIsInitializing(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-900/90 text-white border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Scatta Foto alla Pianta</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm text-stone-300">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-medium mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                Riprova
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Frame */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="text-center">
                  <span className="bg-black/60 text-white/90 text-[11px] px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                    Centra la foglia o il fiore
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-stone-900/80 flex items-center justify-center text-white text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
                  Avvio fotocamera...
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-stone-900 flex items-center justify-around border-t border-stone-800">
          <button
            type="button"
            onClick={toggleFacingMode}
            title="Cambia fotocamera frontale/posteriore"
            className="p-3 text-stone-300 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={capturePhoto}
            disabled={!!cameraError || isInitializing}
            className="w-16 h-16 rounded-full bg-white hover:bg-emerald-50 active:scale-95 transition-all p-1 flex items-center justify-center border-4 border-emerald-500 shadow-lg cursor-pointer disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors" />
          </button>

          <div className="w-12 text-center text-[10px] text-stone-400">
            Foto HD
          </div>
        </div>
      </div>
    </div>
  );
};
