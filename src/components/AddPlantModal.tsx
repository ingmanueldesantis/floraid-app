import React, { useState, useRef } from "react";
import {
  X,
  Plus,
  Sprout,
  Camera,
  Upload,
  BookOpen,
  Droplets,
  Sun,
  MapPin,
  Calendar,
  Check,
  Sparkles,
  Info,
  Sliders,
} from "lucide-react";
import { SavedPlant, PlantAnalysisResult } from "../types";
import { SAMPLE_PLANTS, SamplePlantItem } from "../data/samplePlants";

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: SavedPlant) => void;
  onStartPhotoScan: () => void;
  onStartCameraScan: () => void;
  existingPlants: SavedPlant[];
}

// Preset visual avatars if user doesn't upload a custom photo
const PLANT_AVATARS = [
  { id: "monstera", label: "Foglia Tropicale", icon: "🌿", color: "from-emerald-700 to-teal-800" },
  { id: "succulent", label: "Pianta Grassa", icon: "🪴", color: "from-teal-700 to-emerald-900" },
  { id: "flower", label: "Pianta da Fiore", icon: "🌸", color: "from-rose-600 to-pink-800" },
  { id: "cactus", label: "Cactus", icon: "🌵", color: "from-amber-700 to-lime-800" },
  { id: "bonsai", label: "Bonsai / Alberello", icon: "🌳", color: "from-stone-700 to-emerald-900" },
  { id: "herb", label: "Erba Aromatica", icon: "🌱", color: "from-green-600 to-emerald-800" },
];

