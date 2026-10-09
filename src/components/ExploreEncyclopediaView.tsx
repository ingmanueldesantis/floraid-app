import React, { useState } from "react";
import { Search, BookOpen, Sparkles, Filter, Leaf, ArrowRight } from "lucide-react";
import { SAMPLE_PLANTS, SamplePlantItem } from "../data/samplePlants";
import { PlantAnalysisResult } from "../types";

interface ExploreEncyclopediaViewProps {
  onSelectSample: (sample: SamplePlantItem) => void;
  onNewScan: () => void;
}

export const ExploreEncyclopediaView: React.FC<ExploreEncyclopediaViewProps> = ({
  onSelectSample,
  onNewScan,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tutte");

  const categories = [
    "Tutte",
    "Piante d'appartamento",
    "Succulente & Purificatrici",
    "Piante ricadenti & rampicanti",
  ];

  const filteredPlants = SAMPLE_PLANTS.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.highlight.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Tutte" || plant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Enciclopedia Botanica & Esempi Interattivi</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
          Esplora la Cura Botanica delle Piante più Famose
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
          Consulta le schede dettagliate elaborate con la tecnologia PictureThis, oppure carica la tua foto per qualsiasi altra pianta del pianeta.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome comune o scientifico..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white shadow-xs font-semibold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onSelectSample(plant)}
            className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-stone-900/80 text-white text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-xs">
                  {plant.difficulty}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block truncate">
                    {plant.category}
                  </span>
                  {plant.defaultData.benefitsAndUses?.airPurificationNasa && (
                    <span className="text-[9px] bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded font-semibold border border-sky-200 shrink-0">
                      NASA Clean Air
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {plant.name}
                </h3>
                <p className="font-serif italic text-xs text-stone-500 truncate">
                  {plant.scientificName}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2 pt-0.5 sm:pt-1 leading-relaxed">
                  {plant.highlight}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <div className="pt-2.5 sm:pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Apri guida completa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Hai una pianta diversa?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Identifica qualsiasi specie in 3 secondi
          </h2>
          <p className="text-stone-300 text-sm">
            Fotografa qualsiasi pianta in casa, in giardino o durante una passeggiata nella natura. Il nostro motore AI analizzerà istantaneamente la morfologia fogliare.
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          Scatta o Carica una Foto
        </button>
      </div>
    </div>
  );
};
