import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Label, TextInput, Select } from "../components/Input.jsx";
import { fetchCategories, createCategory } from "../services/categories.js";
import { addExpense } from "../services/expenses.js";

export default function AddExpensePage() {
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchCategories();
        if (mounted) setCategories(data || []);
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load categories");
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddCategoryInline = async () => {
    if (!newCategory.trim()) return;
    try {
      setError("");
      const created = await createCategory(newCategory.trim());
      setCategories((prev) => [...prev, created]);
      setCategoryId(created._id);
      setNewCategory("");
    } catch (err) {
      setError(err.message || "Unable to create category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        amount: Number(amount),
        note: note.trim(),
        date: new Date(date).toISOString()
      };
      if (categoryId) payload.categoryId = categoryId;

      await addExpense(payload);
      setMessage("Expense added.");
      setAmount("");
      setNote("");
      setCategoryId("");
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError(err.message || "Unable to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <TextInput
              id="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <TextInput
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
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
            <Label htmlFor="newCategory">Add new category</Label>
            <div className="flex gap-2">
              <TextInput
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Subscriptions"
              />
              <Button
                type="button"
                onClick={handleAddCategoryInline}
                className="shrink-0 px-3"
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="note">Note</Label>
          <TextInput
            id="note"
            type="text"
            required
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you spend on?"
          />
        </div>

        {message && <p className="text-xs text-emerald-700">{message}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save expense"}
        </Button>
      </form>
    </Card>
  );
}

