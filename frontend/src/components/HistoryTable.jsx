import { useEffect, useState } from "react";
import { Calendar, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function HistoryTable() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const fetchHistory = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/history", {
        params: { page: targetPage, limit },
      });
      setItems(res.data.items);
      setTotal(res.data.total);
      setPage(res.data.page);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this detection?")) return;
    const toastId = toast.loading("Deleting detection...");
    try {
      await api.delete(`/history/${id}`);
      toast.dismiss(toastId);
      toast.success("Detection deleted.");
      fetchHistory(page);
    } catch {
      toast.dismiss(toastId);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading && !items.length) return <LoadingSpinner />;

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No detections yet. Start by uploading an image from your dashboard.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Disease</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date
                </span>
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setPreview(item.image_path)}
                    className="group relative inline-block"
                  >
                    <img
                      src={item.image_path}
                      alt={item.predicted_disease}
                      className="h-14 w-20 rounded-lg object-cover"
                    />
                    <span className="absolute inset-0 rounded-lg bg-black/20 opacity-0 transition group-hover:opacity-100" />
                  </button>
                </td>
                <td className="px-4 py-3 font-medium">{item.predicted_disease}</td>
                <td className="px-4 py-3">{item.confidence.toFixed(2)}%</td>
                <td className="px-4 py-3 capitalize">{item.image_type}</td>
                <td className="px-4 py-3">
                  {new Date(item.detection_date).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPreview(item.image_path)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <button onClick={() => setPreview(item.image_path)}>
              <img
                src={item.image_path}
                alt={item.predicted_disease}
                className="h-20 w-24 rounded-lg object-cover"
              />
            </button>
            <div className="flex flex-1 flex-col justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-900">
                  {item.predicted_disease}
                </p>
                <p className="mt-1 text-slate-600">
                  {item.confidence.toFixed(2)}% • {item.image_type}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.detection_date).toLocaleString()}
                </p>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setPreview(item.image_path)}
                  className="flex-1 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 rounded-full border border-rose-200 px-3 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
        <p>
          Page {page} of {totalPages} • {total} detections
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => fetchHistory(page - 1)}
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchHistory(page + 1)}
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="max-h-full max-w-lg overflow-hidden rounded-2xl bg-black">
            <img
              src={preview}
              alt="Detection preview"
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

