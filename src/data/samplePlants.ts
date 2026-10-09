import { PlantAnalysisResult } from "../types";

export interface SamplePlantItem {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  difficulty: "Facile" | "Media" | "Difficile";
  imageUrl: string;
  thumbnail: string;
  highlight: string;
  defaultData: PlantAnalysisResult;
}

export const SAMPLE_PLANTS: SamplePlantItem[] = [
  {
    id: "sansevieria",
    name: "Sansevieria Trifasciata",
    scientificName: "Dracaena trifasciata",
    category: "Succulente & Purificatrici",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=400&q=80",
    highlight: "Quasi indistruttibile, eccellente purificatore d'aria NASA e protettore Feng Shui",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Sansevieria (Lingua di suocera / Spada di San Giorgio)",
        scientificName: "Dracaena trifasciata (ex Sansevieria trifasciata)",
        family: "Asparagaceae",
        genus: "Dracaena",
        confidence: 99,
        shortDescription: "La pianta più resistente e adattabile per la casa. Caratterizzata da foglie erette a spada con striature variegate verde e giallo oro.",
        fullDescription: "Originaria dell'Africa occidentale tropicale (dalla Nigeria al Congo), è una succulenta rizomatosa sempreverde celebre per la sua longevità prodigiosa e la capacità di sopravvivere in condizioni estreme di siccità e scarsa illuminazione. Fino al 2017 apparteneva al genere Sansevieria, ora riclassificato in Dracaena in base agli studi filogenetici molecolari.",
        symbolism: "Simbolo di protezione domestica, tenacia inossidabile, purificazione spirituale e buona sorte.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: true,
          petDetails: "Contiene saponine tossiche. Se masticata da cani o gatti può provocare nausea, scialorrea (salivazione abbondante), vomito o diarrea lieve-moderata. Tenere fuori dalla portata dei cuccioli curiosi.",
          isToxicToHumans: false,
          humanDetails: "Bassa tossicità per l'uomo; può provocare lieve irritazione orale se ingerita cruda in grandi quantità.",
        },
      },
      scientificClassification: {
        kingdom: "Plantae (Regno Vegetale)",
        phylum: "Tracheophyta (Piante vascolari)",
        class: "Liliopsida (Monocotiledoni)",
        order: "Asparagales",
        family: "Asparagaceae (Asparagacee)",
        subfamily: "Nolinoideae",
        genus: "Dracaena Vand. ex L. (precedentemente Sansevieria Thunb.)",
        species: "Dracaena trifasciata (Prain) Mabb.",
        botanicalSynonyms: [
          "Sansevieria trifasciata Prain",
          "Sansevieria zeylanica var. laurentii",
          "Sansevieria craigii",
          "Sansevieria jacquinii",
        ],
      },
      botanicalCharacteristics: {
        plantType: "Pianta perenne sempreverde succulenta rizomatosa",
        lifespan: "Perenne (supera facilmente i 20-30 anni in ambiente domestico)",
        matureHeight: "60 cm - 120 cm in vaso da appartamento (fino a 2 metri in habitat tropicale nativo)",
        matureSpread: "30 cm - 60 cm di larghezza della rosetta basale",
        leafColor: "Verde scuro lucido con striature ondulate trasversali grigio-argentee e bordi laterali giallo oro intenso (specie nella var. Laurentii)",
        leafShape: "A spada eretta (spadiforme), acuminata, carnosa, spessa e rigida con consistenza coriacea",
        leafSize: "Lunghezza: 70 - 90 cm; Larghezza: 5 - 8 cm; Spessore: circa 0.5 - 1 cm",
        flowerColor: "Bianco-verdastro pallido o crema su scapi allungati",
        bloomTime: "Primavera - Inizio Estate (fioritura rara in interni, stimolata solo da forte luce solare filtrata e radici ben compresse)",
        flowerFragrance: "Profumo intenso, dolce e vanigliato (molto simile al gelsomino notturno), percepibile soprattutto dopo il tramonto",
        fruit: "Piccole bacche globose di colore arancione o rosso corallo a maturazione",
      },
      symbolismAndCulture: {
        meaning: "Rappresenta tenacia indomabile, purezza d'intenti, protezione della dimora e longevità serena.",
        fengShui: "Nel Feng Shui è considerata una potentissima 'pianta guardiana'. Grazie alle sue foglie acuminate che crescono verticalmente verso l'alto (energia Legno ascendente), viene posizionata vicino all'ingresso di casa o negli angoli a est/sud-est per neutralizzare le energie negative Chi (Sha Chi), purificare le correnti energetiche e favorire concentrazione mentale e chiarezza.",
        popularNamesOrigins: [
          {
            name: "Lingua di suocera (Mother-in-law's Tongue)",
            originExplanation: "Nome popolare derivante dalla forma allungata, rigida e dalla punta acuminata delle foglie, paragonata ironicamente alla lingua tagliente e critica della suocera.",
          },
          {
            name: "Spada di San Giorgio (Espada-de-São-Jorge)",
            originExplanation: "Molto diffuso in Brasile e nelle tradizioni afro-brasiliane (Candomblé/Umbanda) e cristiane: le foglie a forma di spada simboleggiano l'arma di San Giorgio contro il drago, usata come amuleto botanico contro invidie, malocchio e negatività.",
          },
          {
            name: "Canapa dell'arco della vipera (Viper's Bowstring Hemp)",
            originExplanation: "In Africa le popolazioni indigene estraevano storicamente le tenacissime fibre vegetali dalle foglie per tessere corde resistenti per archi da caccia e funi navali.",
          },
        ],
      },
      benefitsAndUses: {
        airPurificationNasa: "Inclusa nel celebre 'Clean Air Study' della NASA tra le migliori 5 piante in assoluto per l'assorbimento di composti organici volatili (VOC). Rimuove attivamente formaldeide, benzene, xilene, toluene e tricloroetilene dall'aria interna.",
        bedroomNightOxygen: "Utilizza il metabolismo acido delle crassulacee (fotosintesi CAM): a differenza della maggior parte delle piante che di notte consumano ossigeno, la Sansevieria apre gli stomi al buio per assorbire CO2 e rilasciare ossigeno puro. Per questo è la pianta perfetta per la camera da letto.",
        practicalUses: "Produzione storica di fibre elastiche, cordami, tessuti rustici. Oggi è la pianta da interni e arredo scultoreo d'elezione per uffici e abitazioni contemporanee.",
      },
      usdaHardiness: {
        zones: "Zone USDA 10a - 12b (coltivabile all'aperto solo in climi subtropicali privi di gelate)",
        minOutdoorTemp: "10°C (sotto gli 8°C le cellule fogliari subiscono lesioni da freddo irreversibili)",
      },
      popularCultivars: [
        {
          name: "Sansevieria trifasciata 'Laurentii'",
          description: "La cultivar più famosa al mondo: foglie bordate da un netto nastro giallo dorato brillante lungo entrambi i margini.",
        },
        {
          name: "Sansevieria trifasciata 'Hahnii' (Nido d'uccello)",
          description: "Varietà nana compatta che non supera i 15-20 cm di altezza, con foglie larghe disposte a calice/rosetta.",
        },
        {
          name: "Sansevieria trifasciata 'Moonshine'",
          description: "Foglie larghe e argentee di un verde chiarissimo metallico quasi bianco, di straordinario impatto visivo.",
        },
        {
          name: "Sansevieria trifasciata 'Zeylanica'",
          description: "Varietà classica con fitte striature zebrate verde bosco e grigio, senza la bordatura gialla.",
        },
        {
          name: "Sansevieria trifasciata 'Black Coral'",
          description: "Foglie erette con tonalità verde scuro profondo, quasi nero ebano, e screziature argentee contrastanti.",
        },
      ],
      commonPestsAndDiseases: [
        {
          name: "Marciume radicale e del colletto (Pythium / Phytophthora)",
          symptoms: "Foglie che diventano molli, traslucide, ingiallite o marroni alla base del rizoma con odore di marcio.",
          remedy: "Sospendi immediatamente le annaffiature, svasa ed elimina le radici marroni con forbici sterilizzate. Lascia asciugare il rizoma per 48 ore all'aria e rinvasa in terriccio per cactacee asciutto.",
        },
        {
          name: "Cocciniglia farinosa (Pseudococcidae)",
          symptoms: "Piccoli batuffoli bianchi simili a cotone idrofilo nascosti alla base della rosetta o lungo le nervature.",
          remedy: "Rimuovi manualmente con un cotton fioc imbevuto di alcool denaturato al 70%. In casi diffusi, spruzza sapone molle potassico o olio di neem.",
        },
        {
          name: "Maculatura fogliare fungina",
          symptoms: "Macchie circolari scure con alone rosso o marrone sulle lamine fogliari causate da umidità fredda.",
          remedy: "Evita di bagnare le foglie dall'alto. Sposta in luogo più arieggiato e caldo ed elimina la foglia colpita se l'infezione si allarga.",
        },
      ],
      healthDiagnosis: {
        status: "Ottimo/Sana",
        healthScore: 98,
        summary: "Condizione fisiologica eccellente. Lamina fogliare rigida e turgida, variegatura oro-verde luminosa e nessun segno di marciume o stress abiotico.",
        issuesDetected: [],
        preventiveTips: [
          "Regola d'oro: nel dubbio, non annaffiare. È una succulenta che teme solo il ristagno idrico.",
          "Spolvera periodicamente le foglie con un panno asciutto per massimizzare la fotosintesi e la lucentezza.",
          "Non versare mai acqua direttamente all'interno della rosetta fogliare centrale.",
        ],
      },
      careGuide: {
        light: {
          requirement: "Estremamente adattabile: da luce filtrata brillante a ombra parziale (tollera anche pieno sole se acclimatata)",
          hoursPerDay: "4 - 8 ore di luce indiretta brillante per la massima intensità dei bordi gialli",
          tips: "Sopravvive anche negli angoli più bui dell'appartamento, anche se con luce generosa cresce più vigorosa. Evita solo il sole cocente estivo a vetro chiuso che potrebbe causare scottature bianche.",
        },
        watering: {
          summary: "Lascia asciugare completamente il terriccio (100% asciutto anche in profondità) prima di ogni annaffiatura.",
          summerFrequencyDays: 14,
          winterFrequencyDays: 30,
          waterAmount: "Circa 200-250 ml per vasi medi, bagnando il perimetro del terreno senza inzuppare.",
          technique: "Versa attorno al bordo del vaso. In inverno basta bagnare una volta ogni 3-4 settimane. Svuota sempre il sottovaso.",
          soilMoistureCheck: "Infila uno stecchino di legno fino al fondo del vaso: se esce completamente pulito e asciutto, puoi annaffiare.",
        },
        soilAndRepotting: {
          soilMix: "Substrato altamente drenante: 50% terriccio per succulente/cactacee, 30% perlite o pomice, 20% sabbia grossolana di fiume.",
          phRange: "5.5 - 7.5 (da leggermente acido a neutro)",
          repottingFrequency: "Solo ogni 2-4 anni: ama avere le radici strette e quando il vaso è saturo produce polloni e fiori profumati.",
          potType: "Vaso in terracotta con generoso foro di drenaggio inferiore (la terracotta favorisce la traspirazione ed evita ristagni).",
        },
        temperatureAndHumidity: {
          idealRange: "18°C - 28°C",
          minTolerance: "10°C (sotto i 10°C rallenta drasticamente e rischia danni cellulari)",
          humidityRequirement: "Tollera benissimo l'aria secca degli appartamenti con termosifoni accesi (30-50% UR). Non richiede nebulizzazioni.",
        },
        fertilizer: {
          frequency: "Una volta ogni 4-6 settimane durante la primavera e l'estate",
          type: "Concime liquido specifico per piante grasse e cactacee a basso tenore di azoto e ricco di potassio (diluito a metà dose)",
          winterInstructions: "Sospendere completamente ogni concimazione da ottobre a marzo.",
        },
        pruningAndPropagation: {
          pruning: "Non richiede potatura. Rimuovi solo le foglie vecchie basali secche recidendole alla base con cesoie disinfettate.",
          propagation: "Divisione dei cespi e rizomi durante il rinvaso (mantiene la bordatura dorata) oppure talea di foglia in acqua o sabbia.",
        },
      },
      customWateringSchedule: {
        recommendedBaseDays: 14,
        recommendedAmountMl: 250,
        seasonalAdvice: {
          spring: "Riprendi ad annaffiare ogni 12-14 giorni quando il terreno è completamente secco.",
          summer: "Ogni 10-14 giorni se le temperature superano i 28°C e la pianta riceve molta luce.",
          autumn: "Riduci la somministrazione a ogni 18-21 giorni con il calare delle ore di luce.",
          winter: "Bagna pochissimo: una volta ogni 25-35 giorni è più che sufficiente.",
        },
        waterQualityTips: "Non ha particolari esigenze, tollera bene anche l'acqua di rubinetto a temperatura ambiente.",
        moistureIndicatorGuide: "Se la base delle foglie diventa molle o gialla, c'è un eccesso idrico critico. Se le foglie si raggrinziscono longitudinalmente, la pianta ha solo una leggera sete.",
      },
      funFacts: [
        "Fa parte delle piante analizzate dalla NASA Clean Air Study per la purificazione dell'aria in stazioni spaziali.",
        "Le sue fibre fogliari venivano usate per tessere corde per archi da caccia nell'Africa subsahariana, da cui il nome 'Viper's Bowstring Hemp'.",
        "È una delle pochissime piante da appartamento che rilascia ossigeno puro di notte anziché di giorno.",
      ],
      similarSpecies: [
        {
          name: "Dracaena angolensis (Sansevieria cylindrica)",
          distinction: "Foglie cilindriche affusolate e lisce a forma di lancia, spesso intrecciate a treccia ornamentale.",
        },
        {
          name: "Agave americana",
          distinction: "Ha spine rigide e acuminate sui margini e cresce principalmente all'aperto in climi aridi caldi.",
        },
        {
          name: "Sansevieria masoniana (Whale Fin)",
          distinction: "Produce una singola foglia gigantesca a forma di pinna di balena larga fino a 20 cm.",
        },
      ],
    },
  },
  {
    id: "monstera",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "Piante d'appartamento",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80",
    highlight: "Foglie iconiche fenestrate, purifica l'aria di casa",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Monstera Deliciosa (Pianta del formaggio svizzero)",
        scientificName: "Monstera deliciosa",
        family: "Araceae",
        genus: "Monstera",
        confidence: 99,
        shortDescription: "La Monstera deliciosa è celebre per le sue maestose foglie traforate a forma di cuore. Originaria delle foreste tropicali dell'America centrale, è una delle piante d'appartamento più amate al mondo.",
        fullDescription: "In natura è una liana sempreverde epifita che si arrampica sui tronchi della giungla grazie a robuste radici aeree. Le caratteristiche perforazioni fogliari (fenestrature) permettono alla luce di raggiungere le foglie sottostanti e alla pioggia tropicale di attraversarle senza spezzarle.",
        symbolism: "Simbolo di longevità, prosperità, espansione e rispetto per le generazioni passate.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: true,
          petDetails: "Contiene cristalli insolubili di ossalato di calcio. Se masticata da cani o gatti, può provocare irritazione orale, salivazione eccessiva e difficoltà di deglutizione.",
          isToxicToHumans: true,
          humanDetails: "Foglie e fusti contengono ossalati irritanti se ingeriti crudi; il frutto maturo in natura è commestibile ma raro in appartamento.",
        },
      },
      scientificClassification: {
        kingdom: "Plantae (Regno Vegetale)",
        phylum: "Tracheophyta",
        class: "Liliopsida",
        order: "Alismatales",
        family: "Araceae",
        subfamily: "Monsteroideae",
        genus: "Monstera Adans.",
        species: "Monstera deliciosa Liebm.",
        botanicalSynonyms: ["Philodendron pertusum", "Tornelia fragrans"],
      },
      botanicalCharacteristics: {
        plantType: "Liana sempreverde rampicante ed emiepifita",
        lifespan: "Perenne",
        matureHeight: "1.5 m - 3 m in interni (fino a 10-15 m in foresta pluviale nativa)",
        matureSpread: "1 m - 2 m",
        leafColor: "Verde smeraldo scuro brillante e ceroso",
        leafShape: "Cuoriforme e profondamente fenestrata / pennatofida",
        leafSize: "Da 30 cm fino a 90 cm di lunghezza negli esemplari adulti",
        flowerColor: "Spata bianco-crema che avvolge uno spadice centrale",
        bloomTime: "Estate (rara in interno)",
        flowerFragrance: "Fruttato, dolce",
        fruit: "Spadice commestibile maturo con polpa sapore di ananas/banana",
      },
      symbolismAndCulture: {
        meaning: "Onorare i legami familiari, longevità e grandi orizzonti futuri.",
        fengShui: "Posizionata nel settore orientale della casa per favorire crescita personale, ricchezza e dinamismo.",
        popularNamesOrigins: [
          {
            name: "Pianta del formaggio svizzero (Swiss Cheese Plant)",
            originExplanation: "Dovuto alle grandi fenestrature e fori ovali sulle foglie simili a quelli dell'Emmental svizzero.",
          },
          {
            name: "Monstera (Mostro botanico)",
            originExplanation: "Dal latino 'monstrosus', dovuto alle dimensioni gigantesche e insolite delle sue foglie fenestrate.",
          },
        ],
      },
      benefitsAndUses: {
        airPurificationNasa: "Efficace nel catturare polveri sottili sulle grandi lamine fogliari e regolare l'umidità interna.",
        bedroomNightOxygen: "Ideale in soggiorno o grandi ambienti luminosi per la sua straordinaria biomassa traspirante.",
        practicalUses: "Pianta d'arredo botanico d'impatto, radici aeree usate localmente in America latina per cesti.",
      },
      usdaHardiness: {
        zones: "Zone USDA 10 - 12",
        minOutdoorTemp: "12°C",
      },
      popularCultivars: [
        { name: "Monstera deliciosa 'Borsigiana'", description: "Varietà a crescita rapida con internodi più distanziati." },
        { name: "Monstera deliciosa 'Variegata' / 'Albo Variegata'", description: "Rarissima e pregiata varietà con settori fogliari bianchi o crema." },
        { name: "Monstera deliciosa 'Thai Constellation'", description: "Stabile variegatura stellata color crema prodotta da coltura tissutale." },
      ],
      commonPestsAndDiseases: [
        {
          name: "Tripidi (Thrips)",
          symptoms: "Piccole striature argentee o punteggiatura bronzea con minuscoli puntini neri sulle foglie.",
          remedy: "Lava accuratamente le foglie con sapone insetticida o olio di neem a cadenza settimanale per un mese.",
        },
      ],
      healthDiagnosis: {
        status: "Ottimo/Sana",
        healthScore: 94,
        summary: "Esemplare molto vigoroso con eccellente turgore cellulare, cuticola lucida e accrescimento regolare delle fenestrature.",
        issuesDetected: [
          {
            title: "Leggero accumulo di polvere fogliare",
            symptom: "Patina opaca sulla superficie superiore di alcune lamine",
            cause: "Ambiente domestico asciutto e ventilazione interna",
            solution: "Pulisci delicatamente le foglie con un panno morbido inumidito con acqua demineralizzata ogni 15 giorni.",
            severity: "Bassa",
          },
        ],
        preventiveTips: [
          "Fornisci un tutore di muschio o fibra di cocco per sostenere la crescita verticale e le radici aeree.",
          "Evita che l'acqua ristagni nel sottovaso oltre 20 minuti dall'annaffiatura.",
        ],
      },
      careGuide: {
        light: {
          requirement: "Luce indiretta brillante",
          hoursPerDay: "6-8 ore di luce diffusa",
          tips: "Posiziona vicino a una finestra orientata a est o ovest. Proteggi dai raggi solari cocenti di mezzogiorno che causerebbero bruciature biancastre.",
        },
        watering: {
          summary: "Annaffia solo quando i primi 3-5 cm di terriccio sono completamente asciutti al tatto.",
          summerFrequencyDays: 6,
          winterFrequencyDays: 12,
          waterAmount: "Circa 350-500 ml per vasi medi, fino a quando non vedi le prime gocce uscire dai fori di drenaggio.",
          technique: "Versa uniformemente attorno al fusto con acqua a temperatura ambiente. Non bagnare costantemente il colletto.",
          soilMoistureCheck: "Infila un dito o uno stecco di legno nel terreno: se esce pulito e asciutto a 4 cm di profondità, è il momento di annaffiare.",
        },
        soilAndRepotting: {
          soilMix: "Substrato arioso e drenante: 50% terriccio per piante verdi, 25% perlite, 25% bark per orchidee.",
          phRange: "5.5 - 6.8 (leggermente acido)",
          repottingFrequency: "Ogni 1-2 anni in primavera all'avvio della fase vegetativa.",
          potType: "Vaso in plastica con fori di drenaggio generosi o terracotta con sottovaso.",
        },
        temperatureAndHumidity: {
          idealRange: "18°C - 27°C",
          minTolerance: "12°C",
          humidityRequirement: "Umidità ideale 60-70%. Nebulizza regolarmente o posiziona un umidificatore nei mesi invernali con termosifoni accesi.",
        },
        fertilizer: {
          frequency: "Ogni 2-3 settimane da aprile a settembre",
          type: "Concime liquido bilanciato per piante verdi ricco di azoto e microelementi",
          winterInstructions: "Sospendi completamente durante i mesi invernali o applica a dose 1/4 ogni 60 giorni.",
        },
        pruningAndPropagation: {
          pruning: "Rimuovi le foglie vecchie o basali ingiallite tagliando con cesoie sterilizzate alla base del picciolo.",
          propagation: "Talea apicale o nodale comprendente almeno una radice aerea, radicata in acqua o sfagno umido a 22°C.",
        },
      },
      customWateringSchedule: {
        recommendedBaseDays: 7,
        recommendedAmountMl: 400,
        seasonalAdvice: {
          spring: "Aumenta la frequenza con la comparsa delle prime foglie nuove, controllando ogni 5-7 giorni.",
          summer: "Bagna ogni 4-6 giorni durante i picchi di calore, controllando il substrato più frequentemente.",
          autumn: "Riduci gradualmente a 8-10 giorni mentre la luce naturale cala.",
          winter: "Intervalla a 12-14 giorni. Il terreno impiega molto più tempo ad asciugarsi in ambienti riscaldati.",
        },
        waterQualityTips: "Usa acqua a temperatura ambiente lasciata decantare 24 ore per far evaporare il cloro.",
        moistureIndicatorGuide: "Se le punte delle foglie 'sudano' gocce d'acqua (guttazione), la pianta ha assorbito molta umidità; se le foglie si piegano verso il basso, è disidratata.",
      },
      funFacts: [
        "In America Centrale i frutti della Monstera selvatica sono chiamati 'ceriman' e hanno un sapore tra ananas, banana e mango.",
        "Le radici aeree possono essere guidate direttamente verso il vaso per assorbire nutrienti supplementari dal terreno.",
      ],
      similarSpecies: [
        {
          name: "Monstera adansonii (Monkey Mask)",
          distinction: "Ha foglie molto più piccole con buchi chiusi (non aperti sui margini) e portamento ricadente.",
        },
        {
          name: "Epipremnum pinnatum",
          distinction: "Foglie allungate che sviluppano fenestrature solo in età molto matura se arrampicate su tutore.",
        },
      ],
    },
  },
  {
    id: "ficus_lyrata",
    name: "Ficus Lyrata",
    scientificName: "Ficus lyrata",
    category: "Piante d'appartamento",
    difficulty: "Media",
    imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=400&q=80",
    highlight: "Grandi foglie a violino scultoree, elemento di puro design",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Ficus a foglia di violino (Fiddle Leaf Fig)",
        scientificName: "Ficus lyrata",
        family: "Moraceae",
        genus: "Ficus",
        confidence: 98,
        shortDescription: "Famoso per le sue enormi foglie cerate dalla caratteristica forma a violino con venature marcate. È un'icona del design d'interni contemporaneo.",
        fullDescription: "Originario delle foreste pluviali dell'Africa occidentale, in natura cresce come albero alto fino a 15 metri. Ama la stabilità ambientale: soffre gli spostamenti frequenti e le correnti d'aria fredda.",
        symbolism: "Rappresenta pace, abbondanza, fertilità e crescita interiore duratura.",
        difficultyLevel: "Media",
        toxicity: {
          isToxicToPets: true,
          petDetails: "Il lattice bianco secreto dai rami contiene furocumarine irritanti per stomaco e mucose di cani e gatti.",
          isToxicToHumans: true,
          humanDetails: "Il lattice linfa può irritare la pelle e gli occhi al contatto.",
        },
      },
      scientificClassification: {
        kingdom: "Plantae",
        phylum: "Tracheophyta",
        class: "Magnoliopsida",
        order: "Rosales",
        family: "Moraceae",
        genus: "Ficus L.",
        species: "Ficus lyrata Warb.",
        botanicalSynonyms: ["Ficus pandurata"],
      },
      botanicalCharacteristics: {
        plantType: "Albero sempreverde a foglia larga",
        lifespan: "Perenne",
        matureHeight: "1.5 m - 3 m in interni (fino a 12-15 m in natura)",
        matureSpread: "1 m - 1.5 m",
        leafColor: "Verde oliva scuro con nervature chiare prominenti",
        leafShape: "A lira o violino con margini ondulati",
        leafSize: "Fino a 45 cm di lunghezza e 30 cm di larghezza",
        flowerColor: "Fiori racchiusi all'interno dei siconi (fichi)",
        bloomTime: "Rarissimo in appartamento",
        flowerFragrance: "Assente",
      },
      symbolismAndCulture: {
        meaning: "Armonia, prosperità e radicamento spirituale.",
        fengShui: "Ideale nella zona nord-est o sud-ovest della casa per simboleggiare stabilità e prestigio.",
        popularNamesOrigins: [
          {
            name: "Ficus a foglia di violino (Fiddle Leaf Fig)",
            originExplanation: "Dalla sagoma inconfondibile delle foglie che ricalca il profilo della cassa armonica di un violino o di una lira classica.",
          },
        ],
      },
      benefitsAndUses: {
        airPurificationNasa: "Migliora l'umidità atmosferica interna e assorbe composti volatili.",
        bedroomNightOxygen: "Preferisce ampie zone giorno molto illuminate rispetto a stanze da letto poco arieggiate.",
        practicalUses: "Pianta da interni architettonica e d'alta gamma per design d'arredo.",
      },
      usdaHardiness: {
        zones: "Zone USDA 10 - 12",
        minOutdoorTemp: "15°C",
      },
      popularCultivars: [
        { name: "Ficus lyrata 'Bambino'", description: "Varietà compatta con foglie più piccole e internodi fitti, perfetta per spazi ristretti." },
        { name: "Ficus lyrata 'Compacta'", description: "Portamento cespuglioso più denso e ramificato fin dalla base." },
      ],
      healthDiagnosis: {
        status: "Ottimo/Sana",
        healthScore: 92,
        summary: "Buona silhouette complessiva. Le foglie superiori presentano brillantezza sana e nervature turgide.",
        issuesDetected: [
          {
            title: "Sensibilità alla luce direzionale",
            symptom: "Tendenza del tronco a inclinarsi verso la fonte di luce",
            cause: "Fototropismo naturale della pianta",
            solution: "Ruota il vaso di 90 gradi ogni 2 settimane per garantire una crescita eretta e armoniosa.",
            severity: "Bassa",
          },
        ],
        preventiveTips: [
          "Non spostare la pianta una volta trovato l'angolo ideale con luce abbondante.",
          "Tieni lontano da condizionatori d'aria o porte di ingresso con correnti d'aria.",
        ],
      },
      careGuide: {
        light: {
          requirement: "Luce intensa filtrata",
          hoursPerDay: "6 ore al giorno di luce solare indiretta",
          tips: "Adora le stanze molto luminose. Tollera 1-2 ore di sole del primo mattino, ma il sole estivo pomeridiano brucerebbe le lamine fogliari.",
        },
        watering: {
          summary: "Lascia asciugare i primi 5 cm di terreno prima di dare altra acqua. Teme fortemente il marciume radicale.",
          summerFrequencyDays: 7,
          winterFrequencyDays: 14,
          waterAmount: "Circa 400-600 ml versati lentamente finché non scorre nei fori inferiori.",
          technique: "Annaffiatura abbondante ma intervallata (metodo soak & dry).",
          soilMoistureCheck: "Usa un misuratore di umidità o infila il dito fino alla seconda nocca: se il terreno è umido o freddo, aspetta ancora qualche giorno.",
        },
        soilAndRepotting: {
          soilMix: "Terriccio ricco ma drenante con corteccia di pino, perlite e un fondo di argilla espansa nel vaso.",
          phRange: "6.0 - 7.0",
          repottingFrequency: "Ogni 2 anni in contenitore appena 5 cm più largo.",
          potType: "Vaso pesante e stabile con foro di scarico.",
        },
        temperatureAndHumidity: {
          idealRange: "18°C - 24°C",
          minTolerance: "15°C",
          humidityRequirement: "45-65%. Nei periodi secchi beneficia di una leggera spruzzata d'acqua sulle foglie.",
        },
        fertilizer: {
          frequency: "Una volta al mese in primavera ed estate",
          type: "Fertilizzante liquido 3-1-2 o bilanciato specifico per Ficus",
          winterInstructions: "Nessun fertilizzante da novembre a febbraio.",
        },
        pruningAndPropagation: {
          pruning: "Cima il fusto principale se desideri favorire la ramificazione laterale.",
          propagation: "Talea di ramo legnoso trattata con ormone radicante in terreno caldo.",
        },
      },
      customWateringSchedule: {
        recommendedBaseDays: 8,
        recommendedAmountMl: 500,
        seasonalAdvice: {
          spring: "Riprendi l'annaffiatura regolare ogni 7-8 giorni e fertilizza.",
          summer: "Monitora attentamente: con il caldo potrebbe richiedere acqua ogni 5-7 giorni.",
          autumn: "Rallenta la somministrazione ogni 10-12 giorni.",
          winter: "Annaffia solo ogni 14-18 giorni per evitare il tipico marciume radicale invernale.",
        },
        waterQualityTips: "Acqua tiepida, mai fredda di rubinetto per non provocare shock alle radici.",
        moistureIndicatorGuide: "Macchie marroni scure con alone giallo indicano troppa acqua. Macchie marroni croccanti e secche indicano disidratazione.",
      },
      funFacts: [
        "Le foglie possono raggiungere i 45 cm di lunghezza e 30 cm di larghezza.",
        "Nelle foreste africane produce piccoli fichi verdi anche se in appartamento fiorisce raramente.",
      ],
      similarSpecies: [
        {
          name: "Ficus elastica (Pianta della gomma)",
          distinction: "Foglie ovali coriacee più spesse e scure con gemma rossa avvolta in guaina.",
        },
        {
          name: "Ficus Audrey (Ficus benghalensis)",
          distinction: "Foglie con vellutatura leggera e fusto chiaro crema chiaro.",
        },
      ],
    },
  },
  {
    id: "pothos",
    name: "Pothos Aureo",
    scientificName: "Epipremnum aureum",
    category: "Piante ricadenti & rampicanti",
    difficulty: "Facile",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80",
    highlight: "Crescita rapida a cascata, quasi impossibile da far morire",
    defaultData: {
      isPlant: true,
      identification: {
        commonName: "Pothos Dorato (Edera del diavolo)",
        scientificName: "Epipremnum aureum",
        family: "Araceae",
        genus: "Epipremnum",
        confidence: 99,
        shortDescription: "Una delle piante ricadenti più versatili ed energiche. Le sue foglie cuoriformi con screziature giallo-dorate creano cascate verdi meravigliose.",
        fullDescription: "Originaria dell'isola di Moorea nella Polinesia Francese, è soprannominata 'edera del diavolo' perché è quasi impossibile da uccidere e resta verde anche se trascurata a lungo al buio.",
        symbolism: "Rappresenta dedizione incessante, prosperità continua e perseveranza.",
        difficultyLevel: "Facile",
        toxicity: {
          isToxicToPets: true,
          petDetails: "Contiene cristalli di ossalato di calcio. Può causare irritazione se masticata da animali domestici.",
          isToxicToHumans: true,
          humanDetails: "Lieve irritazione delle mucose orali in caso di ingestione.",
        },
      },
      scientificClassification: {
        kingdom: "Plantae",
        phylum: "Tracheophyta",
        class: "Liliopsida",
        order: "Alismatales",
        family: "Araceae",
        genus: "Epipremnum Schott",
        species: "Epipremnum aureum (Linden & André) G.S.Bunting",
        botanicalSynonyms: ["Scindapsus aureus", "Pothos aureus", "Rhaphidophora aurea"],
      },
      botanicalCharacteristics: {
        plantType: "Liana sempreverde rampicante o ricadente",
        lifespan: "Perenne",
        matureHeight: "Cascate di 1 - 3 metri in appartamento (fino a 20 m arrampicata in natura)",
        matureSpread: "50 cm - 1 m",
        leafColor: "Verde vivo brillante screziato di giallo oro e crema",
        leafShape: "Cordata (a forma di cuore) e acuminata",
        leafSize: "10-20 cm in vaso (fino a 80 cm se rampicante su alberi tropicali)",
        flowerColor: "Rarissimo in coltivazione indoor",
        bloomTime: "Praticamente mai fiorisce in ambiente domestico",
        flowerFragrance: "Assente",
      },
      symbolismAndCulture: {
        meaning: "Prosperità inarrestabile, tenacia e buona fortuna continua.",
        fengShui: "Eccellente sulle mensole alte e negli angoli bui per ravvivare e far circolare l'energia stagnante.",
        popularNamesOrigins: [
          {
            name: "Edera del diavolo (Devil's Ivy)",
            originExplanation: "Per la sua leggendaria resistenza: è quasi impossibile da far morire, sopravvive anche in assenza di luce e resta sempreverde.",
          },
        ],
      },
      benefitsAndUses: {
        airPurificationNasa: "Tra le più efficienti piante antismog per rimuovere formaldeide, benzene e monossido di carbonio.",
        bedroomNightOxygen: "Adatta a qualsiasi stanza, inclusi uffici e corridoi poco luminosi.",
        practicalUses: "Verde verticale pensile, vasi da mensola, coltivazione facilissima in idrocoltura.",
      },
      usdaHardiness: {
        zones: "Zone USDA 10 - 12",
        minOutdoorTemp: "10°C",
      },
      popularCultivars: [
        { name: "Epipremnum aureum 'Golden Pothos'", description: "Il classico con variegature giallo oro." },
        { name: "Epipremnum aureum 'Marble Queen'", description: "Spettacolare marmorizzazione bianca e verde chiaro." },
        { name: "Epipremnum aureum 'Neon'", description: "Foglie di un verde lime fluo brillante senza screziature." },
        { name: "Epipremnum aureum 'N'Joy'", description: "Foglie più piccole con chiazze nette bianco candido e verde scuro." },
      ],
      healthDiagnosis: {
        status: "Ottimo/Sana",
        healthScore: 96,
        summary: "Esemplare molto florido con lussureggianti getti ricadenti e variegatura ben espressa.",
        issuesDetected: [],
        preventiveTips: [
          "Cima periodicamente i tralci per stimolare nuovi getti ascellari e una chioma più densa.",
        ],
      },
      careGuide: {
        light: {
          requirement: "Luce media o indiretta brillante",
          hoursPerDay: "4-6 ore",
          tips: "Maggiore è la luce diffusa, più intense saranno le sfumature dorate sulle foglie.",
        },
        watering: {
          summary: "Aspetta che la metà superiore del terriccio sia asciutta prima di annaffiare.",
          summerFrequencyDays: 5,
          winterFrequencyDays: 10,
          waterAmount: "250-350 ml con buon drenaggio.",
          technique: "Annaffia uniformemente e svuota il sottovaso.",
          soilMoistureCheck: "Quando le foglie iniziano leggermente ad abbassarsi e il terreno è asciutto a 3 cm, dai acqua.",
        },
        soilAndRepotting: {
          soilMix: "Terriccio universale per piante verdi con 20% di perlite.",
          phRange: "6.1 - 6.5",
          repottingFrequency: "Ogni 2 anni o quando le radici fuoriescono dal fondo.",
          potType: "Vaso pensile o vaso da mensola con sottovaso.",
        },
        temperatureAndHumidity: {
          idealRange: "17°C - 26°C",
          minTolerance: "10°C",
          humidityRequirement: "Adattabile, 50-65% ideale.",
        },
        fertilizer: {
          frequency: "Ogni 20 giorni in primavera ed estate",
          type: "Fertilizzante liquido per piante verdi",
          winterInstructions: "Sospendere o una volta ogni 2 mesi.",
        },
        pruningAndPropagation: {
          pruning: "Accorcia i rami troppo lunghi per mantenere la pianta compatta.",
          propagation: "Talea in acqua facilissima: taglia un nodo con radichetta e fa radici in 10 giorni.",
        },
      },
      customWateringSchedule: {
        recommendedBaseDays: 6,
        recommendedAmountMl: 300,
        seasonalAdvice: {
          spring: "Annaffia ogni 5-7 giorni.",
          summer: "Bagna ogni 4-6 giorni.",
          autumn: "Ogni 7-9 giorni.",
          winter: "Ogni 10-12 giorni.",
        },
        waterQualityTips: "Acqua a temperatura ambiente.",
        moistureIndicatorGuide: "Le foglie leggermente morbide o ricurve indicano sete, ma si riprendono in poche ore.",
      },
      funFacts: [
        "In condizioni selvatiche e arrampicata su alberi, le foglie possono diventare lunghe quasi un metro!",
      ],
      similarSpecies: [
        {
          name: "Philodendron hederaceum (Scandens)",
          distinction: "Foglie a cuore più sottili con punta più pronunciata e steli più flessibili.",
        },
      ],
    },
  },
];
