import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { fetchExpenses, updateExpense, deleteExpense } from "../services/expenses.js";
import { Label, TextInput, Select } from "../components/Input.jsx";
import { fetchCategories } from "../services/categories.js";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [expData, catData] = await Promise.all([fetchExpenses(), fetchCategories()]);
      setExpenses(expData || []);
      setCategories(catData || []);
    } catch (err) {
      setError(err.message || "Unable to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await load();
    };
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const { totalThisMonth, recent, byCategory } = useMemo(() => {
    const byMonth = {};
    const categories = {};

    for (const exp of expenses) {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!byMonth[key]) byMonth[key] = 0;
      byMonth[key] += exp.amount;

      const catName = exp.categoryId?.name || "Uncategorized";
      if (!categories[catName]) categories[catName] = 0;
      categories[catName] += exp.amount;
    }

    const total = byMonth[currentMonthKey] || 0;
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const categoryEntries = Object.entries(categories)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalThisMonth: total,
      recent: recentExpenses,
      byCategory: categoryEntries
    };
  }, [expenses, currentMonthKey]);

  return (
    <div className="space-y-4">
      {editing && (
        <Card title="Edit transaction" className="border-slate-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="dashEditAmount">Amount</Label>
                <TextInput
                  id="dashEditAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editing.amount}
                  onChange={(e) => setEditing((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dashEditDate">Date</Label>
                <TextInput
                  id="dashEditDate"
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dashEditCategory">Category</Label>
                <Select
                  id="dashEditCategory"
                  value={editing.categoryId || ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, categoryId: e.target.value || "" }))
                  }
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="dashEditNote">Note</Label>
                <TextInput
                  id="dashEditNote"
                  type="text"
                  value={editing.note}
                  onChange={(e) => setEditing((p) => ({ ...p, note: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="px-4"
                disabled={saving}
                onClick={async () => {
                  try {
                    setSaving(true);
                    setError("");
                    await updateExpense(editing._id, {
                      amount: Number(editing.amount),
                      note: editing.note,
                      date: new Date(editing.date).toISOString(),
                      categoryId: editing.categoryId || undefined
                    });
                    setEditing(null);
                    await load();
                  } catch (err) {
                    setError(err.message || "Unable to update transaction");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                className="px-4 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total spent this month
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              ₹{totalThisMonth.toFixed(2)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>
              {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
            </p>
            <p>{expenses.length} recorded expenses</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="By category" className="md:col-span-2">
          {byCategory.length === 0 && (
            <p className="text-xs text-slate-500">No expenses recorded yet.</p>
          )}
          <ul className="space-y-2">
            {byCategory.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="text-xs text-slate-700">{item.name}</span>
                <span className="text-sm font-medium text-slate-900">₹{item.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent transactions">
          {recent.length === 0 && (
            <p className="text-xs text-slate-500">You&apos;ll see your 5 latest expenses here.</p>
          )}
          <ul className="space-y-2">
            {recent.map((exp) => (
              <li key={exp._id} className="flex justify-between gap-3 text-xs text-slate-700">
                <div>
                  <p className="font-medium text-slate-900">
                    ₹{exp.amount.toFixed(2)}{" "}
                    <span className="text-slate-500">· {exp.categoryId?.name || "Uncategorized"}</span>
                  </p>
                  <p className="text-slate-500">{exp.note}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <p className="text-slate-400">
                    {new Date(exp.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-[11px] text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline"
                      onClick={() =>
                        setEditing({
                          _id: exp._id,
                          amount: exp.amount.toString(),
                          note: exp.note,
                          date: new Date(exp.date).toISOString().slice(0, 10),
                          categoryId: exp.categoryId?._id || ""
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-[11px] text-red-600 hover:text-red-700 underline-offset-2 hover:underline"
                      onClick={async () => {
                        const ok = window.confirm("Delete this transaction?");
                        if (!ok) return;
                        try {
                          setError("");
                          await deleteExpense(exp._id);
                          await load();
                        } catch (err) {
                          setError(err.message || "Unable to delete transaction");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {error && (
        <p className="text-xs text-red-600 pt-1">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-xs text-slate-500 pt-1">
          Loading latest data...
        </p>
      )}
    </div>
  );
}

