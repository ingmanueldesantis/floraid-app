import React, { useState, useEffect } from "react";
import {
  MapPin,
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Calendar,
  CloudRain,
  Sun,
  Search,
} from "lucide-react";
import { SavedPlant } from "../types";
import { getApiEndpoint } from "../services/apiConfig";

interface GardenClimateAdvisorProps {
  savedPlants: SavedPlant[];
}

interface ClimateAdviceResult {
  climateSummary: string;
  seasonalAdvice: string;
  irrigationImpact: string;
  activeAlerts: {
    type: "warning" | "info" | "success" | string;
    title: string;
    description: string;
  }[];
  plantSpecificActions: {
    plantName: string;
    recommendedAction: string;
  }[];
}

interface WeatherData {
  locationName: string;
  temperature: number;
  humidity: number;
  weatherDescription: string;
  windSpeed: number;
  isDay: boolean;
  season: string;
}

const POPULAR_CITIES = [
  { name: "Roma, Lazio", lat: 41.9028, lon: 12.4964 },
  { name: "Milano, Lombardia", lat: 45.4642, lon: 9.19 },
  { name: "Napoli, Campania", lat: 40.8518, lon: 14.2681 },
  { name: "Torino, Piemonte", lat: 45.0703, lon: 7.6869 },
  { name: "Firenze, Toscana", lat: 43.7696, lon: 11.2558 },
  { name: "Palermo, Sicilia", lat: 38.1157, lon: 13.3615 },
  { name: "Bologna, Emilia-Romagna", lat: 44.4949, lon: 11.3426 },
  { name: "Bari, Puglia", lat: 41.1171, lon: 16.8719 },
];

