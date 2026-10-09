export interface PlantIdentification {
  commonName: string;
  scientificName: string;
  family: string;
  genus: string;
  confidence: number;
  shortDescription: string;
  fullDescription: string;
  symbolism: string;
  difficultyLevel: "Facile" | "Media" | "Difficile" | string;
  toxicity: {
    isToxicToPets: boolean;
    petDetails: string;
    isToxicToHumans: boolean;
    humanDetails: string;
  };
}

export interface ScientificClassification {
  kingdom: string; // es. Plantae
  phylum: string; // es. Tracheophyta (Piante vascolari)
  class: string; // es. Liliopsida (Monocotiledoni)
  order: string; // es. Asparagales
  family: string; // es. Asparagaceae
  subfamily?: string; // es. Nolinoideae
  genus: string; // es. Dracaena (ex Sansevieria)
  species: string; // es. Dracaena trifasciata (L.) Mabb.
  botanicalSynonyms: string[]; // es. ["Sansevieria trifasciata Prain", "Sansevieria zeylanica"]
}

export interface BotanicalCharacteristics {
  plantType: string; // es. Pianta perenne sempreverde succulenta
  lifespan: string; // es. Perenne (pluridecennale)
  matureHeight: string; // es. 60 cm - 120 cm in vaso (fino a 2 m in natura)
  matureSpread: string; // es. 30 cm - 60 cm
  leafColor: string; // es. Verde scuro variegato con bande trasversali grigio-argentee e margini dorati
  leafShape: string; // es. A spada eretta (lanceolata), carnosa, rigida e coriacea
  leafSize: string; // es. Lunghezza 70-90 cm, larghezza 5-8 cm
  flowerColor: string; // es. Bianco-verdastro o crema chiaro
  bloomTime: string; // es. Primavera - Estate (fioritura rara in appartamento)
  flowerFragrance: string; // es. Delicatamente profumati (soprattutto nelle ore serali)
  fruit?: string; // es. Piccole bacche sferiche arancioni
}

export interface SymbolismAndCulture {
  meaning: string; // Significato nel linguaggio delle piante
  fengShui: string; // Posizionamento secondo i principi del Feng Shui
  popularNamesOrigins: {
    name: string;
    originExplanation: string;
  }[];
}

export interface BenefitsAndUses {
  airPurificationNasa: string; // Purificazione aria NASA (benzene, formaldeide, xilene)
  bedroomNightOxygen: string; // Metabolismo CAM e rilascio notturno di O2
  practicalUses: string; // Corde per archi, fibre tessili, design d'interni
}

export interface UsdaHardiness {
  zones: string; // es. Zone USDA 10 - 12
  minOutdoorTemp: string; // es. 10°C (teme le gelate)
}

export interface CultivarItem {
  name: string;
  description: string;
}

export interface CommonPestItem {
  name: string;
  symptoms: string;
  remedy: string;
}

export interface HealthIssue {
  title: string;
  symptom: string;
  cause: string;
  solution: string;
  severity: "Bassa" | "Media" | "Alta" | string;
}

export interface HealthDiagnosis {
  status: string;
  healthScore: number;
  summary: string;
  issuesDetected: HealthIssue[];
  preventiveTips: string[];
}

export interface CareGuide {
  light: {
    requirement: string;
    hoursPerDay: string;
    tips: string;
  };
  watering: {
    summary: string;
    summerFrequencyDays: number;
    winterFrequencyDays: number;
    waterAmount: string;
    technique: string;
    soilMoistureCheck: string;
  };
  soilAndRepotting: {
    soilMix: string;
    phRange: string;
    repottingFrequency: string;
    potType: string;
  };
  temperatureAndHumidity: {
    idealRange: string;
    minTolerance: string;
    humidityRequirement: string;
  };
  fertilizer: {
    frequency: string;
    type: string;
    winterInstructions: string;
  };
  pruningAndPropagation: {
    pruning: string;
    propagation: string;
  };
}

export interface CustomWateringSchedule {
  recommendedBaseDays: number;
  recommendedAmountMl: number;
  seasonalAdvice: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  waterQualityTips: string;
  moistureIndicatorGuide: string;
}

export interface SimilarSpecies {
  name: string;
  distinction: string;
}

export interface PlantAnalysisResult {
  isPlant: boolean;
  identification: PlantIdentification;
  healthDiagnosis: HealthDiagnosis;
  careGuide: CareGuide;
  customWateringSchedule: CustomWateringSchedule;
  funFacts: string[];
  similarSpecies: SimilarSpecies[];
  analyzedImage?: string;
  analyzedDate?: string;

  // Rich PictureThis Wiki Details
  scientificClassification?: ScientificClassification;
  botanicalCharacteristics?: BotanicalCharacteristics;
  symbolismAndCulture?: SymbolismAndCulture;
  benefitsAndUses?: BenefitsAndUses;
  usdaHardiness?: UsdaHardiness;
  popularCultivars?: CultivarItem[];
  commonPestsAndDiseases?: CommonPestItem[];
}

export interface SavedPlant {
  id: string;
  nickname?: string;
  plantData: PlantAnalysisResult;
  addedAt: string;
  lastWatered?: string;
  customSchedule?: {
    daysInterval: number;
    amountMl: number;
    potSize: string;
    potMaterial: string;
    exposure: string;
    location: string;
  };
  wateringHistory: {
    date: string;
    notes?: string;
  }[];
}
