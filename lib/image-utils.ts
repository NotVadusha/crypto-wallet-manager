
export const AVATAR_MAX_SIZE = 192;

export const AVATAR_JPEG_QUALITY = 0.85;

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas not supported"));
      return;
    }

    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      let w = width;
      let h = height;

      if (width > AVATAR_MAX_SIZE || height > AVATAR_MAX_SIZE) {
        if (width >= height) {
          w = AVATAR_MAX_SIZE;
          h = Math.round((height / width) * AVATAR_MAX_SIZE);
        } else {
          h = AVATAR_MAX_SIZE;
          w = Math.round((width / height) * AVATAR_MAX_SIZE);
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      try {
        const dataUrl = canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY);
        resolve(dataUrl);
      } catch {
        reject(new Error("Failed to encode image"));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};
