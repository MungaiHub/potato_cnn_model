import { Link } from "react-router-dom";
import { Leaf, Package, Zap } from "lucide-react";
import { STATS } from "../utils/constants.js";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-14">
        <div className="max-w-xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
            <Zap className="h-3 w-3" />
            AI-Powered Potato Disease Detection
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Protect your Nyandarua potatoes with instant, accurate diagnosis.
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Potato Guard uses a trained CNN model to detect major potato leaf and tuber
            diseases in seconds, then connects you to nearby verified agrovets with the
            right chemicals and advice.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-400/40 hover:bg-primary-dark"
            >
              Start free detection
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-primary"
            >
              See how it works
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Farmers protected</p>
              <p className="text-lg font-semibold text-slate-900">
                {STATS.farmersServed}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Model accuracy</p>
              <p className="text-lg font-semibold text-slate-900">
                {STATS.accuracy}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Diseases detected</p>
              <p className="text-lg font-semibold text-slate-900">
                {STATS.diseases}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-200 via-emerald-100 to-slate-50 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-xl">
              <div className="rounded-2xl bg-slate-900/95 p-4 text-xs text-slate-100">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                    <Zap className="h-3 w-3" />
                    Live AI detection
                  </span>
                  <span className="text-[10px] text-slate-400">CNN model</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="h-28 rounded-xl bg-[url('https://images.pexels.com/photos/5409006/pexels-photo-5409006.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center" />
                    <p className="text-[11px] text-slate-300">
                      Sample potato leaf from Nyandarua field.
                    </p>
                  </div>
                  <div className="space-y-2 rounded-xl bg-slate-800/60 p-3">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-200">
                      Detection result
                    </p>
                    <p className="text-sm font-semibold text-emerald-300">
                      Late Blight (leaf)
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-slate-600">
                      <div className="h-1.5 w-[92%] rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-300">Confidence: 92.4%</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Leaf className="h-4 w-4" />
                    <p className="font-semibold">Leaf & tuber diseases</p>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    Detect Brown Rot, Soft Rot, Blights, Bacterial Wilt & more.
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Package className="h-4 w-4" />
                    <p className="font-semibold">Chemical guidance</p>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    Get safe, practical recommendations for Kenyan-approved products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

