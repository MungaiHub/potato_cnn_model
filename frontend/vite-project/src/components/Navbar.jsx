import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { History, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass =
  "text-sm font-medium text-slate-600 hover:text-primary transition-colors";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-lg font-bold text-primary">PG</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">Potato Guard</div>
              <div className="text-xs text-slate-500">
                Nyandarua Disease Detection
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>
            How it works
          </NavLink>
          <NavLink to="/diseases" className={navLinkClass}>
            Diseases
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
              >
                <History className="h-4 w-4" />
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <User className="h-4 w-4 text-primary" />
                <span>{user?.username}</span>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-primary"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
              >
                Get started
              </NavLink>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              How it works
            </NavLink>
            <NavLink
              to="/diseases"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Diseases
            </NavLink>
            <NavLink
              to="/about"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>

            <div className="mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <History className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="w-full rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

