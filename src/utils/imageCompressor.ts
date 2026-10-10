/**
 * FloraID Image Compression Utility
 * Robust client-side compression to ensure lightning-fast uploads (< 250KB)
 * and prevent timeouts or Failed to fetch errors on mobile and web.
 */

export async function compressImage(
  imageSource: string | File | Blob,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  // Method 1: Use modern createImageBitmap if source is File or Blob (fastest and zero CORS issues)
  if (typeof window !== "undefined" && typeof createImageBitmap === "function" && typeof imageSource !== "string") {
    try {
      const bitmap = await createImageBitmap(imageSource);
      let { width, height } = bitmap;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
        return canvas.toDataURL("image/jpeg", quality);
      }
      bitmap.close();
    } catch {
      // Fallback to HTMLImageElement
    }
  }

  // Method 2: HTMLImageElement pipeline
  return new Promise((resolve) => {
    let srcUrl = "";
    let isObjectUrl = false;

    if (typeof imageSource === "string") {
      srcUrl = imageSource;
    } else {
      try {
        srcUrl = URL.createObjectURL(imageSource);
        isObjectUrl = true;
      } catch {
        // Fallback to FileReader
      }
    }

    const cleanup = () => {
      if (isObjectUrl && srcUrl) {
        URL.revokeObjectURL(srcUrl);
      }
    };

    const processImg = (img: HTMLImageElement) => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          cleanup();
          resolve(typeof imageSource === "string" ? imageSource : "");
          return;
        }

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          resolve(typeof imageSource === "string" ? imageSource : "");
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(img, 0, 0, width, height);
        cleanup();
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } catch {
        cleanup();
        resolve(typeof imageSource === "string" ? imageSource : "");
      }
    };

    const img = new Image();
    // NEVER set crossOrigin on blob: or data: URIs as it causes security exceptions in Chromium/WebKit
    if (srcUrl.startsWith("http://") || srcUrl.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => processImg(img);
    img.onerror = () => {
      cleanup();
      // If object URL failed, try FileReader as last resort
      if (typeof imageSource !== "string") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fallbackData = (e.target?.result as string) || "";
          resolve(fallbackData);
        };
        reader.onerror = () => resolve("");
        reader.readAsDataURL(imageSource);
      } else {
        resolve(imageSource);
      }
    };

    if (srcUrl) {
      img.src = srcUrl;
    } else if (typeof imageSource !== "string") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = (e.target?.result as string) || "";
        img.src = result;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(imageSource);
    }
  });
}
