"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, HelpCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { createFaq, updateFaq, deleteFaq } from "@/app/actions/faqs";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
}

const CATEGORIES = [
  "General",
  "Wall Art & Murals",
  "Resin & Keepsakes",
  "Sketches & Portraits",
  "Canvas Paintings",
  "Shipping & Transit",
  "Commissions & Orders",
];

export function AdminFaqsManager({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setOrder(0);
    setIsPublished(true);
    setEditingId(null);
    setIsCreating(false);
  };

  const startEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setOrder(faq.order);
    setIsPublished(faq.isPublished);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setFeedback({ text: "Question and Answer cannot be empty.", error: true });
      return;
    }

    setLoading(true);
    setFeedback(null);

    if (editingId) {
      // Update
      const res = await updateFaq(editingId, {
        question: question.trim(),
        answer: answer.trim(),
        category,
        order: Number(order),
        isPublished,
      });

      if (res.success && res.data) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingId ? (res.data as unknown as FaqItem) : f))
        );
        setFeedback({ text: "FAQ updated successfully!" });
        resetForm();
      } else {
        setFeedback({ text: res.error || "Failed to update FAQ", error: true });
      }
    } else {
      // Create
      const res = await createFaq({
        question: question.trim(),
        answer: answer.trim(),
        category,
        order: Number(order),
        isPublished,
      });

      if (res.success && res.data) {
        setFaqs((prev) => [res.data as unknown as FaqItem, ...prev]);
        setFeedback({ text: "New FAQ created successfully!" });
        resetForm();
      } else {
        setFeedback({ text: res.error || "Failed to create FAQ", error: true });
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setLoading(true);
    const res = await deleteFaq(id);
    if (res.success) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setFeedback({ text: "FAQ deleted." });
    } else {
      setFeedback({ text: res.error || "Failed to delete FAQ", error: true });
    }
    setLoading(false);
  };

  const togglePublish = async (faq: FaqItem) => {
    const newStatus = !faq.isPublished;
    const res = await updateFaq(faq.id, { isPublished: newStatus });
    if (res.success) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, isPublished: newStatus } : f))
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-linen/10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-terra block mb-1">
            ✦ Storefront Knowledge Base
          </span>
          <h1 className="font-serif text-3xl font-bold text-linen">
            Manage <em className="italic text-terra-pale font-normal">FAQs</em>
          </h1>
          <p className="text-xs text-linen/60 mt-1 font-sans">
            Curate questions and answers displayed across the Shop, Commission, and Home pages.
          </p>
        </div>

        <button
          onClick={() => {
            if (isCreating) resetForm();
            else {
              resetForm();
              setIsCreating(true);
            }
          }}
          className="btn-primary py-2.5 px-5 text-xs font-bold tracking-wider uppercase flex items-center gap-2 w-fit cursor-pointer"
        >
          {isCreating ? <X size={14} /> : <Plus size={14} />}
          <span>{isCreating ? "Close Form" : "Add New FAQ"}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 border text-xs flex items-center justify-between ${
            feedback.error
              ? "bg-red-950/40 border-red-500/50 text-red-200"
              : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* FAQ Editor Form */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          className="p-6 bg-[#251810] border-1.5 border-terra/40 text-linen space-y-4 animate-fadeIn shadow-lg"
        >
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-terra-pale pb-2 border-b border-linen/10">
            <HelpCircle size={15} />
            <span>{editingId ? "Edit FAQ Item" : "Create New FAQ Item"}</span>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
              Question *
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How does Wedding Varmala flower preservation work?"
              className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
              Answer *
            </label>
            <textarea
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a detailed, helpful answer for clients..."
              className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Display Order (Priority)
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-xs text-linen/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="accent-terra w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">Published on Storefront</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-linen/10">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-linen/60 hover:text-linen"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 text-xs font-bold tracking-wider uppercase"
            >
              {loading ? "Saving..." : editingId ? "Update FAQ" : "Save FAQ"}
            </button>
          </div>
        </form>
      )}

      {/* FAQs Table List */}
      <div className="border border-linen/15 bg-[#1C1410] overflow-hidden shadow-md">
        <div className="p-4 border-b border-linen/10 bg-[#251810] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-linen/80">
            FAQ Questions ({faqs.length})
          </span>
          <span className="text-[10px] text-linen/50 font-mono">
            {faqs.filter((f) => f.isPublished).length} Published · {faqs.filter((f) => !f.isPublished).length} Hidden
          </span>
        </div>

        {faqs.length === 0 ? (
          <div className="p-12 text-center text-linen/40 text-xs">
            No FAQs recorded yet. Click &ldquo;Add New FAQ&rdquo; above to create your first entry.
          </div>
        ) : (
          <div className="divide-y divide-linen/10">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 hover:bg-linen/[0.02] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 bg-terra/20 text-terra-pale border border-terra/40">
                      {faq.category}
                    </span>
                    <span className="text-[10px] font-mono text-linen/40">
                      Order: {faq.order}
                    </span>
                    {!faq.isPublished && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-red-900/40 text-red-300 border border-red-700/50">
                        Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-linen mt-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-linen/75 font-sans leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => togglePublish(faq)}
                    title={faq.isPublished ? "Hide on storefront" : "Publish on storefront"}
                    className={`p-2 border text-xs transition-colors cursor-pointer ${
                      faq.isPublished
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
                        : "border-linen/20 text-linen/40 hover:text-linen"
                    }`}
                  >
                    {faq.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  <button
                    onClick={() => startEdit(faq)}
                    title="Edit FAQ"
                    className="p-2 border border-linen/20 text-linen/70 hover:text-terra hover:border-terra bg-[#18100C] transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
                    title="Delete FAQ"
                    className="p-2 border border-red-500/30 text-red-400 hover:bg-red-950/40 hover:border-red-500 bg-[#18100C] transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
