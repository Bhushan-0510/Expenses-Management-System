import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Label, Select, TextInput } from "../components/Input.jsx";
import { fetchExpenses, updateExpense } from "../services/expenses.js";
import { fetchCategories } from "../services/categories.js";

export default function ExpenseHistoryPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
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
    loadData();
  }, []);

  const filtered = expenses.filter((exp) => {
    if (categoryFilter && exp.categoryId?._id !== categoryFilter) return false;
    const d = new Date(exp.date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {editing && (
        <Card title="Edit expense">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="editAmount">Amount</Label>
                <TextInput
                  id="editAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editing.amount}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, amount: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDate">Date</Label>
                <TextInput
                  id="editDate"
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select
                  id="editCategory"
                  value={editing.categoryId || ""}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, categoryId: e.target.value || null }))
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
                <Label htmlFor="editNote">Note</Label><br />
                <TextInput
                  id="editNote"
                  type="text"
                  value={editing.note}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="px-4"
                onClick={async () => {
                  try {
                    setError("");
                    await updateExpense(editing._id, {
                      amount: Number(editing.amount),
                      note: editing.note,
                      date: new Date(editing.date).toISOString(),
                      categoryId: editing.categoryId || undefined
                    });
                    setEditing(null);
                    await loadData();
                  } catch (err) {
                    setError(err.message || "Unable to update expense");
                  }
                }}
              >
                Save changes
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
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="historyCategory">Category</Label>
            <Select
              id="historyCategory"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="from">From</Label>
            <TextInput
              id="from"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="to">To</Label>
            <TextInput
              id="to"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" className="px-4" onClick={loadData} disabled={loading}>
              Refresh
            </Button>
            <Button
              type="button"
              className="px-4 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
              onClick={() => {
                setCategoryFilter("");
                setFromDate("");
                setToDate("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </Card>

      <Card title="All expenses">
        {loading && <p className="text-xs text-slate-500">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-xs text-slate-500">No expenses matching the current filters.</p>
        )}
        <div className="mt-2 divide-y divide-slate-100">
          {filtered.map((exp) => (
            <div key={exp._id} className="py-3 flex justify-between text-xs">
              <div>
                <p className="font-medium text-slate-900">
                  ₹{exp.amount.toFixed(2)}{" "}
                  <span className="text-slate-500">
                    · {exp.categoryId?.name || "Uncategorized"}
                  </span>
                </p>
                <p className="text-slate-500">{exp.note}</p>
              </div>
              <div className="text-right text-slate-400 flex flex-col items-end gap-1">
                <p>
                  {new Date(exp.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </p>
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
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

