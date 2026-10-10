# Guida all'Esportazione su GitHub & Generazione Automatica APK Android

Questo progetto **FloraID** è già configurato con **Capacitor** e un workflow di **GitHub Actions** per compilare automaticamente un file `.apk` pronto all'installazione ogni volta che effettui un push o esporti il repository su GitHub.

---

## 🚀 1. Come esportare da AIStudio a GitHub

Puoi esportare questo progetto su GitHub in due modi rapidi:

### Opzione A: Connessione Diretta Git / GitHub da Terminale
1. Crea un nuovo repository vuoto sul tuo account GitHub (es. `https://github.com/tuo-username/floraid-app`).
2. Nel terminale esegui i comandi per fare il push:
   ```bash
   git init
   git add .
   git commit -m "feat: setup FloraID with Capacitor and automatic APK GitHub Action"
   git branch -M main
   git remote add origin https://github.com/tuo-username/floraid-app.git
   git push -u origin main
   ```

### Opzione B: Download archivio ZIP / Esportazione AIStudio
1. Scarica i file del progetto e caricali nel tuo nuovo repository GitHub.

---

## ⚙️ 2. Come GitHub Actions genera automaticamente l'APK

Nel repository è presente il file di workflow:
`.github/workflows/build-apk.yml`

Ogni volta che fai un `push` sul ramo `main` o `master`, oppure quando premi manualmente **Run workflow** dalla scheda **Actions**:
1. GitHub avvia un runner Ubuntu.
2. Configura **Java JDK 21 (Temurin)** e **Android SDK (API 36 / 35 / Build-Tools 36.0.0 & 35.0.0)**.
3. Installa le dipendenze npm ed esegue `npm run build` (compilazione Vite).
4. Esegue `npx cap sync android` (copia degli asset web nella directory Android nativa).
5. Esegue `./gradlew assembleDebug` all'interno della cartella `android/`.
6. Salva e carica l'APK compilato come **Artifact** scaricabile direttamente dall'interfaccia di GitHub.

---

## 📲 3. Come scaricare e installare l'APK sul tuo smartphone

1. Apri il tuo repository su **GitHub**.
2. Clicca sulla scheda **Actions** in alto.
3. Clicca sull'ultima esecuzione del workflow **Build Android APK** (quella con la spunta verde ✅).
4. Scorri fino alla sezione in basso **Artifacts**.
5. Clicca su **FloraID-Android-Debug-APK** per scaricare lo zip contenente il file `FloraID-Debug.apk`.
6. Trasferisci il file `.apk` sul tuo smartphone Android (o scaricalo direttamente dal browser del telefono).
7. Tocca il file per installarlo. Se il sistema lo richiede, consenti temporaneamente l'installazione di app da fonti sconosciute per l'app File/Browser.

---

## 🌐 4. Connessione API / Backend dall'APK Mobile

Quando l'applicazione gira all'interno dell'APK Android nativo:
- L'app utilizza l'helper intelligente `src/services/apiConfig.ts`.
- È preconfigurata per puntare al server cloud di produzione FloraID.
- Puoi verificare o modificare l'URL del server in qualsiasi momento toccando il pulsante **"APK & Server"** nella barra di navigazione in alto dell'applicazione.

---

## 💻 5. Compilazione in Locale (Opzionale)

Se desideri eseguire o compilare il progetto sul tuo computer con **Android Studio**:
```bash
# 1. Installa dipendenze
npm install

# 2. Compila la web app e sincronizza gli asset Android
npm run build:android

# 3. Apri il progetto in Android Studio
npx cap open android
```
Oppure compila direttamente da riga di comando:
```bash
cd android
./gradlew assembleDebug
```
L'APK generato si troverà in:
`android/app/build/outputs/apk/debug/app-debug.apk`
