export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} Potato Guard. Built for farmers in Nyandarua
          County, Kenya.
        </p>
        <p className="flex gap-4">
          <span>Potato plant disease detection and advisory system</span>
        </p>
      </div>
    </footer>
  );
}

