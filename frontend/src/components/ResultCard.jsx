import { AlertCircle, CheckCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResultCard({ result, onFindAgrovets }) {
  if (!result) return null;

  const isHealthy =
    result.disease?.toLowerCase().includes("healthy") ?? false;

  const Icon = isHealthy ? CheckCircle : AlertCircle;
  const badgeColor = isHealthy ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
  const barColor = isHealthy ? "bg-emerald-500" : "bg-rose-500";

  const rec = result.chemical_recommendations;

  return (
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${isHealthy ? "text-emerald-500" : "text-rose-500"}`} />
            <h2 className="text-lg font-semibold text-slate-900">
              {result.disease || "Unknown disease"}
            </h2>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
            >
              {result.image_type === "leaf" ? "Leaf" : "Tuber"} image
            </span>
            <span className="text-xs text-slate-500">
              Detection ID: #{result.detection_id}
            </span>
          </div>
        </div>

        <button
          onClick={onFindAgrovets}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 sm:mt-0"
        >
          <MapPin className="h-4 w-4" />
          Find nearest agrovets
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Model confidence</span>
          <span className="font-semibold text-slate-900">
            {result.confidence?.toFixed(2)}%
          </span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${Math.min(result.confidence ?? 0, 100)}%` }}
          />
        </div>
      </div>

      {rec && (
        <div className="mt-5 space-y-2 rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Recommended action
          </p>
          <p className="text-sm font-medium text-emerald-900">{rec.name}</p>
          <div className="flex flex-wrap gap-2">
            {rec.chemicals?.map((chem) => (
              <span
                key={chem}
                className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm"
              >
                {chem}
              </span>
            ))}
          </div>
          <div className="space-y-1 text-xs text-emerald-900">
            <p>
              <span className="font-semibold">Application:</span> {rec.application}
            </p>
            <p>
              <span className="font-semibold">Dosage:</span> {rec.dosage}
            </p>
            <p>
              <span className="font-semibold">Safety:</span> {rec.safety}
            </p>
          </div>
          <p className="text-xs text-emerald-800">{rec.description}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link
          to="/history"
          className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          View history
        </Link>
      </div>
    </div>
  );
}

