import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for mobile apps (Capacitor Android localhost/capacitor origin) and cross-origin clients
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint for APK and status tests
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "FloraID",
    version: "1.0.0",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/ping", (_req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

// Generous payload size for high-res plant photos (base64)
app.use(express.json({ limit: "30mb" }));

// Initialize GoogleGenAI server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for calling Gemini with automatic model fallback to avoid 503 transient spikes
async function callGeminiWithFallback(getParams: (model: string) => any) {
  // gemini-3.1-flash-lite is lightning fast and free from the 503 load spikes currently affecting 3.8-flash
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent(getParams(model));
      return response;
    } catch (err: any) {
      console.warn(`[FloraID] Chiamata a ${model} fallita (${err?.status || err?.message}). Tentativo con modello successivo...`);
      lastError = err;
      // If error is 503/429/high-demand, immediately try the next model
      if (
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes("503") ||
        err?.message?.includes("demand")
      ) {
        continue;
      }
      // If it's another error, also try fallback model once
      continue;
    }
  }

  throw lastError;
}

// Endpoint: Identify plant & full care guide & diagnosis
app.post("/api/identify-plant", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userNotes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Nessuna immagine fornita." });
    }

    // Clean base64 string regardless of prefix or formatting
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "").trim();

    const promptText = `Analizza scientificamente l'immagine fornita della pianta o fiore o albero o foglia.
Se l'immagine NON è una pianta o non è sufficientemente nitida per una diagnosi botanica affidabile, imposta rigorosamente "isPlant": false e compila i campi con indicazioni generiche di non identificabilità.
Se è una pianta, fornisci l'identificazione certa, diagnosi visiva basata SOLO sui sintomi reali osservabili nella foto (senza inventare malattie inesistenti), scheda di cura scientificamente verificata, programma di annaffiatura calcolato sulla fisiologia della specie, classificazione tassonomica APG IV, caratteristiche morfologiche reali, dati NASA Clean Air e cultivar ufficiali.

Note fornite dall'utente: ${userNotes ? `"${userNotes}"` : "Nessuna nota aggiuntiva."}

Rispondi rigorosamente in formato JSON conformandoti allo schema richiesto. Tutte le descrizioni devono essere in italiano naturale, chiaro, oggettivo, privo di speculazioni e scientificamente impeccabile.`;

    const normalizedMime = mimeType === "image/jpg" ? "image/jpeg" : (mimeType || "image/jpeg");

    const response = await callGeminiWithFallback((model) => ({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: normalizedMime,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        temperature: 0.1,
        systemInstruction: `Sei un botanico senior e patologo vegetale certificato di calibro internazionale. La tua priorità assoluta è l'ACCURATEZZA SCIENTIFICA e l'ASSENZA TOTALE DI ALLUCINAZIONI.
REGOLE VINCOLANTI:
1. ZERO ALLUCINAZIONI E NESSUNA INVENZIONE: Non inventare nomi di piante, specie, famiglie, principi tossici o patogeni. Basa ogni informazione esclusivamente su dati scientifici accreditati (Kew Royal Botanic Gardens, Royal Horticultural Society - RHS, USDA, IPNI).
2. DIAGNOSI FEDELE ALL'IMMAGINE: Segnala patologie o parassiti SOLO se visibili con certezza nella foto. Se le foglie sono sane e non presentano necrosi, ingiallimenti anomali o parassiti, dichiara "Ottimo/Sana" e lascia l'elenco anomalie vuoto. Non inventare problemi ipotetici o inesistenti.
3. CURA FISIOLOGICA SPECIFICA: Frequenza di irrigazione, range termico, fotoperiodo e substrato devono corrispondere esattamente alle esigenze biologiche documentate della specie identificata (es. le piante succulente e cactacee richiedono terreno completamente asciutto tra le bagnature, mentre le felci richiedono umidità costante senza ristagni).
4. TOSSICITÀ REALE E DOCUMENTATA: Riporta la tossicità solo per specie con noti principi attivi tossici (ossalati di calcio, saponine, alcaloidi, lattice). Se la specie è innocua e pet-friendly (es. Calathea, Peperomia, Basilico), dichiarala chiaramente sicura senza allarmismi infondati.
5. SE L'IMMAGINE NON È RICONOSCIBILE: Se l'immagine non mostra una pianta o non è sufficientemente nitida per stabilire la specie, imposta isPlant = false senza tirare a indovinare.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlant: {
              type: Type.BOOLEAN,
              description: "True se l'immagine contiene una pianta, fiore, foglia o albero identificabile",
            },
            identification: {
              type: Type.OBJECT,
              properties: {
                commonName: { type: Type.STRING, description: "Nome comune principale in italiano" },
                scientificName: { type: Type.STRING, description: "Nome scientifico/botanico in latino" },
                family: { type: Type.STRING, description: "Famiglia botanica (es. Araceae, Cactaceae, Fabaceae)" },
                genus: { type: Type.STRING, description: "Genere botanico" },
                confidence: { type: Type.NUMBER, description: "Stima percentuale di confidenza (es. 95)" },
                shortDescription: { type: Type.STRING, description: "Breve riassunto introduttivo di 2-3 frasi" },
                fullDescription: { type: Type.STRING, description: "Descrizione dettagliata dell'origine, habitat naturale e particolarità" },
                symbolism: { type: Type.STRING, description: "Significato simbolico o linguaggio dei fiori" },
                difficultyLevel: {
                  type: Type.STRING,
                  description: "Livello di difficoltà di cura: Facile, Media, Difficile",
                },
                toxicity: {
                  type: Type.OBJECT,
                  properties: {
                    isToxicToPets: { type: Type.BOOLEAN, description: "Tossico per cani o gatti" },
                    petDetails: { type: Type.STRING, description: "Dettagli tossicità animali domestici" },
                    isToxicToHumans: { type: Type.BOOLEAN, description: "Tossico per esseri umani" },
                    humanDetails: { type: Type.STRING, description: "Dettagli tossicità umana" },
                  },
                  required: ["isToxicToPets", "petDetails", "isToxicToHumans", "humanDetails"],
                },
              },
              required: [
                "commonName",
                "scientificName",
                "family",
                "genus",
                "confidence",
                "shortDescription",
                "fullDescription",
                "difficultyLevel",
                "toxicity",
              ],
            },
            healthDiagnosis: {
              type: Type.OBJECT,
              properties: {
                status: {
                  type: Type.STRING,
                  description: "Stato di salute: Ottimo/Sana, Lievi Sofferenze, Problemi Rilevati, Grave",
                },
                healthScore: {
                  type: Type.NUMBER,
                  description: "Punteggio di salute visiva da 0 a 100 (es. 95 per pianta splendida)",
                },
                summary: {
                  type: Type.STRING,
                  description: "Valutazione clinica dello stato di foglie, fusto, vigore visibile",
                },
                issuesDetected: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Nome del sintomo o malattia o parassita" },
                      symptom: { type: Type.STRING, description: "Cosa si osserva (es. punte marroni, foglie ingiallite)" },
                      cause: { type: Type.STRING, description: "Causa probabile (es. ristagno idrico, umidità bassa)" },
                      solution: { type: Type.STRING, description: "Azione correttiva consigliata passo passo" },
                      severity: { type: Type.STRING, description: "Bassa, Media, Alta" },
                    },
                    required: ["title", "symptom", "cause", "solution", "severity"],
                  },
                  description: "Lista di anomalie o malattie individuate, oppure accorgimenti preventivi",
                },
                preventiveTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Suggerimenti per mantenere la pianta al massimo del vigore",
                },
              },
              required: ["status", "healthScore", "summary", "issuesDetected", "preventiveTips"],
            },
            careGuide: {
              type: Type.OBJECT,
              properties: {
                light: {
                  type: Type.OBJECT,
                  properties: {
                    requirement: { type: Type.STRING, description: "Es. Luce indiretta brillante, Pieno sole, Mezz'ombra" },
                    hoursPerDay: { type: Type.STRING, description: "Ore consigliate al giorno" },
                    tips: { type: Type.STRING, description: "Consigli pratici su posizionamento finestre e rischi bruciature" },
                  },
                  required: ["requirement", "hoursPerDay", "tips"],
                },
                watering: {
                  type: Type.OBJECT,
                  properties: {
                    summary: { type: Type.STRING, description: "Regola d'oro per l'annaffiatura" },
                    summerFrequencyDays: { type: Type.NUMBER, description: "Intervallo medio estivo in giorni (es. 5)" },
                    winterFrequencyDays: { type: Type.NUMBER, description: "Intervallo medio invernale in giorni (es. 12)" },
                    waterAmount: { type: Type.STRING, description: "Quantità indicativa e metodo (es. 250-400 ml, abbondante fino a scolo)" },
                    technique: { type: Type.STRING, description: "Metodo (dall'alto, sottovaso, per immersione, temperatura acqua)" },
                    soilMoistureCheck: { type: Type.STRING, description: "Come verificare il terriccio (es. test del dito a 3-5 cm)" },
                  },
                  required: [
                    "summary",
                    "summerFrequencyDays",
                    "winterFrequencyDays",
                    "waterAmount",
                    "technique",
                    "soilMoistureCheck",
                  ],
                },
                soilAndRepotting: {
                  type: Type.OBJECT,
                  properties: {
                    soilMix: { type: Type.STRING, description: "Composizione del substrato ideale e drenaggio" },
                    phRange: { type: Type.STRING, description: "pH ottimale del terreno" },
                    repottingFrequency: { type: Type.STRING, description: "Ogni quanto rinvasare e periodo ideale" },
                    potType: { type: Type.STRING, description: "Tipo di vaso consigliato (terracotta, plastica con fori, ecc.)" },
                  },
                  required: ["soilMix", "phRange", "repottingFrequency", "potType"],
                },
                temperatureAndHumidity: {
                  type: Type.OBJECT,
                  properties: {
                    idealRange: { type: Type.STRING, description: "Temperatura ideale (es. 18°C - 26°C)" },
                    minTolerance: { type: Type.STRING, description: "Temperatura minima di sicurezza" },
                    humidityRequirement: { type: Type.STRING, description: "Livello di umidità e come ottenerlo (nebulizzazioni, umidificatore)" },
                  },
                  required: ["idealRange", "minTolerance", "humidityRequirement"],
                },
                fertilizer: {
                  type: Type.OBJECT,
                  properties: {
                    frequency: { type: Type.STRING, description: "Frequenza di concimazione (es. ogni 15 giorni da aprile a settembre)" },
                    type: { type: Type.STRING, description: "Tipo di fertilizzante (es. NPK bilanciato per piante verdi)" },
                    winterInstructions: { type: Type.STRING, description: "Cosa fare in autunno/inverno" },
                  },
                  required: ["frequency", "type", "winterInstructions"],
                },
                pruningAndPropagation: {
                  type: Type.OBJECT,
                  properties: {
                    pruning: { type: Type.STRING, description: "Come e quando potare o pulire le foglie" },
                    propagation: { type: Type.STRING, description: "Metodo migliore per propagare la pianta (es. talea di fusto, divisione)" },
                  },
                  required: ["pruning", "propagation"],
                },
              },
              required: [
                "light",
                "watering",
                "soilAndRepotting",
                "temperatureAndHumidity",
                "fertilizer",
                "pruningAndPropagation",
              ],
            },
            customWateringSchedule: {
              type: Type.OBJECT,
              properties: {
                recommendedBaseDays: { type: Type.NUMBER, description: "Intervallo standard consigliato in giorni" },
                recommendedAmountMl: { type: Type.NUMBER, description: "Quantità base d'acqua suggerita in ml" },
                seasonalAdvice: {
                  type: Type.OBJECT,
                  properties: {
                    spring: { type: Type.STRING, description: "Consiglio per la primavera" },
                    summer: { type: Type.STRING, description: "Consiglio per l'estate" },
                    autumn: { type: Type.STRING, description: "Consiglio per l'autunno" },
                    winter: { type: Type.STRING, description: "Consiglio per l'inverno" },
                  },
                  required: ["spring", "summer", "autumn", "winter"],
                },
                waterQualityTips: { type: Type.STRING, description: "Tipo di acqua consigliata (rubinetto riposata, piovana, demineralizzata)" },
                moistureIndicatorGuide: { type: Type.STRING, description: "Guida alla lettura dell'umidità prima di versare acqua" },
              },
              required: [
                "recommendedBaseDays",
                "recommendedAmountMl",
                "seasonalAdvice",
                "waterQualityTips",
                "moistureIndicatorGuide",
              ],
            },
            funFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 o 3 curiosità affascinanti sulla pianta",
            },
            similarSpecies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nome comune e scientifico" },
                  distinction: { type: Type.STRING, description: "Come distinguerla da questa pianta" },
                },
                required: ["name", "distinction"],
              },
              description: "1-3 specie simili con cui potrebbe essere confusa",
            },
            scientificClassification: {
              type: Type.OBJECT,
              properties: {
                kingdom: { type: Type.STRING },
                phylum: { type: Type.STRING },
                class: { type: Type.STRING },
                order: { type: Type.STRING },
                family: { type: Type.STRING },
                subfamily: { type: Type.STRING },
                genus: { type: Type.STRING },
                species: { type: Type.STRING },
                botanicalSynonyms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["kingdom", "phylum", "class", "order", "family", "genus", "species"],
            },
            botanicalCharacteristics: {
              type: Type.OBJECT,
              properties: {
                plantType: { type: Type.STRING },
                lifespan: { type: Type.STRING },
                matureHeight: { type: Type.STRING },
                matureSpread: { type: Type.STRING },
                leafColor: { type: Type.STRING },
                leafShape: { type: Type.STRING },
                leafSize: { type: Type.STRING },
                flowerColor: { type: Type.STRING },
                bloomTime: { type: Type.STRING },
                flowerFragrance: { type: Type.STRING },
                fruit: { type: Type.STRING },
              },
              required: [
                "plantType",
                "lifespan",
                "matureHeight",
                "matureSpread",
                "leafColor",
                "leafShape",
                "leafSize",
                "flowerColor",
                "bloomTime",
              ],
            },
            symbolismAndCulture: {
              type: Type.OBJECT,
              properties: {
                meaning: { type: Type.STRING },
                fengShui: { type: Type.STRING },
                popularNamesOrigins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      originExplanation: { type: Type.STRING },
                    },
                    required: ["name", "originExplanation"],
                  },
                },
              },
              required: ["meaning", "fengShui", "popularNamesOrigins"],
            },
            benefitsAndUses: {
              type: Type.OBJECT,
              properties: {
                airPurificationNasa: { type: Type.STRING },
                bedroomNightOxygen: { type: Type.STRING },
                practicalUses: { type: Type.STRING },
              },
              required: ["airPurificationNasa", "bedroomNightOxygen", "practicalUses"],
            },
            usdaHardiness: {
              type: Type.OBJECT,
              properties: {
                zones: { type: Type.STRING },
                minOutdoorTemp: { type: Type.STRING },
              },
              required: ["zones", "minOutdoorTemp"],
            },
            popularCultivars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "description"],
              },
            },
            commonPestsAndDiseases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  symptoms: { type: Type.STRING },
                  remedy: { type: Type.STRING },
                },
                required: ["name", "symptoms", "remedy"],
              },
            },
          },
          required: [
            "isPlant",
            "identification",
            "healthDiagnosis",
            "careGuide",
            "customWateringSchedule",
            "funFacts",
            "similarSpecies",
          ],
        },
      },
    }));

    const rawText = response.text || "{}";
    const cleanedText = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsedData = JSON.parse(cleanedText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Errore durante l'identificazione della pianta:", error);
    return res.status(500).json({
      error: "Impossibile identificare la pianta in questo momento. Riprova con una foto più nitida o ravvicinata.",
      details: error?.message || "Errore sconosciuto",
    });
  }
});

// Endpoint: AI Botanical Assistant Chat (Ask questions about the identified plant)
app.post("/api/plant-chat", async (req, res) => {
  try {
    const { plantName, scientificName, messages, question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Nessuna domanda fornita." });
    }

    const conversationHistory = Array.isArray(messages)
      ? messages.map((m: { role: string; text: string }) => `${m.role === "user" ? "Utente" : "Dottore Botanico"}: ${m.text}`).join("\n")
      : "";

    const prompt = `Sei il Dottore Botanico di FloraID (stile PictureThis AI), specializzato nella cura delle piante.
Contesto pianta corrente:
- Nome comune: ${plantName || "Pianta generica"}
- Nome scientifico: ${scientificName || "Sconosciuto"}

Cronologia conversazione:
${conversationHistory}

Nuova domanda dell'utente: "${question}"

Fornisci una risposta accurata, empatica, pratica e ricca di suggerimenti biologici concreti in lingua italiana. Sii conciso ma esaustivo, con elenchi puntati chiari per i passaggi operativi.`;

    const response = await callGeminiWithFallback((model) => ({
      model,
      contents: prompt,
      config: {
        temperature: 0.2,
        systemInstruction: `Sei un agronomo e patologo vegetale accademico. RISPONDI RIGOROSAMENTE SENZA ALLUCINAZIONI E SENZA INVENTARE NULLA.
1. Basa ogni risposta esclusivamente su pratiche colturali documentate e biologia vegetale verificata.
2. Non inventare malattie immaginarie o rimedi casalinghi strampalati o pericolosi per la pianta.
3. Se un sintomo descritto dall'utente può avere molteplici cause (es. foglie gialle dovute a eccesso o carenza d'acqua o clorosi ferrica), spiega chiaramente come verificare con certezza quale sia la causa reale prima di agire.
4. Non fare promesse irrealistiche o fantasiose: sii onesto, scientifico e rassicurante.`,
      },
    }));

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Errore chat botanica:", error);
    return res.status(500).json({
      error: "Errore durante la generazione della risposta. Riprova tra poco.",
    });
  }
});

// Endpoint: Recalculate Customized Watering Schedule based on environmental factors
app.post("/api/calculate-watering", async (req, res) => {
  try {
    const {
      plantName,
      scientificName,
      baseFrequencyDays = 7,
      potSize, // "small" | "medium" | "large" | "ground"
      potMaterial, // "terracotta" | "plastic" | "ceramic"
      exposure, // "direct_sun" | "bright_indirect" | "medium_shade" | "low_light"
      location, // "indoor" | "balcony" | "garden"
      season, // "spring" | "summer" | "autumn" | "winter"
      indoorClimate, // "heating_ac" | "temperate" | "humid"
    } = req.body;

    const prompt = `Calcola un programma di annaffiatura altamente personalizzato e scientifico per la seguente pianta e condizioni specifiche:
- Pianta: ${plantName} (${scientificName})
- Frequenza base naturale: ogni ${baseFrequencyDays} giorni
- Dimensioni vaso: ${potSize}
- Materiale vaso: ${potMaterial} (ricorda che la terracotta fa evaporare l'acqua più in fretta della plastica)
- Esposizione alla luce: ${exposure}
- Collocazione: ${location}
- Stagione attuale: ${season}
- Clima interno/ambientale: ${indoorClimate}

Restituisci solo un JSON con lo schema:
- adjustedDaysInterval: numero intero di giorni tra un'annaffiatura e l'altra (es. 4 o 9 o 14)
- waterQuantityMl: quantità suggerita in millilitri (es. 350)
- scheduleExplanation: spiegazione discorsiva chiara di come i parametri (vaso, luce, stagione) hanno modificato la frequenza base
- proTips: array di 3 consigli specifici per questa configurazione
- alertCondition: come accorgersi subito se la pianta ha troppa o poca acqua in questo ambiente`;

    const response = await callGeminiWithFallback((model) => ({
      model,
      contents: prompt,
      config: {
        temperature: 0.1,
        systemInstruction: `Sei un ingegnere agrario e fisiologo vegetale. CALCOLA IL FABBISOGNO IDRICO SENZA ALLUCINAZIONI O NUMERI CASUALI.
1. Applica rigorosamente le formule di evapotraspirazione biologica:
- Vaso di terracotta: traspirazione capillare perimetrale accelerata -> intervallo ridotto del 15-20% rispetto alla plastica.
- Vaso di plastica/resina/ceramica smaltata: trattenimento prolungato dell'umidità radicale -> intervallo allungato.
- Luce solare diretta: consumo stomatico elevato -> bagnature più ravvicinate.
- Ombra o luce debole: fotosintesi lenta -> allunga notevolmente l'intervallo per evitare asfissia radicale.
- Inverno: dormienza o rallentamento metabolico -> intervallo almeno raddoppiato rispetto all'estate.
2. Non consigliare mai annaffiature frequenti per piante grasse/succulente (es. Sansevieria, Aloe, Zamioculcas mai sotto gli 8-10 giorni).
3. Tutti i consigli proTips e l'alertCondition devono essere veri e testati sul campo.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adjustedDaysInterval: { type: Type.INTEGER },
            waterQuantityMl: { type: Type.INTEGER },
            scheduleExplanation: { type: Type.STRING },
            proTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            alertCondition: { type: Type.STRING },
          },
          required: [
            "adjustedDaysInterval",
            "waterQuantityMl",
            "scheduleExplanation",
            "proTips",
            "alertCondition",
          ],
        },
      },
    }));

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Errore calcolo irrigazione:", error);
    return res.status(500).json({ error: "Errore durante il calcolo dell'irrigazione." });
  }
});

