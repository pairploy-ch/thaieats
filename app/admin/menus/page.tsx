"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

type EditModal = {
  dish: Dish;
  name: string;
  description: string;
  price: string;
  currency: string;
  image: string;
  imageFile: File | null;
  imagePreview: string;
  saving: boolean;
};

type AddModal = {
  name: string;
  description: string;
  price: string;
  currency: string;
  image: string;
  imageFile: File | null;
  imagePreview: string;
  saving: boolean;
};

type DeleteModal = {
  dish: Dish;
  confirming: boolean;
};

const BUCKET = "menu";

export default function AdminMenusPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<EditModal | null>(null);
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);

  const addFileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDishes(); }, []);

  const fetchDishes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu").select("*").order("created_at", { ascending: true });
    if (error) setError(error.message);
    else setDishes(data ?? []);
    setLoading(false);
  };

  // ── Upload image to Supabase Storage ──
  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: false });
    if (error) { console.error(error); return null; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  };

  // ── Add ──
  const openAddModal = () => setAddModal({
    name: "", description: "", price: "", currency: "THB",
    image: "", imageFile: null, imagePreview: "", saving: false,
  });

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAddModal((m) => m ? { ...m, imageFile: file, imagePreview: preview } : null);
  };

  const applyAdd = async () => {
    if (!addModal || !addModal.name.trim() || !addModal.price) return;
    setAddModal((m) => m ? { ...m, saving: true } : null);

    let imageUrl = addModal.image;
    if (addModal.imageFile) {
      const uploaded = await uploadImage(addModal.imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const { data, error } = await supabase.from("menu").insert({
      name: addModal.name.trim(),
      description: addModal.description.trim(),
      price: parseFloat(addModal.price),
      currency: addModal.currency.trim() || "THB",
      image: imageUrl,
    }).select().single();

    if (!error && data) { setDishes((prev) => [...prev, data]); setAddModal(null); }
    else setAddModal((m) => m ? { ...m, saving: false } : null);
  };

  // ── Edit ──
  const openEditModal = (dish: Dish) => setEditModal({
    dish, name: dish.name ?? "", description: dish.description ?? "",
    price: dish.price?.toString() ?? "", currency: dish.currency ?? "THB",
    image: dish.image ?? "", imageFile: null, imagePreview: dish.image ?? "", saving: false,
  });

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setEditModal((m) => m ? { ...m, imageFile: file, imagePreview: preview } : null);
  };

  const applyEdit = async () => {
    if (!editModal) return;
    setEditModal((m) => m ? { ...m, saving: true } : null);

    let imageUrl = editModal.image;
    if (editModal.imageFile) {
      const uploaded = await uploadImage(editModal.imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const { error } = await supabase.from("menu").update({
      name: editModal.name.trim(),
      description: editModal.description.trim(),
      price: parseFloat(editModal.price),
      currency: editModal.currency.trim(),
      image: imageUrl,
    }).eq("id", editModal.dish.id);

    if (!error) {
      setDishes((prev) => prev.map((d) => d.id === editModal.dish.id
        ? { ...d, name: editModal.name.trim(), description: editModal.description.trim(), price: parseFloat(editModal.price), currency: editModal.currency.trim(), image: imageUrl }
        : d
      ));
      setEditModal(null);
    } else setEditModal((m) => m ? { ...m, saving: false } : null);
  };

  // ── Delete ──
  const openDeleteModal = (dish: Dish) => setDeleteModal({ dish, confirming: false });

  const applyDelete = async () => {
    if (!deleteModal) return;
    setDeleteModal((m) => m ? { ...m, confirming: true } : null);
    const { error } = await supabase.from("menu").delete().eq("id", deleteModal.dish.id);
    if (!error) {
      setDishes((prev) => prev.filter((d) => d.id !== deleteModal.dish.id));
      setDeleteModal(null);
    } else setDeleteModal((m) => m ? { ...m, confirming: false } : null);
  };

  const filtered = dishes.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <style>{`
        .page-title { font-family: 'Kanit', sans-serif; font-size: 22px; color: #1a1a1a; margin-bottom: 24px; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-input { background: #fff; border: 1.5px solid #e8e8e8; padding: 10px 16px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; width: 280px; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input::placeholder { color: #bbb; }
        .search-input:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); }
        .badge-count { background: #fff5f5; border: 1px solid #ffcdd2; color: #d32f2f; font-size: 12px; padding: 4px 12px; border-radius: 999px; font-family: 'Kanit', sans-serif; }
        .add-btn { padding: 10px 20px; background: #d32f2f; border: none; color: #fff; font-family: 'Kanit', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #b71c1c; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .dish-card { background: #fff; border: 1px solid #efefef; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; transition: box-shadow 0.2s; }
        .dish-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .dish-img-wrap { position: relative; width: 100%; height: 160px; background: #fafafa; }
        .dish-body { padding: 14px; }
        .dish-name { font-family: 'Kanit', sans-serif; font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dish-desc { font-size: 12px; color: #aaa; margin-bottom: 10px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.5; min-height: 36px; }
        .dish-price { font-family: 'Kanit', sans-serif; font-size: 16px; font-weight: 700; color: #d32f2f; margin-bottom: 12px; }
        .dish-actions { display: flex; gap: 8px; }
        .dish-edit-btn { flex: 1; padding: 7px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: 1.5px solid #d32f2f; color: #d32f2f; background: none; transition: background 0.15s; }
        .dish-edit-btn:hover { background: #fff5f5; }
        .dish-del-btn { flex: 1; padding: 7px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: none; background: #d32f2f; color: #fff; transition: background 0.15s; }
        .dish-del-btn:hover { background: #b71c1c; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #fff; border: 1px solid #efefef; box-shadow: 0 8px 40px rgba(0,0,0,0.12); width: 100%; max-width: 440px; padding: 28px 24px; animation: slideUp 0.2s ease; max-height: 90vh; overflow-y: auto; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-family: 'Kanit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }
        .form-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .form-label { font-size: 11px; font-family: 'Kanit', sans-serif; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; }
        .form-input { background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .form-input:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }
        .form-textarea { background: #fafafa; border: 1.5px solid #e8e8e8; padding: 10px 14px; font-family: 'Sarabun', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: vertical; min-height: 80px; }
        .form-textarea:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); background: #fff; }
        .price-row { display: flex; gap: 10px; }
        .price-row .form-field { flex: 2; margin-bottom: 0; }
        .price-row .form-field:last-child { flex: 1; }

        /* Upload zone */
        .upload-zone {
          border: 2px dashed #e8e8e8; padding: 20px; text-align: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
          margin-top: 4px;
        }
        .upload-zone:hover { border-color: #d32f2f; background: #fff5f5; }
        .upload-zone-text { font-size: 13px; color: #bbb; font-family: 'Sarabun', sans-serif; }
        .upload-zone-text span { color: #d32f2f; font-weight: 600; }

        .image-preview-wrap { position: relative; margin-top: 8px; width: 100%; height: 140px; border: 1px solid #f0f0f0; overflow: hidden; background: #fafafa; }
        .change-img-btn { position: absolute; bottom: 8px; right: 8px; padding: 5px 12px; background: rgba(0,0,0,0.55); color: #fff; border: none; font-size: 11px; font-family: 'Kanit', sans-serif; cursor: pointer; transition: background 0.2s; }
        .change-img-btn:hover { background: #d32f2f; }

        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .modal-cancel { flex: 1; padding: 12px; background: none; border: 1.5px solid #d32f2f; color: #d32f2f; font-family: 'Kanit', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .modal-cancel:hover { background: #fff5f5; }
        .modal-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
        .modal-confirm { flex: 2; padding: 12px; border: none; background: #d32f2f; color: #fff; font-family: 'Kanit', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s; }
        .modal-confirm:hover { background: #b71c1c; }
        .modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
        .delete-warn { background: #fff5f5; border: 1px solid #ffcdd2; padding: 14px 16px; margin-bottom: 20px; font-size: 13px; color: #c62828; line-height: 1.6; }

        .state-wrap { padding: 80px 0; text-align: center; color: #ccc; font-size: 14px; }
        .spinner { width: 28px; height: 28px; border: 3px solid #f0f0f0; border-top-color: #d32f2f; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mini-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }
      `}</style>

      <h1 className="page-title">Menus Management</h1>

      <div className="toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input className="search-input" type="text" placeholder="Search dish name..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {!loading && <span className="badge-count">{filtered.length} / {dishes.length} items</span>}
        </div>
        <button className="add-btn" onClick={openAddModal}>+ ADD DISH</button>
      </div>

      {loading && <div className="state-wrap"><div className="spinner" />Loading menus...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        filtered.length === 0
          ? <div className="state-wrap">No dishes found</div>
          : (
            <div className="grid">
              {filtered.map((dish) => (
                <div className="dish-card" key={dish.id}>
                  <div className="dish-img-wrap">
                    {dish.image
                      ? <Image src={dish.image} alt={dish.name} fill style={{ objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ddd", fontSize: 32 }}>🍽️</div>
                    }
                  </div>
                  <div className="dish-body">
                    <div className="dish-name">{dish.name}</div>
                    <div className="dish-desc">{dish.description || "—"}</div>
                    <div className="dish-price">{dish.price?.toLocaleString()} {dish.currency}</div>
                    <div className="dish-actions">
                      <button className="dish-edit-btn" onClick={() => openEditModal(dish)}>Edit</button>
                      <button className="dish-del-btn" onClick={() => openDeleteModal(dish)}>Delete</button>
                    </div>
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
            <h2 className="modal-title">Add Dish</h2>

            <div className="form-field">
              <label className="form-label">Name *</label>
              <input className="form-input" type="text" placeholder="e.g. Pad Thai"
                value={addModal.name} onChange={(e) => setAddModal((m) => m ? { ...m, name: e.target.value } : null)} autoFocus />
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Short description..."
                value={addModal.description} onChange={(e) => setAddModal((m) => m ? { ...m, description: e.target.value } : null)} />
            </div>
            <div className="price-row">
              <div className="form-field">
                <label className="form-label">Price *</label>
                <input className="form-input" type="number" min="0" placeholder="0"
                  value={addModal.price} onChange={(e) => setAddModal((m) => m ? { ...m, price: e.target.value } : null)} />
              </div>
              <div className="form-field">
                <label className="form-label">Currency</label>
                <input className="form-input" type="text" placeholder="THB"
                  value={addModal.currency} onChange={(e) => setAddModal((m) => m ? { ...m, currency: e.target.value } : null)} />
              </div>
            </div>

            {/* ── Image upload ── */}
            <div className="form-field">
              <label className="form-label">Image</label>
              <input ref={addFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddFile} />
              {addModal.imagePreview ? (
                <div className="image-preview-wrap">
                  <img src={addModal.imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button className="change-img-btn" onClick={() => addFileRef.current?.click()}>Change</button>
                </div>
              ) : (
                <div className="upload-zone" onClick={() => addFileRef.current?.click()}>
                
                  <div className="upload-zone-text">Click to upload or <span>browse</span></div>
                  <div style={{ fontSize: 11, color: "#ddd", marginTop: 4 }}>JPG, PNG, WEBP</div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setAddModal(null)} disabled={addModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyAdd}
                disabled={addModal.saving || !addModal.name.trim() || !addModal.price}>
                {addModal.saving ? <span className="mini-spinner" /> : "ADD DISH"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="modal-overlay" onClick={() => !editModal.saving && setEditModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Dish</h2>

            <div className="form-field">
              <label className="form-label">Name *</label>
              <input className="form-input" type="text"
                value={editModal.name} onChange={(e) => setEditModal((m) => m ? { ...m, name: e.target.value } : null)} autoFocus />
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea className="form-textarea"
                value={editModal.description} onChange={(e) => setEditModal((m) => m ? { ...m, description: e.target.value } : null)} />
            </div>
            <div className="price-row">
              <div className="form-field">
                <label className="form-label">Price *</label>
                <input className="form-input" type="number" min="0"
                  value={editModal.price} onChange={(e) => setEditModal((m) => m ? { ...m, price: e.target.value } : null)} />
              </div>
              <div className="form-field">
                <label className="form-label">Currency</label>
                <input className="form-input" type="text"
                  value={editModal.currency} onChange={(e) => setEditModal((m) => m ? { ...m, currency: e.target.value } : null)} />
              </div>
            </div>

            {/* ── Image upload ── */}
            <div className="form-field">
              <label className="form-label">Image</label>
              <input ref={editFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleEditFile} />
              {editModal.imagePreview ? (
                <div className="image-preview-wrap">
                  <img src={editModal.imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button className="change-img-btn" onClick={() => editFileRef.current?.click()}>Change</button>
                </div>
              ) : (
                <div className="upload-zone" onClick={() => editFileRef.current?.click()}>
              
                  <div className="upload-zone-text">Click to upload or <span>browse</span></div>
                  <div style={{ fontSize: 11, color: "#ddd", marginTop: 4 }}>JPG, PNG, WEBP</div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditModal(null)} disabled={editModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyEdit}
                disabled={editModal.saving || !editModal.name.trim() || !editModal.price}>
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
            <h2 className="modal-title">Delete Dish</h2>
            {/* <div className="delete-warn">
              ต้องการลบ <strong>"{deleteModal.dish.name}"</strong> ออกจากเมนูใช่ไหม? การลบนี้ไม่สามารถกู้คืนได้
            </div> */}
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