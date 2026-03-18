import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth.js";
import logoSrc from "../images/logo.png";

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const initial =
    user?.email?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md overflow-hidden flex items-center justify-center">
            <img src={logoSrc} alt="HisabKitab" className="h-8 w-9 object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">HisabKitab</p>
            <p className="text-xs text-slate-500">Calm overview of your spending</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-900">{user.email}</p>
                <p className="text-[11px] text-slate-500">Signed in</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

