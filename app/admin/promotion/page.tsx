"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Promotion {
  id: number;
  img: string;
}

type AddModal = {
  imageFile: File | null;
  imagePreview: string;
  saving: boolean;
};

type DeleteModal = {
  promotion: Promotion;
  confirming: boolean;
};

const BUCKET = "menu";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("promotion")
      .select("*")
      .order("id", { ascending: true });
    if (error) setError(error.message);
    else setPromotions(data ?? []);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const filename = `promotions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: false });
    if (error) { console.error(error); return null; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  };

  const openAddModal = () => setAddModal({ imageFile: null, imagePreview: "", saving: false });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddModal((m) => m ? { ...m, imageFile: file, imagePreview: URL.createObjectURL(file) } : null);
  };

  const applyAdd = async () => {
    if (!addModal?.imageFile) return;
    setAddModal((m) => m ? { ...m, saving: true } : null);
    const imageUrl = await uploadImage(addModal.imageFile);
    if (!imageUrl) { setAddModal((m) => m ? { ...m, saving: false } : null); return; }
    const { data, error } = await supabase.from("promotion").insert({ img: imageUrl }).select().single();
    if (!error && data) {
      setPromotions((prev) => [...prev, data]);
      setAddModal(null);
    } else setAddModal((m) => m ? { ...m, saving: false } : null);
  };

  const openDeleteModal = (promotion: Promotion) => setDeleteModal({ promotion, confirming: false });

  const applyDelete = async () => {
    if (!deleteModal) return;
    setDeleteModal((m) => m ? { ...m, confirming: true } : null);
    const { error } = await supabase.from("promotion").delete().eq("id", deleteModal.promotion.id);
    if (!error) {
      setPromotions((prev) => prev.filter((p) => p.id !== deleteModal.promotion.id));
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

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

        .promo-card { background: #fff; border: 1px solid #efefef; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; transition: box-shadow 0.2s; }
        .promo-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

        .promo-img-wrap { position: relative; width: 100%; aspect-ratio: 1/1; background: #fafafa; }

        .promo-footer { padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f5f5f5; }
        .promo-id { font-size: 11px; color: #ccc; font-family: 'Kanit', sans-serif; }
        .del-btn { padding: 5px 14px; font-size: 12px; font-family: 'Kanit', sans-serif; font-weight: 600; cursor: pointer; border: none; background: #d32f2f; color: #fff; transition: background 0.15s; }
        .del-btn:hover { background: #b71c1c; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #fff; border: 1px solid #efefef; box-shadow: 0 8px 40px rgba(0,0,0,0.12); width: 100%; max-width: 440px; padding: 28px 24px; animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-family: 'Kanit', sans-serif; font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }

        .upload-zone { border: 2px dashed #e8e8e8; padding: 32px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .upload-zone:hover { border-color: #d32f2f; background: #fff5f5; }
        .upload-zone-text { font-size: 13px; color: #bbb; font-family: 'Sarabun', sans-serif; }
        .upload-zone-text span { color: #d32f2f; font-weight: 600; }

        .preview-wrap { position: relative; width: 100%; aspect-ratio: 1/1; border: 1px solid #f0f0f0; overflow: hidden; background: #fafafa; }
        .change-btn { position: absolute; bottom: 8px; right: 8px; padding: 5px 12px; background: rgba(0,0,0,0.55); color: #fff; border: none; font-size: 11px; font-family: 'Kanit', sans-serif; cursor: pointer; transition: background 0.2s; }
        .change-btn:hover { background: #d32f2f; }

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

      <h1 className="page-title">Promotions</h1>

      <div className="toolbar">
        {!loading && <span className="badge-count">{promotions.length} promotions</span>}
        <button className="add-btn" onClick={openAddModal}>+ ADD PROMOTION</button>
      </div>

      {loading && <div className="state-wrap"><div className="spinner" />Loading...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        promotions.length === 0
          ? <div className="state-wrap">No promotions yet</div>
          : (
            <div className="grid">
              {promotions.map((promo, i) => (
                <div className="promo-card" key={promo.id}>
                  <div className="promo-img-wrap">
                    {promo.img
                      ? <Image src={promo.img} alt={`Promotion ${i + 1}`} fill style={{ objectFit: "contain" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ddd", fontSize: 32 }}>�promotion️</div>
                    }
                  </div>
                  <div className="promo-footer">
                  
                    <button className="del-btn" onClick={() => openDeleteModal(promo)}>Delete</button>
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
            <h2 className="modal-title">Add Promotion</h2>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            {addModal.imagePreview ? (
              <div className="preview-wrap">
                <img src={addModal.imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button className="change-btn" onClick={() => fileRef.current?.click()}>Change</button>
              </div>
            ) : (
              <div className="upload-zone" onClick={() => fileRef.current?.click()}>
       
                <div className="upload-zone-text">Click to upload or <span>browse</span></div>
                <div style={{ fontSize: 11, color: "#ddd", marginTop: 4 }}>JPG, PNG, WEBP</div>
              </div>
            )}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setAddModal(null)} disabled={addModal.saving}>Cancel</button>
              <button className="modal-confirm" onClick={applyAdd} disabled={addModal.saving || !addModal.imageFile}>
                {addModal.saving ? <span className="mini-spinner" /> : "UPLOAD"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => !deleteModal.confirming && setDeleteModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Promotion</h2>
         
            {deleteModal.promotion.img && (
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: 4, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                <Image src={deleteModal.promotion.img} alt="promotion" fill style={{ objectFit: "cover" }} />
              </div>
            )}
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