// Additional popular catalog plants ready for 1-click addition
const EXTRA_CATALOG_PLANTS: {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  difficulty: "Facile" | "Media" | "Difficile";
  imageUrl: string;
  waterDays: number;
  waterMl: number;
  lightReq: string;
  defaultData: Partial<PlantAnalysisResult>;
}[] = [
  {
    id: "aloe_vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis Miller",
    category: "Succulente Medicinali",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80",
    waterDays: 14,
    waterMl: 250,
    lightReq: "Molta luce indiretta o sole diretto del mattino",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Aloe Vera",
        scientificName: "Aloe barbadensis Miller",
        family: "Asphodelaceae",
        genus: "Aloe",
        confidence: 99,
        shortDescription: "Pianta succulenta rinomata per le sue foglie carnose ricche di gel lenitivo e idratante.",
        fullDescription: "Originaria della penisola arabica, l'Aloe vera è coltivata in tutto il mondo sia per scopi ornamentali che cosmetici e medicinali. Ama substrati molto drenanti e teme i ristagni.",
        symbolism: "Simbolo di guarigione, protezione spirituale, immortalità e resilienza.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: true,
          petDetails: "Tossica per cani e gatti a causa delle saponine e antrachinoni presenti nel lattice giallo.",
          isToxicToHumans: false,
          humanDetails: "Il gel interno è sicuro e commestibile; evitare il lattice amaro esterno sotto la buccia in gravidanza.",
        },
      },
      healthDiagnosis: {
        status: "Sana",
        healthScore: 95,
        summary: "Foglie turgide e piene di gel. Nessun segno di marciume.",
        issuesDetected: [],
        preventiveTips: ["Non bagnare mai il cuore centrale", "Usa vasi con ottimo drenaggio"],
      },
      careGuide: {
        light: { requirement: "Luce brillante", hoursPerDay: "6+ ore", tips: "Ottima su davanzali luminosi" },
        watering: {
          summary: "Lascia asciugare completamente il terriccio tra le annaffiature.",
          summerFrequencyDays: 14,
          winterFrequencyDays: 30,
          waterAmount: "250 ml",
          technique: "Bagna a fondo e lascia scolare tutto il sottovaso",
          soilMoistureCheck: "Verifica che il terreno sia asciutto al 100%",
        },
        soilAndRepotting: {
          soilMix: "70% terriccio per cactacee, 30% perlite",
          phRange: "7.0 - 8.0",
          repottingFrequency: "Ogni 2-3 anni",
          potType: "Terracotta con foro",
        },
        temperatureAndHumidity: {
          idealRange: "18°C - 28°C",
          minTolerance: "10°C",
          humidityRequirement: "Bassa/Normale (30-50%)",
        },
        fertilizer: { frequency: "Una volta ogni 2 mesi in primavera", type: "Concime per succulente", winterInstructions: "Sospendere" },
        pruningAndPropagation: { pruning: "Rimuovi foglie basali secche", propagation: "Separazione dei polloni basali" },
      },
      customWateringSchedule: {
        recommendedBaseDays: 14,
        recommendedAmountMl: 250,
        seasonalAdvice: {
          spring: "Annaffia ogni 14 giorni",
          summer: "Ogni 10-12 giorni se fa molto caldo",
          autumn: "Riduci a ogni 20 giorni",
          winter: "Una volta al mese",
        },
        waterQualityTips: "Tollera acqua normale a temperatura ambiente",
        moistureIndicatorGuide: "Se le foglie sono concave o sottili, ha sete; se sono molli o marroni, troppo umida.",
      },
      funFacts: [
        "Gli antichi Egizi la chiamavano 'la pianta dell'immortalità' e Cleopatra la usava per la cura della pelle.",
      ],
      similarSpecies: [{ name: "Aloe arborescens", distinction: "Foglie più strette e fusto legnoso ramificato" }],
    },
  },
  {
    id: "calathea_orbifolia",
    name: "Calathea Orbifolia",
    scientificName: "Goeppertia orbifolia",
    category: "Foglie Tropicali & Preghiera",
    difficulty: "Media",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
    waterDays: 6,
    waterMl: 300,
    lightReq: "Luce media indiretta filtrata (mai sole diretto)",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Calathea Orbifolia (Pianta della Preghiera)",
        scientificName: "Goeppertia orbifolia",
        family: "Marantaceae",
        genus: "Goeppertia",
        confidence: 98,
        shortDescription: "Spettacolare pianta tropicale con grandi foglie rotonde a strisce verde chiaro e argento.",
        fullDescription: "Originaria delle foreste pluviali della Bolivia, è amata per il movimento nictinastico delle sue foglie che si sollevano di notte come mani giunte in preghiera.",
        symbolism: "Nuovo inizio, gratitudine, devozione e armonia familiare.",
        difficultyLevel: "Media",
        toxicity: {
          isToxicToPets: false,
          petDetails: "Completamente sicura e atossica per cani e gatti (pet-friendly al 100%).",
          isToxicToHumans: false,
          humanDetails: "Non tossica.",
        },
      },
      healthDiagnosis: {
        status: "Sana",
        healthScore: 92,
        summary: "Ampie lamine fogliari sane con striature definite.",
        issuesDetected: [],
        preventiveTips: ["Usa acqua demineralizzata o piovana", "Mantieni elevata umidità ambientale"],
      },
      careGuide: {
        light: { requirement: "Luce diffusa indiretta", hoursPerDay: "4-6 ore", tips: "Il sole diretto brucia i bordi argentati" },
        watering: {
          summary: "Mantieni il substrato costantemente leggermente umido ma mai fradicio.",
          summerFrequencyDays: 5,
          winterFrequencyDays: 8,
          waterAmount: "300 ml",
          technique: "Annaffia dal basso o a filo terra",
          soilMoistureCheck: "Annaffia quando i primi 2 cm di terra sono quasi asciutti",
        },
        soilAndRepotting: {
          soilMix: "Terriccio per piante verdi, perlite e torba",
          phRange: "6.0 - 6.5",
          repottingFrequency: "Ogni 2 anni a inizio primavera",
          potType: "Vaso in plastica o ceramica smaltata",
        },
        temperatureAndHumidity: {
          idealRange: "19°C - 26°C",
          minTolerance: "15°C",
          humidityRequirement: "Alta (60-80%)",
        },
        fertilizer: { frequency: "Ogni mese in primavera ed estate", type: "Concime liquido bilanciato a 1/2 dose", winterInstructions: "Sospendere" },
        pruningAndPropagation: { pruning: "Taglia le foglie basali ingiallite", propagation: "Divisione dei cespi radicali" },
      },
      customWateringSchedule: {
        recommendedBaseDays: 6,
        recommendedAmountMl: 300,
        seasonalAdvice: {
          spring: "Annaffia ogni 6-7 giorni",
          summer: "Ogni 4-5 giorni nebulizzando l'aria circostante",
          autumn: "Ogni 7 giorni",
          winter: "Ogni 8-10 giorni",
        },
        waterQualityTips: "Sensibile al calcare e al cloro: prediligi acqua distillata, filtrata o piovana.",
        moistureIndicatorGuide: "Se le punte si accartocciano o imbruniscono, l'aria è troppo secca o l'acqua contiene sali.",
      },
      funFacts: [
        "Le sue foglie compiono una danza quotidiana grazie al 'pulvino' alla base del picciolo.",
      ],
      similarSpecies: [{ name: "Calathea medallion", distinction: "Disegni ovali concentrici con lato inferiore porpora" }],
    },
  },
  {
    id: "lavanda",
    name: "Lavanda Officinale",
    scientificName: "Lavandula angustifolia",
    category: "Aromatiche & Fiori Profumati",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80",
    waterDays: 8,
    waterMl: 350,
    lightReq: "Pieno sole diretto (almeno 6 ore al giorno)",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Lavanda Vera / Lavanda Officinale",
        scientificName: "Lavandula angustifolia",
        family: "Lamiaceae",
        genus: "Lavandula",
        confidence: 99,
        shortDescription: "Suffrutice sempreverde con infiorescenze a spiga violacee dal profumo inconfondibile e rilassante.",
        fullDescription: "Tipica della macchia mediterranea, ama il pieno sole, i terreni calcarei ben drenati e attira api e impollinatori preziosi.",
        symbolism: "Purezza, serenità, calma mentale, virtù e protezione.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: false,
          petDetails: "Non tossica in piccole dosi da sfioramento; evitare ingestione massiva di oli essenziali puri.",
          isToxicToHumans: false,
          humanDetails: "Sicura, usata in tisane, cosmetici e aromatizzazioni culinarie.",
        },
      },
      healthDiagnosis: {
        status: "Sana",
        healthScore: 96,
        summary: "Chioma compatta, profumata e fioritura vigorosa.",
        issuesDetected: [],
        preventiveTips: ["Assicura sole diretto e buona ventilazione", "Non eccedere con l'acqua"],
      },
      careGuide: {
        light: { requirement: "Pieno sole", hoursPerDay: "6-8 ore", tips: "Indispensabile per una fioritura intensa" },
        watering: {
          summary: "Annaffia solo quando il terriccio è ben asciutto.",
          summerFrequencyDays: 5,
          winterFrequencyDays: 15,
          waterAmount: "350 ml",
          technique: "Bagna alla base evitando di bagnare la chioma fiorita",
          soilMoistureCheck: "Asciutta fino a 4 cm di profondità",
        },
        soilAndRepotting: {
          soilMix: "Terriccio universale con sabbia e ghiaia",
          phRange: "6.5 - 8.0",
          repottingFrequency: "Ogni 2 anni",
          potType: "Vaso spazioso in coccio",
        },
        temperatureAndHumidity: {
          idealRange: "15°C - 30°C",
          minTolerance: "-10°C (molto rustica all'esterno)",
          humidityRequirement: "Bassa",
        },
        fertilizer: { frequency: "Una volta a inizio primavera", type: "Concime organico a lenta cessione", winterInstructions: "Nessuno" },
        pruningAndPropagation: { pruning: "Pota di 1/3 dopo la fioritura estiva", propagation: "Talee semilegnose in tarda estate" },
      },
      customWateringSchedule: {
        recommendedBaseDays: 8,
        recommendedAmountMl: 350,
        seasonalAdvice: {
          spring: "Ogni 7-8 giorni",
          summer: "Ogni 4-5 giorni se esposta a sole cocente",
          autumn: "Ogni 10-12 giorni",
          winter: "Raramente all'aperto (solo se non piove da settimane)",
        },
        waterQualityTips: "Tollera benissimo anche acque calcaree e dure.",
        moistureIndicatorGuide: "Se il fusto si annerisce alla base, c'è asfissia radicale; la lavanda ama la terra asciutta.",
      },
      funFacts: [
        "Il nome deriva dal latino 'lavare', perché i romani ne aggiungevano i fiori all'acqua dei bagni termali.",
      ],
      similarSpecies: [{ name: "Lavandula stoechas (Lavanda selvatica)", distinction: "Brattee superiori appariscenti simili ad ali di farfalla" }],
    },
  },
  {
    id: "basilico",
    name: "Basilico Genovese",
    scientificName: "Ocimum basilicum",
    category: "Erbe Aromatiche & Orto",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80",
    waterDays: 3,
    waterMl: 250,
    lightReq: "Sole mattutino o luce molto brillante (almeno 6 ore)",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Basilico Genovese DOP",
        scientificName: "Ocimum basilicum",
        family: "Lamiaceae",
        genus: "Ocimum",
        confidence: 99,
        shortDescription: "La regina delle erbe aromatiche mediterranee, celebre per il suo aroma dolce e le foglie a bolla.",
        fullDescription: "Pianta erbacea annuale originaria dell'Asia tropicale e coltivata con passione in Italia. Indispensabile in cucina e facilissima da coltivare sul balcone.",
        symbolism: "Amore, ospitalità, prosperità domestica e freschezza.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: false,
          petDetails: "Totalmente innocuo e sicuro per cani e gatti.",
          isToxicToHumans: false,
          humanDetails: "Ottimo alimento.",
        },
      },
      healthDiagnosis: {
        status: "Sana",
        healthScore: 94,
        summary: "Foglie profumate, turgide e verdi brillante.",
        issuesDetected: [],
        preventiveTips: ["Cima i germogli prima che vadano a fiore per prolungare la produzione di foglie"],
      },
      careGuide: {
        light: { requirement: "Luce abbondante", hoursPerDay: "6 ore", tips: "Nelle ore torride estive gradisce leggera ombreggiatura" },
        watering: {
          summary: "Bagna regolarmente al mattino presto.",
          summerFrequencyDays: 2,
          winterFrequencyDays: 5,
          waterAmount: "250 ml",
          technique: "Bagna il terreno senza bagnare le foglie",
          soilMoistureCheck: "Terreno leggermente umido in superficie",
        },
        soilAndRepotting: {
          soilMix: "Terriccio fertile arricchito con compost",
          phRange: "6.0 - 7.0",
          repottingFrequency: "Annuale",
          potType: "Vaso con fori",
        },
        temperatureAndHumidity: {
          idealRange: "20°C - 28°C",
          minTolerance: "12°C (teme il freddo)",
          humidityRequirement: "Moderata",
        },
        fertilizer: { frequency: "Ogni 2 settimane con concime per aromatiche", type: "Bio liquido", winterInstructions: "Ciclo annuale" },
        pruningAndPropagation: { pruning: "Cimatura regolare delle cime", propagation: "Talea in acqua radicata in 7 giorni" },
      },
      customWateringSchedule: {
        recommendedBaseDays: 3,
        recommendedAmountMl: 250,
        seasonalAdvice: {
          spring: "Ogni 3-4 giorni",
          summer: "Ogni 1-2 giorni al mattino presto",
          autumn: "Ogni 4 giorni riparando dal freddo",
          winter: "Coltivazione indoor con luce artificiale o al caldo",
        },
        waterQualityTips: "Acqua a temperatura ambiente, mai gelida.",
        moistureIndicatorGuide: "Se le foglie si afflosciano ha sete immediata; si riprende in 20 minuti dopo l'annaffiatura.",
      },
      funFacts: [
        "In India il basilico sacro (Tulsi) è considerato una pianta sacra consacrata a Vishnu.",
      ],
      similarSpecies: [{ name: "Basilico greco", distinction: "Foglie piccolissime e portamento a cespuglio sferico" }],
    },
  },
];

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPlant,
  onStartPhotoScan,
  onStartCameraScan,
  existingPlants,
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "manual" | "camera">("catalog");

  // Manual Form States
  const [commonName, setCommonName] = useState("");
  const [nickname, setNickname] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [locationType, setLocationType] = useState<"indoor" | "balcony" | "garden" | "office">("indoor");
  const [potSize, setPotSize] = useState<"small" | "medium" | "large">("medium");
  const [potMaterial, setPotMaterial] = useState("terracotta");
  const [wateringDays, setWateringDays] = useState<number>(7);
  const [wateringAmountMl, setWateringAmountMl] = useState<number>(350);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("monstera");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle custom file upload for manual plant
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click addition from sample plants or extra catalog plants
  const handleAddFromCatalog = (item: SamplePlantItem | typeof EXTRA_CATALOG_PLANTS[0]) => {
    const isSample = "highlight" in item;
    const baseData = isSample ? (item as SamplePlantItem).defaultData : (item as any).defaultData;
    const days = isSample
      ? (item as SamplePlantItem).defaultData.customWateringSchedule?.recommendedBaseDays || 7
      : (item as any).waterDays || 7;
    const ml = isSample
      ? (item as SamplePlantItem).defaultData.customWateringSchedule?.recommendedAmountMl || 350
      : (item as any).waterMl || 300;

    const newSavedPlant: SavedPlant = {
      id: "plant_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      nickname: item.name,
      plantData: {
        ...baseData,
        analyzedImage: item.imageUrl,
        analyzedDate: new Date().toISOString(),
      },
      addedAt: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      customSchedule: {
        daysInterval: days,
        amountMl: ml,
        potSize: "medium",
        potMaterial: "terracotta",
        exposure: "bright_indirect",
        location: "indoor",
      },
      wateringHistory: [
        {
          date: new Date().toISOString(),
          notes: "Aggiunta a Le mie piante da catalogo",
        },
      ],
    };

    onAddPlant(newSavedPlant);
    onClose();
  };

  // Submit manual plant form
  const handleCreateManualPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonName.trim()) return;

    const selectedAvatarObj = PLANT_AVATARS.find((a) => a.id === selectedAvatar);

    // Create synthetic botanical plant object
    const syntheticPlantData: PlantAnalysisResult = {
      isPlant: true,
      identification: {
        commonName: commonName.trim(),
        scientificName: scientificName.trim() || commonName.trim(),
        family: "Collezione personale",
        genus: commonName.trim().split(" ")[0] || "Planta",
        confidence: 100,
        shortDescription: userNotes || `Esemplare di ${commonName.trim()} coltivato con cura nella tua collezione.`,
        fullDescription: `Pianta aggiunta manualmente a Le mie piante. Posizione: ${locationType}. Frequenza di irrigazione programmata: ogni ${wateringDays} giorni.`,
        symbolism: "Cura, passione botanica e vitalità.",
        difficultyLevel: wateringDays <= 4 ? "Media" : "Facile",
        toxicity: {
          isToxicToPets: false,
          petDetails: "Informazione da verificare in base alla specie specifica.",
          isToxicToHumans: false,
          humanDetails: "Non segnalata tossicità evidente.",
        },
      },
      healthDiagnosis: {
        status: "In Salute",
        healthScore: 95,
        summary: "Pianta appena censita nella tua collezione 'Le mie piante'.",
        issuesDetected: [],
        preventiveTips: [
          `Rispetta la frequenza di annaffiatura di ${wateringDays} giorni`,
          "Verifica sempre l'umidità del terriccio prima di bagnare",
        ],
      },
      careGuide: {
        light: {
          requirement: "Luce media o brillante a seconda della specie",
          hoursPerDay: "4 - 6 ore",
          tips: "Evita sole diretto cocente nelle ore centrali se la pianta è da interno.",
        },
        watering: {
          summary: `Annaffiare ogni circa ${wateringDays} giorni con ${wateringAmountMl} ml di acqua.`,
          summerFrequencyDays: Math.max(2, Math.round(wateringDays * 0.7)),
          winterFrequencyDays: Math.round(wateringDays * 1.5),
          waterAmount: `${wateringAmountMl} ml`,
          technique: "Versa attorno al perimetro del vaso finché la terra è idratata.",
          soilMoistureCheck: "Tocca il terriccio con le dita prima di versare nuova acqua.",
        },
        soilAndRepotting: {
          soilMix: "Terriccio universale di qualità con perlite drenante",
          phRange: "6.0 - 7.0",
          repottingFrequency: "Ogni 1-2 anni a inizio primavera",
          potType: `Vaso in ${potMaterial} con fori di scolo`,
        },
        temperatureAndHumidity: {
          idealRange: "18°C - 26°C",
          minTolerance: locationType === "garden" ? "-2°C" : "12°C",
          humidityRequirement: "Moderata (40-60%)",
        },
        fertilizer: {
          frequency: "Ogni 3-4 settimane durante la stagione vegetativa",
          type: "Concime liquido bilanciato per piante verdi",
          winterInstructions: "Sospendere o dimezzare le dosi in inverno",
        },
        pruningAndPropagation: {
          pruning: "Rimuovi foglie secche o danneggiate alla base",
          propagation: "Talea o divisione a primavera",
        },
      },
      customWateringSchedule: {
        recommendedBaseDays: wateringDays,
        recommendedAmountMl: wateringAmountMl,
        seasonalAdvice: {
          spring: `Riprendi annaffiature regolari ogni ${wateringDays} giorni`,
          summer: `In estate aumenta la frequenza a ogni ${Math.max(2, Math.round(wateringDays * 0.7))} giorni`,
          autumn: `In autunno dirada a ogni ${Math.round(wateringDays * 1.2)} giorni`,
          winter: `In inverno dirada a ogni ${Math.round(wateringDays * 1.5)} giorni`,
        },
        waterQualityTips: "Utilizza acqua a temperatura ambiente lasciata decantare.",
        moistureIndicatorGuide: "Verifica che il terreno non sia fradicio nel sottovaso.",
      },
      funFacts: [
        `Questa pianta fa parte della tua collezione botanica personale creata in FloraID.`,
      ],
      similarSpecies: [],
      analyzedImage: customPhotoUrl || undefined,
      analyzedDate: new Date().toISOString(),
    };

    const newSavedPlant: SavedPlant = {
      id: "plant_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      nickname: nickname.trim() || commonName.trim(),
      plantData: syntheticPlantData,
      addedAt: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      customSchedule: {
        daysInterval: wateringDays,
        amountMl: wateringAmountMl,
        potSize: potSize,
        potMaterial: potMaterial,
        exposure: "bright_indirect",
        location: locationType,
      },
      wateringHistory: [
        {
          date: new Date().toISOString(),
          notes: "Aggiunta manuale a Le mie piante",
        },
      ],
    };

    onAddPlant(newSavedPlant);
    onClose();
  };

  const allCatalogItems = [...SAMPLE_PLANTS, ...EXTRA_CATALOG_PLANTS];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 truncate">
                Aggiungi a Le mie piante
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                Dal catalogo botanico, manuale o con foto AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-stone-200 bg-white px-3 sm:px-6 pt-2 sm:pt-3 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-2.5 sm:pb-3 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "catalog"
                ? "border-emerald-700 text-emerald-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Catalogo Rapido</span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`pb-2.5 sm:pb-3 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "manual"
                ? "border-emerald-700 text-emerald-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Manuale</span>
          </button>

          <button
            onClick={() => setActiveTab("camera")}
            className={`pb-2.5 sm:pb-3 px-2 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "camera"
                ? "border-emerald-700 text-emerald-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
            <span>Foto / AI</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* TAB 1: CATALOG QUICK ADD */}
          {activeTab === "catalog" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Scegli tra le piante più amate: aggiunta istantanea con scheda botanica completa, programma di annaffiatura e diagnosi.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allCatalogItems.map((item) => {
                  const isAlreadyAdded = existingPlants.some(
                    (p) =>
                      p.plantData.identification.scientificName.toLowerCase() ===
                      item.scientificName.toLowerCase()
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3.5 bg-stone-50 hover:bg-stone-100/90 rounded-2xl border border-stone-200 transition-all text-left group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                              {item.difficulty}
                            </span>
                          </div>
                          <p className="font-serif italic text-[11px] text-stone-500 truncate">
                            {item.scientificName}
                          </p>
                          <p className="text-[11px] text-stone-600 mt-0.5 flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-sky-600 shrink-0" />
                            <span>Ogni {("waterDays" in item ? (item as any).waterDays : (item as any).defaultData.customWateringSchedule?.recommendedBaseDays || 7)} giorni</span>
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddFromCatalog(item)}
                          className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isAlreadyAdded
                              ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                              : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                          }`}
                        >
                          {isAlreadyAdded ? (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Aggiungi un'altra</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Aggiungi a Le mie piante</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL CREATION */}
          {activeTab === "manual" && (
            <form onSubmit={handleCreateManualPlant} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nome Comune della Pianta *
                  </label>
                  <input
                    type="text"
                    required
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    placeholder="es. Ficus Benjamin, Pothos, Rosa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Soprannome / Stanza (Opzionale)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="es. Quella in salotto, Regalo della nonna"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nome Scientifico (Opzionale)
                  </label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="es. Ficus benjamina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white italic font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Collocazione
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                  >
                    <option value="indoor">Interno casa (soggiorno, camera)</option>
                    <option value="balcony">Balcone / Terrazzo riparato</option>
                    <option value="garden">Giardino aperto / Piena terra</option>
                    <option value="office">Ufficio / Studio</option>
                  </select>
                </div>
              </div>

              {/* Watering Frequency & Amount */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Frequenza di Annaffiatura
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    Ogni {wateringDays} {wateringDays === 1 ? "giorno" : "giorni"}
                  </span>
                </div>

                {/* Quick frequency chips */}
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 5, 7, 10, 14, 21, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setWateringDays(days)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        wateringDays === days
                          ? "bg-sky-600 text-white shadow-xs"
                          : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
                      }`}
                    >
                      {days === 1 ? "Ogni giorno" : `Ogni ${days} gg`}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Quantità consigliata d'acqua
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="50"
                        max="3000"
                        step="50"
                        value={wateringAmountMl}
                        onChange={(e) => setWateringAmountMl(Number(e.target.value))}
                        className="w-28 px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-semibold"
                      />
                      <span className="text-xs text-stone-500">ml (millilitri)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Materiale del Vaso
                    </label>
                    <select
                      value={potMaterial}
                      onChange={(e) => setPotMaterial(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    >
                      <option value="terracotta">Terracotta (traspirante)</option>
                      <option value="plastic">Plastica con fori</option>
                      <option value="ceramic">Ceramica smaltata</option>
                      <option value="ground">Piena terra</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo or Visual Avatar */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Foto o Icona Botanica
                </label>

                <div className="flex items-center gap-4 flex-wrap">
                  {customPhotoUrl ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-600 shrink-0">
                      <img src={customPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCustomPhotoUrl(null)}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                        title="Rimuovi foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-2xl border-2 border-dashed border-stone-300 hover:border-emerald-600 flex flex-col items-center justify-center text-stone-500 hover:text-emerald-700 transition-colors cursor-pointer bg-stone-50"
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Carica Foto</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* Or choose avatar */}
                  {!customPhotoUrl && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {PLANT_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.id)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                            selectedAvatar === avatar.id
                              ? "ring-2 ring-emerald-600 scale-105 bg-emerald-100 shadow-xs"
                              : "bg-stone-100 hover:bg-stone-200"
                          }`}
                          title={avatar.label}
                        >
                          {avatar.icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Note Personali (Opzionale)
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="es. Annaffiare con acqua decantata, posizionata vicino alla finestra est..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-xs bg-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Salva in Le mie piante</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PHOTO / CAMERA AI */}
          {activeTab === "camera" && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Identifica con l'Intelligenza Artificiale
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Fotografa la pianta con la fotocamera o carica una foto dal tuo dispositivo. Il modello riconoscerà la specie, verificherà la salute e la aggiungerà con un clic a <strong>Le mie piante</strong> con la scheda completa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onStartCameraScan();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Apri Fotocamera Live</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onStartPhotoScan();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Carica Immagine da File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
