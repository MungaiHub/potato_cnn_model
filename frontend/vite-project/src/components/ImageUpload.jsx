import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, Zap } from "lucide-react";
import api from "../services/api.js";

import LoadingSpinner from "./LoadingSpinner.jsx";

export default function ImageUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(selected.type)) {
      toast.error("Please upload a JPG or PNG image.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Max size is 5MB.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected) {
      handleFileChange({ target: { files: [selected] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Analyzing image...");
    setLoading(true);

    try {
      const res = await api.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss(toastId);
      toast.success("Disease detected successfully!");
      onResult(res.data);
    } catch (err) {
      toast.dismiss(toastId);
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-10 text-center transition hover:border-primary/60 hover:bg-primary/5"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mb-3 h-10 w-10 text-primary" />
        <p className="text-sm font-medium text-slate-800">
          Drag & drop a potato leaf or tuber image here
        </p>
        <p className="mt-1 text-xs text-slate-500">
          or click to browse from your phone gallery (JPG/PNG, max 5MB)
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="mt-4 text-xs"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <img
            src={previewUrl}
            alt="Selected potato sample"
            className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-40"
          />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-slate-800">
              Preview: {file?.name}
            </p>
            <p className="text-xs text-slate-500">
              When you click Detect Disease, Potato Guard will analyze this image using our
              CNN model trained on Nyandarua potato diseases.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Zap className="h-4 w-4" />
                {loading ? "Analyzing..." : "Upload & Detect"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
    </div>
  );
}

