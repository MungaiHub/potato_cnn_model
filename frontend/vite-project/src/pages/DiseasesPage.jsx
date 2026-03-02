import { AlertCircle, CheckCircle, Leaf, Package } from "lucide-react";
import { DISEASES } from "../utils/constants.js";

export default function DiseasesPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Potato diseases covered
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Potato Guard detects the most common leaf and tuber diseases that affect
              farmers in Nyandarua County.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DISEASES.map((disease) => {
            const isHealthy = disease.key.includes("healthy");
            const Icon = isHealthy ? CheckCircle : AlertCircle;

            return (
              <div
                key={disease.key}
                className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${
                          isHealthy ? "text-emerald-500" : "text-rose-500"
                        }`}
                      />
                      <h2 className="text-sm font-semibold text-slate-900">
                        {disease.name}
                      </h2>
                    </div>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      {disease.type === "leaf" ? (
                        <>
                          <Leaf className="h-3 w-3" /> Leaf disease
                        </>
                      ) : (
                        <>
                          <Package className="h-3 w-3" /> Tuber disease
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-600">{disease.symptoms}</p>
                <div className="mt-2">
                  <p className="text-[11px] font-semibold text-slate-700">
                    Common treatments:
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {disease.commonChemicals.map((chem) => (
                      <span
                        key={chem}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {chem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

