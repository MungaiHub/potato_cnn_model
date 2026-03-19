import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import ImageUpload from "../components/ImageUpload.jsx";
import ResultCard from "../components/ResultCard.jsx";
import AgrovetCard from "../components/AgrovetCard.jsx";
import api from "../services/api.js";

export default function DashboardPage() {
    // Toggle GPS on/off
    const toggleGps = () => {
      if (gpsEnabled) {
        stopGps();
      } else {
        startGps();
        setGpsEnabled(true);
      }
    };
  const [result, setResult] = useState(null);
  const [agrovets, setAgrovets] = useState([]);
  const [loadingAgrovets, setLoadingAgrovets] = useState(false);
  const [lastCoords, setLastCoords] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  const watchIdRef = useRef(null);
  const fetchDebounceRef = useRef(null);

  // state used when the user is outside Nyandarua and we need a ward/constituency
  const [outsideMessage, setOutsideMessage] = useState(null);
  const [isOutsideNyandarua, setIsOutsideNyandarua] = useState(false);
  const [constituencies, setConstituencies] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsByConstituency, setWardsByConstituency] = useState({});
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const fetchNearestAgrovets = async (
    latitude,
    longitude,
    constituency,
    ward,
  ) => {
    setLoadingAgrovets(true);
    try {
      const params = { latitude, longitude };
      if (constituency) params.constituency = constituency;
      if (ward) params.ward = ward;

      const res = await api.get("/agrovets/nearest", {
        params,
      });

      setAgrovets(res.data);
      // clear any previous warning/form
      setOutsideMessage(null);
      setConstituencies([]);
      setWards([]);
      if (!res.data.length) {
        toast("No agrovets found near your location yet.");
      }
    } catch (err) {
      const data = err?.response?.data;
      // FastAPI wraps our custom object under `detail`
      const detail = data?.detail || data;
      if (err?.response?.status === 400 && detail?.message) {
        // user is outside county; show dropdowns
        setOutsideMessage(detail.message);
        setConstituencies(detail.constituencies || []);
        // If the backend provided a map we store it; otherwise just hold flat list
        if (detail.wards_by_constituency) {
          setWardsByConstituency(detail.wards_by_constituency);
          // if a constituency is already selected, populate accordingly
          if (selectedConstituency) {
            setWards(detail.wards_by_constituency[selectedConstituency] || []);
          } else {
            setWards([]);
          }
        } else {
          setWards(detail.wards || []);
        }
      }
      // other errors are handled globally by api.js
    } finally {
      setLoadingAgrovets(false);
    }
  };

  const stopGps = () => {
    if (watchIdRef.current !== null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (fetchDebounceRef.current) {
      clearTimeout(fetchDebounceRef.current);
      fetchDebounceRef.current = null;
    }
    setGpsEnabled(false);
  };

  const startGps = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    // Get an immediate fix, then keep tracking.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLastCoords({ latitude, longitude });
        fetchNearestAgrovets(latitude, longitude);
      },
      () => {
        toast.error("Unable to get your location. Please enable GPS permission.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
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
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={toggleGps}
              className={
                gpsEnabled
                  ? "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
                  : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              }
            >
              <MapPin className="h-4 w-4" />
              {gpsEnabled ? "GPS on" : "Turn on GPS"}
            </button>
            {lastCoords && (
              <p className="text-[11px] text-slate-500">
                Lat {lastCoords.latitude.toFixed(4)}, Lon {lastCoords.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div>
            <ImageUpload onResult={setResult} />
            <ResultCard result={result} onFindAgrovets={startGps} />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Nearest verified agrovets
            </h2>
            <p className="text-xs text-slate-500">
              Enable GPS to see the closest agrochemical stockists recommended for this
              area.
            </p>

            {/* show warning and dropdowns if user is outside the county */}
            {outsideMessage && (
              <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                <p>{outsideMessage}</p>
                <div className="mt-2 flex flex-col gap-2">
                  <select
                    value={selectedConstituency}
                    onChange={(e) => {
                      const cons = e.target.value;
                      setSelectedConstituency(cons);
                      if (wardsByConstituency && wardsByConstituency[cons]) {
                        setWards(wardsByConstituency[cons]);
                      } else {
                        setWards([]);
                      }
                      setSelectedWard("");
                    }}
                    className="rounded border p-2 text-xs"
                    // enabled when outside Nyandarua
                    disabled={false}
                  >
                    <option value="">Select constituency</option>
                    {constituencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    // enabled when outside Nyandarua
                    disabled={!wards.length}
                    className="rounded border p-2 text-xs disabled:opacity-50"
                  >
                    <option value="">Select ward</option>
                    {wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>

                  <button
                    // enabled when outside Nyandarua
                    disabled={!selectedWard || !selectedConstituency || !lastCoords}
                    onClick={() => {
                      if (lastCoords) {
                        fetchNearestAgrovets(
                          lastCoords.latitude,
                          lastCoords.longitude,
                          selectedConstituency,
                          selectedWard,
                        );
                      }
                    }}
                    className="mt-1 inline-flex items-center justify-center rounded bg-primary px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Search in ward
                  </button>
                </div>
              </div>
            )}

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

