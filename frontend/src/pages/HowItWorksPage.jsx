export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Take photo",
      description:
        "Capture a clear photo of your potato leaf or tuber using your phone camera.",
    },
    {
      step: 2,
      title: "Upload image",
      description:
        "Drag and drop the image or tap to upload it to Potato Guard from your gallery.",
    },
    {
      step: 3,
      title: "AI analysis",
      description:
        "Our CNN model analyzes the image in seconds to detect any disease signs.",
    },
    {
      step: 4,
      title: "Get results",
      description:
        "See the predicted disease, confidence score, and tailored treatment guidance.",
    },
    {
      step: 5,
      title: "Find agrovets",
      description:
        "Use GPS to locate the nearest verified agrovet shops in Nyandarua with the right products.",
    },
  ];

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          How Potato Guard works
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Simple steps designed for busy farmers in Nyandarua County. All you need is a
          smartphone with a camera and internet.
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {s.step}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-1 text-xs text-slate-600">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

