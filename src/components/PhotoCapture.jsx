import { useState, useRef, useEffect } from "react";
import { downscaleToResult } from "../lib/image.js";

export default function PhotoCapture({ photo, setPhoto, color }) {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camActive, setCamActive] = useState(false);
  const [error, setError] = useState("");

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  useEffect(() => () => stopStream(), []);

  const openCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Caméra indisponible sur ce navigateur, choisis un fichier.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCamActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setError("Caméra refusée ou indisponible, choisis un fichier.");
    }
  };

  const capture = async () => {
    if (!videoRef.current) return;
    try {
      const result = await downscaleToResult(videoRef.current);
      stopStream();
      setCamActive(false);
      setPhoto(result);
    } catch {
      setError("Erreur de capture, réessaie.");
    }
  };

  const cancelCamera = () => {
    stopStream();
    setCamActive(false);
    setError("");
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choisis un fichier image."); return; }
    setError("");
    try {
      const result = await downscaleToResult(file);
      setPhoto(result);
    } catch {
      setError("Impossible de lire cette image, réessaie.");
    }
  };

  if (photo) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ border: `1.5px solid ${color}`, borderRadius: 8, padding: 8, display: "inline-block", background: "white" }}>
          <img src={photo.dataUrl} alt="Ta réponse en photo" style={{ maxHeight: 180, maxWidth: "100%", objectFit: "contain", borderRadius: 4, display: "block" }} />
        </div>
        <div>
          <button onClick={() => setPhoto(null)}
            style={{ marginTop: 8, padding: "7px 14px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            ✕ Reprendre la photo
          </button>
        </div>
      </div>
    );
  }

  if (camActive) {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ border: `1.5px solid ${color}`, borderRadius: 8, overflow: "hidden", background: "#000", marginBottom: 8 }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width: "100%", maxHeight: 280, display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={cancelCamera}
            style={{ padding: "9px 16px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            Annuler
          </button>
          <button onClick={capture}
            style={{ flex: 1, padding: "9px", background: color, border: "none", borderRadius: 8, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            📸 Capturer
          </button>
        </div>
        {error && <p style={{ color: "#A32D2D", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={openCamera}
          style={{ flex: 1, padding: "14px 10px", background: "white", border: `1.5px dashed ${color}`, borderRadius: 8, color, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          📷 Caméra en direct
        </button>
        <button onClick={() => inputRef.current?.click()}
          style={{ flex: 1, padding: "14px 10px", background: "white", border: "1.5px dashed #D1D5DB", borderRadius: 8, color: "#6B7280", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          📁 Choisir un fichier
        </button>
      </div>
      {error && <p style={{ color: "#A32D2D", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}
    </div>
  );
}
