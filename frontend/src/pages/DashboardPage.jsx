import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import ImageUpload from "../components/ImageUpload.jsx";
import ResultCard from "../components/ResultCard.jsx";
import AgrovetCard from "../components/AgrovetCard.jsx";
import api from "../services/api.js";

export default function DashboardPage() {
  const [result, setResult] = useState(null);
  const [agrovets, setAgrovets] = useState([]);
  const [loadingAgrovets, setLoadingAgrovets] = useState(false);

  const fetchNearestAgrovets = async (latitude, longitude) => {
    setLoadingAgrovets(true);
    try {
      const res = await api.get("/agrovets/nearest", {
        params: { latitude, longitude },
      });
      setAgrovets(res.data);
      if (!res.data.length) {
        toast("No agrovets found near your location yet.");
      }
    } catch {
      // handled globally
    } finally {
      setLoadingAgrovets(false);
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearestAgrovets(latitude, longitude);
        },
        () => {
          toast.error("Unable to get your location. Please enable GPS.");
        },
      );
    } else {
      toast.error("Geolocation not supported by your browser.");
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Detection dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Upload potato leaf or tuber images, view AI predictions, and locate nearby
              agrovets.
            </p>
          </div>
          <button
            onClick={getUserLocation}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <MapPin className="h-4 w-4 text-primary" />
            Find nearest agrovets
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div>
            <ImageUpload onResult={setResult} />
            <ResultCard result={result} onFindAgrovets={getUserLocation} />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Nearest verified agrovets
            </h2>
            <p className="text-xs text-slate-500">
              Enable GPS to see the closest agrochemical stockists recommended for this
              area.
            </p>
            {loadingAgrovets && (
              <p className="text-xs text-slate-500">Searching for agrovets near you…</p>
            )}
            {agrovets.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-1">
                {agrovets.map((agrovet) => (
                  <AgrovetCard key={agrovet.id} agrovet={agrovet} />
                ))}
              </div>
            ) : (
              !loadingAgrovets && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500">
                  No agrovets loaded yet. Click &quot;Find nearest agrovets&quot; to use your
                  GPS location.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

