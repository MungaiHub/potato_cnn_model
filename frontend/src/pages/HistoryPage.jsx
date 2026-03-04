import HistoryTable from "../components/HistoryTable.jsx";

export default function HistoryPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Detection history
        </h1>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Review previous AI detections, including image type, confidence, and dates.
        </p>
        <div className="mt-5">
          <HistoryTable />
        </div>
      </div>
    </div>
  );
}

