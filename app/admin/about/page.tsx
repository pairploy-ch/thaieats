"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminAboutPage() {
  const [text, setText] = useState("");
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchAbout(); }, []);

  const fetchAbout = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("about").select("text").single();
    if (error) setError(error.message);
    else {
      setText(data?.text ?? "");
      setOriginal(data?.text ?? "");
    }
    setLoading(false);
  };

  const applySave = async () => {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase.from("about").update({ text }).eq("text", original);
    if (!error) {
      setOriginal(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else setError(error.message);
    setSaving(false);
  };

  const isDirty = text !== original;

  return (
    <div>
      <style>{`
        .page-title { font-family: 'Kanit', sans-serif; font-size: 22px; color: #1a1a1a; margin-bottom: 8px; }
        .page-sub { font-size: 13px; color: #aaa; margin-bottom: 28px; font-family: 'Sarabun', sans-serif; }

        .editor-wrap {
          background: #fff; border: 1.5px solid #e8e8e8;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .editor-wrap:focus-within { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.08); }

        .editor-textarea {
          width: 100%; min-height: 320px; padding: 20px;
          font-family: 'Sarabun', sans-serif; font-size: 15px;
          color: #1a1a1a; background: none; border: none;
          outline: none; resize: vertical; line-height: 1.8;
          box-sizing: border-box;
        }

        .editor-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-top: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .char-count { font-size: 12px; color: #ccc; font-family: 'Kanit', sans-serif; }

        .action-row { display: flex; align-items: center; gap: 12px; }

        .save-btn {
          padding: 10px 28px; background: #d32f2f; border: none; color: #fff;
          font-family: 'Kanit', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.06em; cursor: pointer; transition: background 0.2s, opacity 0.2s;
        }
        .save-btn:hover:not(:disabled) { background: #b71c1c; }
        .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .discard-btn {
          padding: 10px 18px; background: none; border: 1.5px solid #d32f2f;
          color: #d32f2f; font-family: 'Kanit', sans-serif; font-size: 14px;
          cursor: pointer; transition: background 0.2s;
        }
        .discard-btn:hover { background: #fff5f5; }

        .saved-badge {
          font-size: 12px; color: #388e3c; font-family: 'Kanit', sans-serif;
          display: flex; align-items: center; gap: 4px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .state-wrap { padding: 80px 0; text-align: center; color: #ccc; font-size: 14px; }
        .spinner { width: 28px; height: 28px; border: 3px solid #f0f0f0; border-top-color: #d32f2f; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mini-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; }
      `}</style>

      <h1 className="page-title">About</h1>
  

      {loading && <div className="state-wrap"><div className="spinner" />Loading...</div>}
      {error && <div className="state-wrap" style={{ color: "#d32f2f" }}>⚠️ {error}</div>}

      {!loading && !error && (
        <div className="editor-wrap">
          <textarea
            className="editor-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="เขียนข้อความ about ที่นี่..."
          />
          <div className="editor-footer">
            <span className="char-count">{text.length} characters</span>
            <div className="action-row">
              {saved && (
                <span className="saved-badge">✓ Saved</span>
              )}
              {isDirty && (
                <button className="discard-btn" onClick={() => setText(original)}>
                  Discard
                </button>
              )}
              <button
                className="save-btn"
                onClick={applySave}
                disabled={saving || !isDirty}
              >
                {saving ? <span className="mini-spinner" /> : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}