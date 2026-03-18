import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { clearToken } from "../services/auth.js";

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-10 container-lg">
        <div className="mb-4 flex gap-4 text-sm text-slate-600">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1 rounded-full border ${
                isActive ? "bg-slate-900 text-white border-slate-900" : "border-slate-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/add-expense"
            className={({ isActive }) =>
              `px-3 py-1 rounded-full border ${
                isActive ? "bg-slate-900 text-white border-slate-900" : "border-slate-200"
              }`
            }
          >
            Add Expense
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `px-3 py-1 rounded-full border ${
                isActive ? "bg-slate-900 text-white border-slate-900" : "border-slate-200"
              }`
            }
          >
            Expense History
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

