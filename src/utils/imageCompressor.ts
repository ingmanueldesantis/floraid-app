/**
 * FloraID Image Compression Utility
 * Compresses images client-side to ensure fast uploads and prevent LocalStorage quota overflow.
 */

export async function compressImage(
  imageSource: string | File | Blob,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a URL or base64 string
    const img = new Image();
    img.crossOrigin = "anonymous";

    const onLoad = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to original if canvas context unavailable
          if (typeof imageSource === "string") {
            resolve(imageSource);
          } else {
            reject(new Error("Canvas context non disponibile"));
          }
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Fallback gracefully
        if (typeof imageSource === "string") {
          resolve(imageSource);
        } else {
          reject(err);
        }
      }
    };

    const onError = (e: any) => {
      if (typeof imageSource === "string") {
        resolve(imageSource);
      } else {
        reject(new Error("Errore caricamento immagine per compressione"));
      }
    };

    img.onload = onLoad;
    img.onerror = onError;

    if (typeof imageSource === "string") {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error("Lettura file fallita"));
        }
      };
      reader.onerror = () => reject(new Error("Errore lettura file immagine"));
      reader.readAsDataURL(imageSource);
    }
  });
}
