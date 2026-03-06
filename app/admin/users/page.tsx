"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  points: number;
  stamp_count: number;
  created_at: string;
};

type PointModal = {
  user: Profile;
  value: string;
  mode: "add" | "subtract";
  saving: boolean;
};

type StampModal = {
  user: Profile;
  value: string;
  mode: "add" | "subtract";
  saving: boolean;
};

type EditModal = {
  user: Profile;
  username: string;
  email: string;
  phone: string;
  saving: boolean;
};

const MAX_STAMPS = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<PointModal | null>(null);
  const [stampModal, setStampModal] = useState<StampModal | null>(null);
  const [editModal, setEditModal] = useState<EditModal | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, email, phone, isAdmin, points, stamp_count, created_at")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setUsers(data ?? []);
    setLoading(false);
  };

  const toggleAdmin = async (user: Profile) => {
    setTogglingId(user.id);
    const { error } = await supabase.from("profiles").update({ isAdmin: !user.isAdmin }).eq("id", user.id);
    if (!error) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u));
    setTogglingId(null);
  };

  const openModal = (user: Profile, mode: "add" | "subtract") => setModal({ user, value: "", mode, saving: false });

  const applyPoints = async () => {
    if (!modal) return;
    const amount = parseInt(modal.value);
    if (isNaN(amount) || amount <= 0) return;
    setModal((m) => m ? { ...m, saving: true } : null);
    const newPoints = modal.mode === "add"
      ? (modal.user.points ?? 0) + amount
      : Math.max(0, (modal.user.points ?? 0) - amount);
    const { error } = await supabase.from("profiles").update({ points: newPoints }).eq("id", modal.user.id);
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === modal.user.id ? { ...u, points: newPoints } : u));
      setModal(null);
    } else setModal((m) => m ? { ...m, saving: false } : null);
  };

  const openStampModal = (user: Profile, mode: "add" | "subtract") => setStampModal({ user, value: "", mode, saving: false });

  const applyStamps = async () => {
    if (!stampModal) return;
    const amount = parseInt(stampModal.value);
    if (isNaN(amount) || amount <= 0) return;
    setStampModal((m) => m ? { ...m, saving: true } : null);
    const newStamps = stampModal.mode === "add"
      ? Math.min(MAX_STAMPS, (stampModal.user.stamp_count ?? 0) + amount)
      : Math.max(0, (stampModal.user.stamp_count ?? 0) - amount);
    const { error } = await supabase.from("profiles").update({ stamp_count: newStamps }).eq("id", stampModal.user.id);
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === stampModal.user.id ? { ...u, stamp_count: newStamps } : u));
      setStampModal(null);
    } else setStampModal((m) => m ? { ...m, saving: false } : null);
  };

  const openEditModal = (user: Profile) => setEditModal({
    user, username: user.username ?? "", email: user.email ?? "", phone: user.phone ?? "", saving: false,
  });

  const applyEdit = async () => {
    if (!editModal) return;
    setEditModal((m) => m ? { ...m, saving: true } : null);
    const { error } = await supabase.from("profiles").update({
      username: editModal.username.trim(),
      email: editModal.email.trim(),
      phone: editModal.phone.trim(),
    }).eq("id", editModal.user.id);
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === editModal.user.id
        ? { ...u, username: editModal.username.trim(), email: editModal.email.trim(), phone: editModal.phone.trim() }
        : u
      ));
      setEditModal(null);
    } else setEditModal((m) => m ? { ...m, saving: false } : null);
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <div>
      <style>{`
        .page-title {
          font-family: 'Kanit', sans-serif;
          font-size: 22px; 
          color: #1a1a1a; margin-bottom: 24px;
        }

        .toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
        }

        .search-input {
          background: #fff; border: 1.5px solid #e8e8e8;
          padding: 10px 16px; font-family: 'Sarabun', sans-serif;
          font-size: 14px; color: #1a1a1a; outline: none; width: 280px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: #bbb; }
        .search-input:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); }

        .badge-count {
          background: #fff5f5; border: 1px solid #ffcdd2;
          color: #d32f2f; font-size: 12px; padding: 4px 12px;
          border-radius: 999px; font-family: 'Kanit', sans-serif;
        }

        .table-wrap {
          overflow-x: auto; border: 1px solid #efefef;
          background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        thead { background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        th {
          text-align: left; padding: 13px 18px;
          font-family: 'Kanit', sans-serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #bbb; white-space: nowrap;
        }
        td { padding: 13px 18px; border-bottom: 1px solid #f5f5f5; color: #666; white-space: nowrap; }
        tr:last-child td { border-bottom: none; }
        tbody tr { transition: background 0.12s; }
        tbody tr:hover { background: #fafafa; }

        .username-cell { color: #1a1a1a; font-weight: 600; }
        .num-cell { color: #ddd; font-size: 12px; }
        .points-cell { color: #1a1a1a; font-family: 'Kanit', sans-serif; font-weight: 700; font-size: 15px; }
        .stamp-val { color: #1a1a1a; font-family: 'Kanit', sans-serif; font-weight: 700; font-size: 15px; }

        .point-actions { display: flex; align-items: center; gap: 8px; }

        /* ── ปุ่ม +/- ใช้ outline แดง ── */
        .pt-btn {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1.5px solid #d32f2f; background: none;
          cursor: pointer; font-size: 15px; font-weight: 700; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          color: #d32f2f;
          transition: background 0.15s, transform 0.1s;
          font-family: 'Kanit', sans-serif;
        }
        .pt-btn:hover { background: #fff5f5; }
        .pt-btn:active { transform: scale(0.9); }

        /* ── Role toggle ── */
        .role-toggle {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 999px; font-size: 12px;
          font-family: 'Kanit', sans-serif; cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .role-toggle:disabled { opacity: 0.4; cursor: not-allowed; }
        .role-toggle:active:not(:disabled) { transform: scale(0.96); }

        /* admin = สีแดง solid */
        .role-toggle.is-admin {
          background: #d32f2f; color: #fff; border: 1px solid #d32f2f;
        }
        .role-toggle.is-admin:hover:not(:disabled) { background: #b71c1c; border-color: #b71c1c; }

        /* user = outline แดง */
        .role-toggle.is-user {
          background: none; color: #d32f2f; border: 1px solid #d32f2f;
        }
        .role-toggle.is-user:hover:not(:disabled) { background: #fff5f5; }

        /* ── Edit button = outline แดง ── */
        .edit-btn {
          padding: 5px 14px; font-size: 12px; font-family: 'Kanit', sans-serif;
          cursor: pointer; border: 1.5px solid #d32f2f; color: #d32f2f;
          background: none; font-weight: 600;
          transition: background 0.15s, transform 0.1s;
        }
        .edit-btn:hover { background: #fff5f5; }
        .edit-btn:active { transform: scale(0.96); }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px); z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-box {
          background: #fff; border: 1px solid #efefef;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          width: 100%; max-width: 400px;
          padding: 28px 24px; animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-title { font-family: 'Kanit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .modal-sub { font-size: 13px; color: #aaa; margin-bottom: 20px; }

        .modal-current {
          display: flex; align-items: center; background: #fafafa;
          border: 1px solid #f0f0f0; padding: 12px 16px; margin-bottom: 16px;
        }
        .modal-current-label { font-size: 13px; color: #aaa; }
        .modal-current-value {
          font-family: 'Kanit', sans-serif; font-size: 22px;
          font-weight: 700; color: #1a1a1a; margin-left: auto;
        }

        .modal-input-wrap {
          display: flex; align-items: center; margin-bottom: 16px;
          border: 1.5px solid #e8e8e8; overflow: hidden; transition: border-color 0.2s;
        }
        .modal-input-wrap:focus-within { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); }

        .modal-mode-tag {
          padding: 0 14px; height: 48px; display: flex; align-items: center;
          font-family: 'Kanit', sans-serif; font-size: 20px; font-weight: 700;
          color: #d32f2f; border-right: 1.5px solid #f0f0f0;
          background: #fff5f5; user-select: none;
        }

        .modal-input {
          flex: 1; background: none; border: none; padding: 0 14px; height: 48px;
          font-family: 'Kanit', sans-serif; font-size: 18px; color: #1a1a1a; outline: none;
        }
        .modal-input::placeholder { color: #ddd; }

        .modal-preview { font-size: 13px; color: #aaa; margin-bottom: 20px; min-height: 20px; }
        .modal-preview span { color: #1a1a1a; font-family: 'Kanit', sans-serif; font-weight: 600; }

        .edit-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .edit-label {
          font-size: 11px; font-family: 'Kanit', sans-serif; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: #bbb;
        }
        .edit-input {
          background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px;
          font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .edit-input:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }

        .modal-actions { display: flex; gap: 10px; }

        /* Cancel = outline แดง */
        .modal-cancel {
          flex: 1; padding: 12px; background: none;
          border: 1.5px solid #d32f2f; color: #d32f2f;
          font-family: 'Kanit', sans-serif; font-size: 14px;
          cursor: pointer; transition: background 0.2s;
        }
        .modal-cancel:hover { background: #fff5f5; }
        .modal-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Confirm = solid แดง */
        .modal-confirm {
          flex: 2; padding: 12px; border: none;
          background: #d32f2f; color: #fff;
          font-family: 'Kanit', sans-serif; font-size: 14px;
          font-weight: 600; letter-spacing: 0.06em;
          cursor: pointer; transition: background 0.2s;
        }
        .modal-confirm:hover { background: #b71c1c; }
        .modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

        .state-wrap { padding: 80px 0; text-align: center; color: #ccc; font-size: 14px; }
        .spinner {
          width: 28px; height: 28px; border: 3px solid #f0f0f0;
          border-top-color: #d32f2f; border-radius: 50%;
          animation: spin 0.8s linear infinite; margin: 0 auto 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mini-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle;
        }
      `}</style>

      <h1 className="page-title">Users Management</h1>

      <div className="toolbar">
        <input className="search-input" type="text" placeholder="Search username, email, phone..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {!loading && <span className="badge-count">{filtered.length} / {users.length} users</span>}
      </div>

      {loading && <div className="state-wrap"><div className="spinner" />Loading users...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Points</th>
                <th>Stamps</th>
                <th>Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "48px", color: "#ccc" }}>No users found</td></tr>
              ) : (
                filtered.map((user, i) => (
                  <tr key={user.id}>
                    <td className="num-cell">{i + 1}</td>
                    <td className="username-cell">{user.username || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td>{user.phone || "—"}</td>

                    <td>
                      <div className="point-actions">
                        <button className="pt-btn" onClick={() => openModal(user, "subtract")}>−</button>
                        <span className="points-cell">{(user.points ?? 0).toLocaleString()}</span>
                        <button className="pt-btn" onClick={() => openModal(user, "add")}>+</button>
                      </div>
                    </td>

                    <td>
                      <div className="point-actions">
                        <button className="pt-btn" onClick={() => openStampModal(user, "subtract")}>−</button>
                        <span className="stamp-val">{user.stamp_count ?? 0}<span style={{ color: "#bbb", fontWeight: 400, fontSize: 12 }}> /{MAX_STAMPS}</span></span>
                        <button className="pt-btn" onClick={() => openStampModal(user, "add")}>+</button>
                      </div>
                    </td>

                    <td>
                      <button className={`role-toggle ${user.isAdmin ? "is-admin" : "is-user"}`}
                        onClick={() => toggleAdmin(user)} disabled={togglingId === user.id}>
                        {togglingId === user.id
                          ? <span className="mini-spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                          : user.isAdmin ? "Admin" : "User"}
                      </button>
                    </td>

                    <td>
                      <button className="edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Point Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => !modal.saving && setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{modal.mode === "add" ? "Add Points" : "Subtract Points"}</h2>
            <p className="modal-sub">{modal.user.username}</p>
            <div className="modal-current">
              <span className="modal-current-label">Current points</span>
              <span className="modal-current-value">🪙 {(modal.user.points ?? 0).toLocaleString()}</span>
            </div>
            <div className="modal-input-wrap">
              <span className="modal-mode-tag">{modal.mode === "add" ? "+" : "−"}</span>
              <input className="modal-input" type="number" min="1" placeholder="0" value={modal.value}
                onChange={(e) => setModal((m) => m ? { ...m, value: e.target.value } : null)}
                autoFocus onKeyDown={(e) => e.key === "Enter" && applyPoints()} />
            </div>
            {modal.value && !isNaN(parseInt(modal.value)) && parseInt(modal.value) > 0 && (
              <p className="modal-preview">Result: <span>🪙 {modal.mode === "add"
                ? ((modal.user.points ?? 0) + parseInt(modal.value)).toLocaleString()
                : Math.max(0, (modal.user.points ?? 0) - parseInt(modal.value)).toLocaleString()}
              </span></p>
            )}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setModal(null)} disabled={modal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyPoints}
                disabled={modal.saving || !modal.value || isNaN(parseInt(modal.value)) || parseInt(modal.value) <= 0}>
                {modal.saving ? <span className="mini-spinner" /> : modal.mode === "add" ? "ADD POINTS" : "SUBTRACT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stamp Modal ── */}
      {stampModal && (
        <div className="modal-overlay" onClick={() => !stampModal.saving && setStampModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{stampModal.mode === "add" ? "Add Stamps" : "Subtract Stamps"}</h2>
            <p className="modal-sub">{stampModal.user.username}</p>
            <div className="modal-current">
              <span className="modal-current-label">Current stamps</span>
              <span className="modal-current-value">{stampModal.user.stamp_count ?? 0} / {MAX_STAMPS}</span>
            </div>
            <div className="modal-input-wrap">
              <span className="modal-mode-tag">{stampModal.mode === "add" ? "+" : "−"}</span>
              <input className="modal-input" type="number" min="1" placeholder="0" value={stampModal.value}
                onChange={(e) => setStampModal((m) => m ? { ...m, value: e.target.value } : null)}
                autoFocus onKeyDown={(e) => e.key === "Enter" && applyStamps()} />
            </div>
            {stampModal.value && !isNaN(parseInt(stampModal.value)) && parseInt(stampModal.value) > 0 && (
              <p className="modal-preview">Result: <span>
                {stampModal.mode === "add"
                  ? Math.min(MAX_STAMPS, (stampModal.user.stamp_count ?? 0) + parseInt(stampModal.value))
                  : Math.max(0, (stampModal.user.stamp_count ?? 0) - parseInt(stampModal.value))} / {MAX_STAMPS}
              </span></p>
            )}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setStampModal(null)} disabled={stampModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyStamps}
                disabled={stampModal.saving || !stampModal.value || isNaN(parseInt(stampModal.value)) || parseInt(stampModal.value) <= 0}>
                {stampModal.saving ? <span className="mini-spinner" /> : stampModal.mode === "add" ? "ADD STAMPS" : "SUBTRACT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => !editModal.saving && setEditModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit User</h2>
         
            <div className="edit-field">
              <label className="edit-label">Username</label>
              <input className="edit-input" type="text" value={editModal.username}
                onChange={(e) => setEditModal((m) => m ? { ...m, username: e.target.value } : null)} />
            </div>
            <div className="edit-field">
              <label className="edit-label">Email</label>
              <input disabled className="edit-input" type="email" value={editModal.email}
                onChange={(e) => setEditModal((m) => m ? { ...m, email: e.target.value } : null)} />
            </div>
            <div className="edit-field">
              <label className="edit-label">Phone</label>
              <input className="edit-input" type="tel" value={editModal.phone}
                onChange={(e) => setEditModal((m) => m ? { ...m, phone: e.target.value } : null)} />
            </div>
            <div className="modal-actions" style={{ marginTop: 8 }}>
              <button className="modal-cancel" onClick={() => setEditModal(null)} disabled={editModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyEdit}
                disabled={editModal.saving || !editModal.username.trim()}>
                {editModal.saving ? <span className="mini-spinner" /> : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}