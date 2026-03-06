"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  icon: string;
  title: string;
  lines: string[];
  link: string | null;
}

type EditModal = {
  contact: Contact;
  icon: string;
  title: string;
  lines: string;
  link: string;
  saving: boolean;
};

type AddModal = {
  icon: string;
  title: string;
  lines: string;
  link: string;
  saving: boolean;
};

type DeleteModal = {
  contact: Contact;
  confirming: boolean;
};

const ICON_LIST = Object.keys(LucideIcons).filter(
  (k) => typeof (LucideIcons as Record<string, unknown>)[k] === "function" && k !== "createLucideIcon"
);

const IconDropdown = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const matches = value ? ICON_LIST.filter((n) => n.toLowerCase().includes(value.toLowerCase())).slice(0, 12) : [];
  const SelectedIcon = value ? (LucideIcons as Record<string, unknown>)[value] as React.FC<{ size: number; color: string }> | undefined : undefined;
  return (
    <div className="form-field">
      <label className="form-label">Icon</label>
      <input className="form-input" type="text" placeholder="Search icon e.g. Phone, Mail..."
        value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (SelectedIcon
        ? <div className="icon-preview"><SelectedIcon size={18} color="#d32f2f" /><span>{value}</span></div>
        : <div className="icon-not-found">Icon "{value}" not found</div>
      )}
      {value && matches.length > 0 && !matches.every((m) => m === value) && (
        <div className="icon-dropdown">
          {matches.map((name) => {
            const Icon = (LucideIcons as Record<string, unknown>)[name] as React.FC<{ size: number }>;
            return (
              <div key={name} className="icon-option" onClick={() => onChange(name)}>
                <Icon size={16} />{name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<EditModal | null>(null);
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact").select("*").order("created_at", { ascending: true });
    if (error) setError(error.message);
    else setContacts(data ?? []);
    setLoading(false);
  };

  const openAddModal = () => setAddModal({ icon: "", title: "", lines: "", link: "", saving: false });

  const applyAdd = async () => {
    if (!addModal || !addModal.title.trim()) return;
    setAddModal((m) => m ? { ...m, saving: true } : null);
    const lines = addModal.lines.split("\n").map((l) => l.trim()).filter(Boolean);
    const { data, error } = await supabase.from("contact").insert({
      icon: addModal.icon.trim(), title: addModal.title.trim(), lines, link: addModal.link.trim() || null,
    }).select().single();
    if (!error && data) { setContacts((prev) => [...prev, data]); setAddModal(null); }
    else setAddModal((m) => m ? { ...m, saving: false } : null);
  };

  const openEditModal = (contact: Contact) => setEditModal({
    contact, icon: contact.icon ?? "", title: contact.title ?? "",
    lines: (contact.lines ?? []).join("\n"), link: contact.link ?? "", saving: false,
  });

  const applyEdit = async () => {
    if (!editModal) return;
    setEditModal((m) => m ? { ...m, saving: true } : null);
    const lines = editModal.lines.split("\n").map((l) => l.trim()).filter(Boolean);
    const { error } = await supabase.from("contact").update({
      icon: editModal.icon.trim(), title: editModal.title.trim(), lines, link: editModal.link.trim() || null,
    }).eq("id", editModal.contact.id);
    if (!error) {
      setContacts((prev) => prev.map((c) => c.id === editModal.contact.id
        ? { ...c, icon: editModal.icon.trim(), title: editModal.title.trim(), lines, link: editModal.link.trim() || null }
        : c
      ));
      setEditModal(null);
    } else setEditModal((m) => m ? { ...m, saving: false } : null);
  };

  const openDeleteModal = (contact: Contact) => setDeleteModal({ contact, confirming: false });

  const applyDelete = async () => {
    if (!deleteModal) return;
    setDeleteModal((m) => m ? { ...m, confirming: true } : null);
    const { error } = await supabase.from("contact").delete().eq("id", deleteModal.contact.id);
    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== deleteModal.contact.id));
      setDeleteModal(null);
    } else setDeleteModal((m) => m ? { ...m, confirming: false } : null);
  };

  const renderIcon = (name: string) => {
    const Icon = (LucideIcons as Record<string, unknown>)[name] as React.FC<{ size: number }> | undefined;
    return Icon ? <Icon size={16} /> : null;
  };

  return (
    <div>
      <style>{`
        .page-title { font-family: 'Kanit', sans-serif; font-size: 22px; color: #1a1a1a; margin-bottom: 8px; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
        .add-btn { padding: 10px 20px; background: #d32f2f; border: none; color: #fff; font-family: 'Kanit', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #b71c1c; }
        .badge-count { background: #fff5f5; border: 1px solid #ffcdd2; color: #d32f2f; font-size: 12px; padding: 4px 12px; border-radius: 999px; font-family: 'Kanit', sans-serif; }

        .table-wrap { overflow-x: auto; border: 1px solid #efefef; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        thead { background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        th { text-align: left; padding: 13px 18px; font-family: 'Kanit', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
        td { padding: 13px 18px; border-bottom: 1px solid #f5f5f5; color: #666; }
        tr:last-child td { border-bottom: none; }
        tbody tr { transition: background 0.12s; }
        tbody tr:hover { background: #fafafa; }
        .icon-cell { display: flex; align-items: center; gap: 8px; color: #1a1a1a; font-family: 'Kanit', sans-serif; font-size: 13px; font-weight: 600; }
        .title-cell { color: #1a1a1a; font-weight: 600; font-family: 'Kanit', sans-serif; }
        .lines-cell { font-size: 13px; color: #888; line-height: 1.6; }
        .link-cell { font-size: 12px; color: #aaa; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .action-btns { display: flex; gap: 6px; }
        .edit-btn { padding: 5px 12px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: 1.5px solid #d32f2f; color: #d32f2f; background: none; transition: background 0.15s; white-space: nowrap; }
        .edit-btn:hover { background: #fff5f5; }
        .del-btn { padding: 5px 12px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: none; background: #d32f2f; color: #fff; transition: background 0.15s; white-space: nowrap; }
        .del-btn:hover { background: #b71c1c; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #fff; border: 1px solid #efefef; box-shadow: 0 8px 40px rgba(0,0,0,0.12); width: 100%; max-width: 440px; padding: 28px 24px; animation: slideUp 0.2s ease; max-height: 90vh; overflow-y: auto; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-family: 'Kanit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }

        .form-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; position: relative; }
        .form-label { font-size: 11px; font-family: 'Kanit', sans-serif; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; }
        .form-hint { font-size: 11px; color: #ccc; margin-top: 3px; }
        .form-input { background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .form-input:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }
        .form-textarea { background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; min-height: 80px; line-height: 1.6; }
        .form-textarea:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }
        .icon-preview { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: #fff5f5; border: 1px solid #ffcdd2; margin-top: 6px; }
        .icon-preview span { font-size: 12px; color: #d32f2f; font-family: 'Kanit', sans-serif; }
        .icon-not-found { font-size: 11px; color: #d32f2f; margin-top: 4px; }
        .icon-dropdown { border: 1px solid #e8e8e8; background: #fff; max-height: 200px; overflow-y: auto; margin-top: 2px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .icon-option { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; font-size: 13px; color: #333; transition: background 0.1s; }
        .icon-option:hover { background: #fff5f5; color: #d32f2f; }

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

      <h1 className="page-title">Contact</h1>

      <div className="toolbar">
        {!loading && <span className="badge-count">{contacts.length} items</span>}
        <button className="add-btn" onClick={openAddModal}>+ ADD CONTACT</button>
      </div>

      {loading && <div className="state-wrap"><div className="spinner" />Loading...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Lines</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "48px", color: "#ccc" }}>No contacts found</td></tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td><div className="icon-cell">{renderIcon(contact.icon)}{contact.icon || "—"}</div></td>
                    <td className="title-cell">{contact.title || "—"}</td>
                    <td className="lines-cell">{(contact.lines ?? []).map((line, i) => <div key={i}>{line}</div>)}</td>
                    <td className="link-cell">{contact.link || "—"}</td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" onClick={() => openEditModal(contact)}>Edit</button>
                        <button className="del-btn" onClick={() => openDeleteModal(contact)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Modal ── */}
      {addModal && (
        <div className="modal-overlay" onClick={() => !addModal.saving && setAddModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Contact</h2>
            <IconDropdown value={addModal.icon} onChange={(v) => setAddModal((m) => m ? { ...m, icon: v } : null)} />
            <div className="form-field">
              <label className="form-label">Title *</label>
              <input className="form-input" type="text" placeholder="e.g. Phone, Email"
                value={addModal.title} onChange={(e) => setAddModal((m) => m ? { ...m, title: e.target.value } : null)} />
            </div>
            <div className="form-field">
              <label className="form-label">Lines</label>
              <textarea className="form-textarea" placeholder={"line 1\nline 2"}
                value={addModal.lines} onChange={(e) => setAddModal((m) => m ? { ...m, lines: e.target.value } : null)} />
              <span className="form-hint">Each line = 1 item in array</span>
            </div>
            <div className="form-field">
              <label className="form-label">Link</label>
              <input className="form-input" type="text" placeholder="https:// or tel: or mailto:"
                value={addModal.link} onChange={(e) => setAddModal((m) => m ? { ...m, link: e.target.value } : null)} />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setAddModal(null)} disabled={addModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyAdd} disabled={addModal.saving || !addModal.title.trim()}>
                {addModal.saving ? <span className="mini-spinner" /> : "ADD CONTACT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => !editModal.saving && setEditModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Contact</h2>
            <IconDropdown value={editModal.icon} onChange={(v) => setEditModal((m) => m ? { ...m, icon: v } : null)} />
            <div className="form-field">
              <label className="form-label">Title *</label>
              <input className="form-input" type="text"
                value={editModal.title} onChange={(e) => setEditModal((m) => m ? { ...m, title: e.target.value } : null)} />
            </div>
            <div className="form-field">
              <label className="form-label">Lines</label>
              <textarea className="form-textarea" placeholder={"line 1\nline 2"}
                value={editModal.lines} onChange={(e) => setEditModal((m) => m ? { ...m, lines: e.target.value } : null)} />
              <span className="form-hint">Each line = 1 item in array</span>
            </div>
            <div className="form-field">
              <label className="form-label">Link</label>
              <input className="form-input" type="text" placeholder="https:// or tel: or mailto:"
                value={editModal.link} onChange={(e) => setEditModal((m) => m ? { ...m, link: e.target.value } : null)} />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditModal(null)} disabled={editModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyEdit} disabled={editModal.saving || !editModal.title.trim()}>
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
            <h2 className="modal-title">Delete Contact</h2>
        
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