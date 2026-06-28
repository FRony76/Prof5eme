export async function downscaleToResult(source, maxDim = 1600, quality = 0.8) {
  let drawable;
  if (source instanceof HTMLVideoElement) {
    drawable = source;
  } else if (typeof createImageBitmap !== "undefined") {
    drawable = await createImageBitmap(source);
  } else {
    drawable = await new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(source);
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image illisible.")); };
      img.src = url;
    });
  }
  let w = drawable.videoWidth ?? drawable.width;
  let h = drawable.videoHeight ?? drawable.height;
  if (w > maxDim || h > maxDim) {
    const r = maxDim / Math.max(w, h);
    w = Math.round(w * r);
    h = Math.round(h * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(drawable, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, base64: dataUrl.split(",")[1], mediaType: "image/jpeg" };
}
