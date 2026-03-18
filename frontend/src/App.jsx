import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AddExpensePage from "./pages/AddExpensePage.jsx";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { getToken } from "./services/auth.js";

function PrivateRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="add-expense" element={<AddExpensePage />} />
        <Route path="expenses" element={<ExpenseHistoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

