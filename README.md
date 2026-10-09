# FloraID - Identificatore Piante & Cura Botanica 🌿

Applicazione professionale in stile PictureThis per l'identificazione botanica istantanea, diagnosi di salute delle piante con AI Vision, enciclopedia scientifica, consulente climatico geolocalizzato e gestione personalizzata delle irrigazioni per "Le mie piante".

---

## 📱 Esportazione su GitHub & Creazione Automatica APK

Il progetto include la configurazione nativa **Capacitor** e il workflow **GitHub Actions** per creare automaticamente un file APK Android installabile.

### Come ottenere il file APK:
1. Esporta o fai il push di questo progetto su GitHub.
2. Vai nella scheda **Actions** del tuo repository GitHub.
3. Il workflow **Build Android APK** viene eseguito automaticamente ad ogni push su `main` o con trigger manuale (`Run workflow`).
4. Al termine del job, nella sezione **Artifacts** troverai il pacchetto scaricabile **FloraID-Android-Debug-APK** con il file `FloraID-Debug.apk`.
5. Installa l'APK direttamente su qualsiasi smartphone o tablet Android!

Per i dettagli completi, consulta la guida dedicata: [EXPORT_GITHUB_APK.md](./EXPORT_GITHUB_APK.md).

---

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, Google GenAI SDK (`@google/genai`).
- **Mobile Runtime**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`).
- **CI/CD Mobile**: GitHub Actions (`.github/workflows/build-apk.yml`) con Gradle 8 e Android SDK 34.
- **Meteo & Clima**: Open-Meteo API per dati meteorologici in tempo reale con geolocalizzazione GPS.

---

## 🚀 Script Disponibili

- `npm run dev` — Avvia il server di sviluppo unificato Express + Vite.
- `npm run build` — Compila l'applicazione web per la produzione in `dist/`.
- `npm run build:android` — Compila la web app e sincronizza gli asset nella cartella nativa `android/`.
- `npm run cap:sync` — Sincronizza i file web e i plugin con il progetto Android.
- `npm run lint` — Verifica i tipi TypeScript con `tsc --noEmit`.

---

## 📄 Licenza
Progetto open-source per scopi educativi e botanici.
