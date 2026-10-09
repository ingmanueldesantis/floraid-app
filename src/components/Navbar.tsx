import React from "react";
import { Leaf, Sprout, Droplets, BookOpen, Camera, Smartphone } from "lucide-react";

interface NavbarProps {
  activeTab: "identify" | "garden" | "explore";
  setActiveTab: (tab: "identify" | "garden" | "explore") => void;
  gardenCount: number;
  plantsDueForWateringCount: number;
  onNewScan: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  gardenCount,
  plantsDueForWateringCount,
  onNewScan,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab("identify")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:bg-emerald-800 transition-colors">
              <Leaf className="w-6 h-6 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  Flora<span className="text-emerald-700">ID</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] tracking-wider font-semibold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  AI Plant Doctor
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Identificazione e cura botanica
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("identify")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "identify"
                  ? "bg-emerald-50 text-emerald-900 font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Identifica</span>
            </button>

            <button
              onClick={() => setActiveTab("garden")}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "garden"
                  ? "bg-emerald-50 text-emerald-900 font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Le mie piante</span>
              {gardenCount > 0 && (
                <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-bold">
                  {gardenCount}
                </span>
              )}
              {plantsDueForWateringCount > 0 && (
                <span
                  title={`${plantsDueForWateringCount} piante da innaffiare`}
                  className="flex items-center gap-0.5 text-[11px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse"
                >
                  <Droplets className="w-3 h-3 inline" />
                  {plantsDueForWateringCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "explore"
                  ? "bg-emerald-50 text-emerald-900 font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">Enciclopedia & Esempi</span>
              <span className="md:hidden">Esempi</span>
            </button>
          </nav>

          {/* Quick CTA & APK Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title="Configurazione APK & Server"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 border border-stone-200/80 transition-all"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">APK & Server</span>
              </button>
            )}

            <button
              onClick={onNewScan}
              className="hidden lg:flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow"
            >
              <Camera className="w-4 h-4" />
              <span>Scatta / Carica Foto</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