// Endpoint: AI Climate & Geolocation Specific Care Advisor
app.post("/api/climate-care-advice", async (req, res) => {
  try {
    const {
      locationName,
      temperature,
      humidity,
      weatherDescription,
      season,
      plants = [],
    } = req.body;

    const plantListDesc = plants && plants.length > 0
      ? plants.map((p: any) => `- ${p.name} (${p.scientificName || "N/A"}), collocazione: ${p.location || "interno"}`).join("\n")
      : "Nessuna pianta registrata (fornisci consigli generali per le piante da appartamento e da balcone).";

    const prompt = `Sei un agronomo e patologo vegetale senior.
L'utente si trova in località "${locationName || "Locale"}", dove attualmente sono rilevate le seguenti condizioni meteo reali:
- Stagione: ${season || "Autunno"}
- Temperatura aria: ${temperature}°C
- Umidità relativa: ${humidity}%
- Condizioni atmosferiche: ${weatherDescription || "Sereno"}

Piante presenti nel giardino dell'utente:
${plantListDesc}

Fornisci indicazioni scientifiche, rigorose e prive di allucinazioni:
1. Come queste specifiche condizioni atmosferiche (temperatura reale, umidità dell'aria e precipitazioni) influenzano l'evapotraspirazione, il rischio di marciumi o scottature e la bagnatura oggi.
2. Eventuali allerte meteo orticole attive (es. colpi di freddo notturni, vento forte, umidità stagnante, pioggia su piante esterne).
3. Suggerimenti pratici e specifici per le piante presenti nel giardino dell'utente (es. se sospendere l'acqua, ritirare all'interno o arieggiare).
4. Un consiglio agronomico per la gestione della stagione ${season || "in corso"}.`;

    const response = await callGeminiWithFallback((model) => ({
      model,
      contents: prompt,
      config: {
        temperature: 0.1,
        systemInstruction: `Sei un ingegnere agrario e fisiologo vegetale. Fornisci cure e consigli basati ESCLUSIVAMENTE sulla biologia vegetale reale, senza inventare nulla e senza allucinazioni. Adatta le indicazioni alla temperatura effettiva: sotto i 12-14°C le piante tropicali soffrono se lasciate all'aperto; con umidità elevata (>75%) il terriccio impiega più giorni ad asciugare e le nebulizzazioni fogliari vanno sospese per evitare funghi fogliari.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            climateSummary: { type: Type.STRING },
            seasonalAdvice: { type: Type.STRING },
            irrigationImpact: { type: Type.STRING },
            activeAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "warning, info, o success" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["type", "title", "description"],
              },
            },
            plantSpecificActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  plantName: { type: Type.STRING },
                  recommendedAction: { type: Type.STRING },
                },
                required: ["plantName", "recommendedAction"],
              },
            },
          },
          required: [
            "climateSummary",
            "seasonalAdvice",
            "irrigationImpact",
            "activeAlerts",
            "plantSpecificActions",
          ],
        },
      },
    }));

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Errore climate advice:", error);
    return res.status(500).json({ error: "Errore durante il calcolo dei consigli climatici." });
  }
});

// Endpoint: Download complete project as ZIP for GitHub & APK build
app.get("/api/download-zip", (_req, res) => {
  const zipPath = path.resolve(__dirname, "floraid-project.zip");
  res.download(zipPath, "floraid-project.zip", (err) => {
    if (err) {
      console.error("Errore download zip:", err);
      if (!res.headersSent) {
        res.status(500).send("Impossibile scaricare l'archivio ZIP.");
      }
    }
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`FloraID server avviato su http://localhost:${port}`);
  });
}

startServer();
