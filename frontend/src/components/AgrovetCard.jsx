import { MapPin, Phone } from "lucide-react";

export default function AgrovetCard({ agrovet }) {
  const phoneRaw = (agrovet.phone ?? "").toString().trim();
  const phoneForTel = phoneRaw.replace(/[^\d+]/g, "");
  const canCall = phoneForTel.length > 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{agrovet.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3 w-3 text-primary" />
          <span>
            {agrovet.ward}, {agrovet.constituency}
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Distance: <span className="font-semibold">{agrovet.distance} km</span>
        </p>
        {agrovet.town && (
          <p className="mt-1 text-xs text-slate-500">{agrovet.town}</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {canCall ? (
          <a
            href={`tel:${phoneForTel}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
          >
            <Phone className="h-3 w-3" />
            Call now
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500"
          >
            <Phone className="h-3 w-3" />
            No phone
          </button>
        )}
        {phoneRaw && <p className="text-[11px] text-slate-500">{phoneRaw}</p>}
      </div>
    </div>
  );
}