export const GardenClimateAdvisor: React.FC<GardenClimateAdvisorProps> = ({
  savedPlants,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<ClimateAdviceResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customCitySearch, setCustomCitySearch] = useState<string>("");
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);

  // Determine current astronomical season for Northern Hemisphere
  const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return "Primavera";
    if (month >= 6 && month <= 8) return "Estate";
    if (month >= 9 && month <= 11) return "Autunno";
    return "Inverno";
  };

  const decodeWmoWeather = (code: number): string => {
    if (code === 0) return "Cielo Sereno";
    if (code >= 1 && code <= 3) return "Parzialmente Nuvoloso";
    if (code === 45 || code === 48) return "Nebbia o Foschia";
    if (code >= 51 && code <= 57) return "Pioviggine leggera";
    if (code >= 61 && code <= 67) return "Pioggia";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Rovesci di Pioggia";
    if (code >= 95) return "Temporale";
    return "Variabile";
  };

  // Fetch weather and reverse geocoding from lat/lon
  const fetchWeatherAndAdvice = async (
    lat: number,
    lon: number,
    manualCityName?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Fetch real weather data from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Meteo non disponibile");
      const weatherJson = await weatherRes.json();
      const current = weatherJson.current;

      let locationLabel = manualCityName || "La tua posizione";

      // 2. Reverse geocode if manual name wasn't passed
      if (!manualCityName) {
        try {
          const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=it`;
          const revRes = await fetch(revUrl);
          if (revRes.ok) {
            const revJson = await revRes.json();
            const city = revJson.city || revJson.locality || revJson.principalSubdivision;
            const region = revJson.principalSubdivision;
            if (city) {
              locationLabel = region && region !== city ? `${city}, ${region}` : city;
            }
          }
        } catch (e) {
          console.warn("Reverse geocode fallback", e);
        }
      }

      const weatherObj: WeatherData = {
        locationName: locationLabel,
        temperature: Math.round(current.temperature_2m * 10) / 10,
        humidity: current.relative_humidity_2m,
        weatherDescription: decodeWmoWeather(current.weather_code),
        windSpeed: Math.round(current.wind_speed_10m),
        isDay: current.is_day === 1,
        season: getCurrentSeason(),
      };

      setWeather(weatherObj);

      // 3. Fetch tailored botanical care advice from server endpoint with fallback
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const adviceRes = await fetch(getApiEndpoint("/api/climate-care-advice"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationName: locationLabel,
            temperature: weatherObj.temperature,
            humidity: weatherObj.humidity,
            weatherDescription: weatherObj.weatherDescription,
            season: weatherObj.season,
            plants: savedPlants.map((p) => ({
              id: p.id,
              name: p.plantData.identification.commonName,
              scientificName: p.plantData.identification.scientificName,
              location: p.customSchedule?.location || "indoor",
            })),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (adviceRes.ok) {
          const adviceJson = await adviceRes.json();
          setAdvice(adviceJson);
        } else {
          throw new Error("Server advice non disponibile");
        }
      } catch (_adviceErr) {
        // Fallback local agronomical calculation based on temperature, season and plants
        const isWarm = weatherObj.temperature >= 22;
        const isCold = weatherObj.temperature <= 12;
        setAdvice({
          climateSummary: `Condizioni attuali a ${locationLabel}: ${weatherObj.temperature}°C, umidità relativa al ${weatherObj.humidity}%. Condizioni ${weatherObj.weatherDescription.toLowerCase()}.`,
          seasonalAdvice: isCold
            ? "Temperature fresche: dirada le irrigazioni per tutte le piante da appartamento ed evita il contatto con vetri freddi o correnti."
            : isWarm
            ? "Clima caldo: aumenta la ventilazione naturale e controlla l'umidità del terriccio ogni 2-3 giorni."
            : "Clima mite favorevole: mantieni una corretta rotazione dei vasi verso la luce ed effettua la consueta manutenzione.",
          irrigationImpact: isWarm
            ? "La traspirazione è sostenuta. Annaffia nelle prime ore del mattino o al calar del sole per ottimizzare l'assorbimento."
            : "Evaporalità ridotta. Attendi che il substrato si asciughi a fondo prima di ogni nuova bagnatura per evitare marciumi radicali.",
          activeAlerts: [
            {
              type: weatherObj.humidity < 40 ? "warning" : "info",
              title: weatherObj.humidity < 40 ? "Umidità Ambientale Bassa" : "Microclima Equilibrato",
              description: weatherObj.humidity < 40
                ? "L'aria secca può causare punte delle foglie secche. Consigliata una nebulizzazione con acqua demineralizzata."
                : "Livello di umidità ideale per la maggior parte delle specie ornamentali.",
            },
          ],
          plantSpecificActions: savedPlants.slice(0, 4).map((p) => ({
            plantName: p.plantData.identification.commonName,
            recommendedAction: `Verifica l'umidità nei primi 3 cm di substrato; mantieni in posizione luminosa e al riparo da correnti d'aria.`,
          })),
        });
      }
    } catch (err: any) {
      console.warn("Errore fetch meteo:", err);
      setErrorMessage(
        err.message ||
          "Impossibile recuperare i dati meteorologici in questo momento. Seleziona una città dall'elenco."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Request browser GPS Geolocation
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        "La geolocalizzazione non è supportata dal tuo browser. Seleziona una città manualmente."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherAndAdvice(latitude, longitude);
      },
      (err) => {
        console.warn("GPS rifiutato o non disponibile:", err);
        setErrorMessage(
          "Permesso di geolocalizzazione negato o GPS non attivo. Scegli una città dall'elenco sottostante per ricevere i consigli climatici."
        );
        setIsLoading(false);
        // Fallback default city (Roma)
        if (!weather) {
          fetchWeatherAndAdvice(41.9028, 12.4964, "Roma, Lazio");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search custom city via Open-Meteo Geocoding
  const handleSearchCustomCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCitySearch.trim()) return;

    setIsSearchingCity(true);
    setErrorMessage(null);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        customCitySearch.trim()
      )}&count=1&language=it`;
      const res = await fetch(geoUrl);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const first = data.results[0];
        const label = `${first.name}${first.admin1 ? `, ${first.admin1}` : ""}${
          first.country ? ` (${first.country})` : ""
        }`;
        setShowCityPicker(false);
        setCustomCitySearch("");
        fetchWeatherAndAdvice(first.latitude, first.longitude, label);
      } else {
        setErrorMessage("Nessuna località trovata con questo nome. Riprova con un'altra città.");
      }
    } catch (err) {
      setErrorMessage("Errore di connessione durante la ricerca della città.");
    } finally {
      setIsSearchingCity(false);
    }
  };

  // Initial auto-detection on mount
  useEffect(() => {
    handleDetectGPS();
  }, []);

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Location controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Clima Locale & Stagionalità Geografica</span>
          </div>
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
            <span>Assistente Meteo & Cura delle Mie Piante</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Adatta l'irrigazione e la protezione delle tue piante alle condizioni climatiche reali del tuo territorio.
          </p>
        </div>

        {/* Location selector actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDetectGPS}
            disabled={isLoading}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Rileva posizione esatta GPS"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Rileva GPS</span>
          </button>

          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Cambia Città</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {weather && (
            <button
              onClick={() => {
                if (weather) {
                  // Re-fetch
                  fetchWeatherAndAdvice(41.9028, 12.4964, weather.locationName);
                }
              }}
              disabled={isLoading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Aggiorna dati meteo"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* City search / quick select drawer */}
      {showCityPicker && (
        <div className="bg-stone-900/95 p-4 rounded-2xl border border-white/15 space-y-3 animate-in fade-in">
          <form onSubmit={handleSearchCustomCity} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customCitySearch}
                onChange={(e) => setCustomCitySearch(e.target.value)}
                placeholder="Cerca qualsiasi comune italiano o città..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingCity || !customCitySearch.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isSearchingCity ? "Ricerca..." : "Cerca"}
            </button>
          </form>

          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
              Oppure seleziona rapidamente una città:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setShowCityPicker(false);
                    fetchWeatherAndAdvice(city.lat, city.lon, city.name);
                  }}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-emerald-900/80 hover:text-emerald-300 text-stone-300 rounded-lg text-xs transition-colors border border-stone-700/60 cursor-pointer"
                >
                  {city.name.split(",")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state if location failed */}
      {errorMessage && (
        <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real-time Weather Strip */}
      {weather && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* Location & Conditions */}
          <div className="p-2.5 sm:p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CloudSun className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-semibold block truncate">
                {weather.locationName}
              </span>
              <span className="font-semibold text-xs sm:text-sm text-white block truncate">
                {weather.weatherDescription}
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-2.5 sm:p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Thermometer className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-semibold block truncate">
                Temperatura
              </span>
              <span className="font-serif text-base sm:text-lg font-bold text-white block">
                {weather.temperature}°C
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-2.5 sm:p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-semibold block truncate">
                Umidità Aria
              </span>
              <span className="font-serif text-base sm:text-lg font-bold text-white block">
                {weather.humidity}%
              </span>
            </div>
          </div>

          {/* Season & Wind */}
          <div className="p-2.5 sm:p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-semibold block truncate">
                Stagione
              </span>
              <span className="font-semibold text-xs sm:text-sm text-white block truncate">
                {weather.season} · {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Tailored Climate Advice Card */}
      {isLoading ? (
        <div className="py-6 sm:py-8 text-center space-y-2">
          <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-emerald-400 mx-auto" />
          <p className="text-xs text-stone-300">
            Analisi agronomica in corso per il clima locale e la stagione in corso...
          </p>
        </div>
      ) : advice ? (
        <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
          {/* Active Alerts */}
          {advice.activeAlerts && advice.activeAlerts.length > 0 && (
            <div className="space-y-2">
              {advice.activeAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 sm:p-3.5 rounded-2xl flex items-start gap-2.5 sm:gap-3 border text-xs leading-relaxed ${
                    alert.type === "warning"
                      ? "bg-amber-950/70 border-amber-500/40 text-amber-200"
                      : alert.type === "success"
                      ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                      : "bg-sky-950/70 border-sky-500/40 text-sky-200"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong className="block font-semibold text-xs sm:text-sm">
                      {alert.title}
                    </strong>
                    <p className="opacity-90 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Evapotranspiration & Seasonal Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
            {/* Seasonal care */}
            <div className="p-3.5 sm:p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1 sm:space-y-1.5">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Gestione Stagionale ({weather?.season}):</span>
              </span>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.seasonalAdvice}
              </p>
            </div>

            {/* Irrigation impact */}
            <div className="p-3.5 sm:p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1 sm:space-y-1.5">
              <span className="font-bold text-sky-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                <span>Impatto del Meteo sull'Irrigazione:</span>
              </span>
              <p className="text-stone-300 leading-relaxed text-xs">
                {advice.irrigationImpact}
              </p>
            </div>
          </div>

          {/* Plant-specific actions today */}
          {advice.plantSpecificActions && advice.plantSpecificActions.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20 space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Cosa fare oggi per le tue piante:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs">
                {advice.plantSpecificActions.map((action, i) => (
                  <div
                    key={i}
                    className="p-2.5 sm:p-3 bg-stone-900/80 rounded-xl border border-white/10 space-y-1"
                  >
                    <span className="font-bold text-white block text-xs truncate">
                      🌱 {action.plantName}
                    </span>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
                      {action.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
