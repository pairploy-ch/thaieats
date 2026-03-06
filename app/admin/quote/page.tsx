"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Quote {
  id: string;
  en_text: string;
  dk_text: string;
}

type AddModal = { en_text: string; dk_text: string; saving: boolean };
type EditModal = { quote: Quote; en_text: string; dk_text: string; saving: boolean };
type DeleteModal = { quote: Quote; confirming: boolean };

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [editModal, setEditModal] = useState<EditModal | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);

  useEffect(() => { fetchQuotes(); }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("quote").select("*").order("id", { ascending: true });
    if (error) setError(error.message);
    else setQuotes(data ?? []);
    setLoading(false);
  };

  // ── Add ──
  const openAddModal = () => setAddModal({ en_text: "", dk_text: "", saving: false });

  const applyAdd = async () => {
    if (!addModal || !addModal.en_text.trim()) return;
    setAddModal((m) => m ? { ...m, saving: true } : null);
    const { data, error } = await supabase.from("quote").insert({
      en_text: addModal.en_text.trim(),
      dk_text: addModal.dk_text.trim(),
    }).select().single();
    if (!error && data) { setQuotes((prev) => [...prev, data]); setAddModal(null); }
    else setAddModal((m) => m ? { ...m, saving: false } : null);
  };

  // ── Edit ──
  const openEditModal = (quote: Quote) => setEditModal({
    quote, en_text: quote.en_text ?? "", dk_text: quote.dk_text ?? "", saving: false,
  });

  const applyEdit = async () => {
    if (!editModal) return;
    setEditModal((m) => m ? { ...m, saving: true } : null);
    const { error } = await supabase.from("quote").update({
      en_text: editModal.en_text.trim(),
      dk_text: editModal.dk_text.trim(),
    }).eq("id", editModal.quote.id);
    if (!error) {
      setQuotes((prev) => prev.map((q) => q.id === editModal.quote.id
        ? { ...q, en_text: editModal.en_text.trim(), dk_text: editModal.dk_text.trim() }
        : q
      ));
      setEditModal(null);
    } else setEditModal((m) => m ? { ...m, saving: false } : null);
  };

  // ── Delete ──
  const openDeleteModal = (quote: Quote) => setDeleteModal({ quote, confirming: false });

  const applyDelete = async () => {
    if (!deleteModal) return;
    setDeleteModal((m) => m ? { ...m, confirming: true } : null);
    const { error } = await supabase.from("quote").delete().eq("id", deleteModal.quote.id);
    if (!error) {
      setQuotes((prev) => prev.filter((q) => q.id !== deleteModal.quote.id));
      setDeleteModal(null);
    } else setDeleteModal((m) => m ? { ...m, confirming: false } : null);
  };

  return (
    <div>
      <style>{`
        .page-title { font-family: 'Kanit', sans-serif; font-size: 22px; color: #1a1a1a; margin-bottom: 24px; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
        .add-btn { padding: 10px 20px; background: #d32f2f; border: none; color: #fff; font-family: 'Kanit', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #b71c1c; }
        .badge-count { background: #fff5f5; border: 1px solid #ffcdd2; color: #d32f2f; font-size: 12px; padding: 4px 12px; border-radius: 999px; font-family: 'Kanit', sans-serif; }

        .quotes-list { display: flex; flex-direction: column; gap: 12px; }

        .quote-card { background: #fff; border: 1px solid #efefef; box-shadow: 0 1px 4px rgba(0,0,0,0.04); padding: 18px 20px; display: flex; align-items: flex-start; gap: 16px; transition: box-shadow 0.2s; }
        .quote-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

        .quote-num { font-family: 'Kanit', sans-serif; font-size: 13px; color: #ddd; min-width: 24px; padding-top: 2px; }

        .quote-body { flex: 1; min-width: 0; }
        .quote-en { font-family: 'Kanit', sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; line-height: 1.5; }
        .quote-dk { font-size: 13px; color: #aaa; line-height: 1.6; }

        .quote-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .edit-btn { padding: 5px 12px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: 1.5px solid #d32f2f; color: #d32f2f; background: none; transition: background 0.15s; }
        .edit-btn:hover { background: #fff5f5; }
        .del-btn { padding: 5px 12px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: none; background: #d32f2f; color: #fff; transition: background 0.15s; }
        .del-btn:hover { background: #b71c1c; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #fff; border: 1px solid #efefef; box-shadow: 0 8px 40px rgba(0,0,0,0.12); width: 100%; max-width: 480px; padding: 28px 24px; animation: slideUp 0.2s ease; max-height: 90vh; overflow-y: auto; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-family: 'Kanit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }

        .form-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .form-label { font-size: 11px; font-family: 'Kanit', sans-serif; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; }
        .form-textarea { background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; min-height: 90px; line-height: 1.7; }
        .form-textarea:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }

        .delete-warn { background: #fff5f5; border: 1px solid #ffcdd2; padding: 14px 16px; margin-bottom: 20px; font-size: 13px; color: #c62828; line-height: 1.6; }

        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .modal-cancel { flex: 1; padding: 12px; background: none; border: 1.5px solid #d32f2f; color: #d32f2f; font-family: 'Kanit', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .modal-cancel:hover { background: #fff5f5; }
        .modal-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
        .modal-confirm { flex: 2; padding: 12px; border: none; background: #d32f2f; color: #fff; font-family: 'Kanit', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; }
        .modal-confirm:hover { background: #b71c1c; }
        .modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

        .state-wrap { padding: 80px 0; text-align: center; color: #ccc; font-size: 14px; }
        .spinner { width: 28px; height: 28px; border: 3px solid #f0f0f0; border-top-color: #d32f2f; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mini-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }
      `}</style>

      <h1 className="page-title">Quotes</h1>

      <div className="toolbar">
        {!loading && <span className="badge-count">{quotes.length} quotes</span>}
        <button className="add-btn" onClick={openAddModal}>+ ADD QUOTE</button>
      </div>

      {loading && <div className="state-wrap"><div className="spinner" />Loading...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        quotes.length === 0
          ? <div className="state-wrap">No quotes yet</div>
          : (
            <div className="quotes-list">
              {quotes.map((quote, i) => (
                <div className="quote-card" key={quote.id}>
                  <span className="quote-num">{i + 1}</span>
                  <div className="quote-body">
                    <div className="quote-en">"{quote.en_text}"</div>
                    {quote.dk_text && <div className="quote-dk">"{quote.dk_text}"</div>}
                  </div>
                  <div className="quote-actions">
                    <button className="edit-btn" onClick={() => openEditModal(quote)}>Edit</button>
                    <button className="del-btn" onClick={() => openDeleteModal(quote)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {/* ── Add Modal ── */}
      {addModal && (
        <div className="modal-overlay" onClick={() => !addModal.saving && setAddModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Quote</h2>
            <div className="form-field">
              <label className="form-label">English Text *</label>
              <textarea className="form-textarea" placeholder="Quote in English..."
                value={addModal.en_text} onChange={(e) => setAddModal((m) => m ? { ...m, en_text: e.target.value } : null)} autoFocus />
            </div>
            <div className="form-field">
              <label className="form-label">Danish Text</label>
              <textarea className="form-textarea" placeholder="Quote in Danish..."
                value={addModal.dk_text} onChange={(e) => setAddModal((m) => m ? { ...m, dk_text: e.target.value } : null)} />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setAddModal(null)} disabled={addModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyAdd} disabled={addModal.saving || !addModal.en_text.trim()}>
                {addModal.saving ? <span className="mini-spinner" /> : "ADD QUOTE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => !editModal.saving && setEditModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Quote</h2>
            <div className="form-field">
              <label className="form-label">English Text *</label>
              <textarea className="form-textarea"
                value={editModal.en_text} onChange={(e) => setEditModal((m) => m ? { ...m, en_text: e.target.value } : null)} autoFocus />
            </div>
            <div className="form-field">
              <label className="form-label">Danish Text</label>
              <textarea className="form-textarea"
                value={editModal.dk_text} onChange={(e) => setEditModal((m) => m ? { ...m, dk_text: e.target.value } : null)} />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditModal(null)} disabled={editModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyEdit} disabled={editModal.saving || !editModal.en_text.trim()}>
                {editModal.saving ? <span className="mini-spinner" /> : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => !deleteModal.confirming && setDeleteModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Quote</h2>
         
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteModal(null)} disabled={deleteModal.confirming}>Cancel</button>
              <button className="modal-confirm" onClick={applyDelete} disabled={deleteModal.confirming}>
                {deleteModal.confirming ? <span className="mini-spinner" /> : "DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}