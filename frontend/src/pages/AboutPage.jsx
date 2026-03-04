export default function AboutPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">About Potato Guard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Potato Guard is a full-stack web application designed for farmers in Nyandarua
          County, Kenya. It combines a convolutional neural network (CNN) model with
          practical agronomic guidance to help you protect your potato crops.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">What it does</h2>
            <p className="mt-2 text-xs text-slate-600">
              Potato Guard detects seven key potato diseases across leaf and tuber
              samples, provides chemical and management recommendations, and connects
              you to nearby verified agrovets using GPS.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">How it is built</h2>
            <p className="mt-2 text-xs text-slate-600">
              The backend is powered by FastAPI, MySQL, and TensorFlow, while the
              frontend uses React, Vite, Tailwind CSS, and modern UX patterns inspired
              by agricultural AI tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

