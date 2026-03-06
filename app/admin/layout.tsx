"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const NAV = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/menus", label: "Menus" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/quote", label: "Quote" },
  { href: "/admin/promotion", label: "Promotion" },
  { href: "/admin/reward", label: "Reward" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const { data: me } = await supabase
        .from("profiles").select("isAdmin, username").eq("id", session.user.id).single();
      if (!me?.isAdmin) { router.replace("/me"); return; }
      setAdminName(me.username ?? "");
      setChecking(false);
    };
    check();
  }, [router]);

  // ปิด sidebar เมื่อเปลี่ยนหน้า (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e0e0e0", borderTopColor: "#d32f2f", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Sarabun', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Sarabun:wght@300;400;500&display=swap');

        /* ── Sidebar ── */
        .sidebar {
          width: 220px;
          min-height: 100vh;
          background: #fff;
          border-right: 1px solid #e8e8e8;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
          transition: transform 0.25s ease;
        }

        .sidebar-top {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        nav { padding: 12px 0; flex: 1; overflow-y: auto; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 20px;
          font-size: 14px;
          color: #999;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border-left: 3px solid transparent;
          white-space: nowrap;
        }
        .nav-item:hover { background: #fafafa; color: #333; }
        .nav-item.active { color: #d32f2f; background: #fff5f5; border-left-color: #d32f2f; font-weight: 600; }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .signout-btn {
          background: none; border: none; font-size: 12px; color: #ccc;
          cursor: pointer; text-align: left; padding: 0;
          font-family: 'Sarabun', sans-serif; transition: color 0.2s;
        }
        .signout-btn:hover { color: #d32f2f; }

        /* ── Topbar (mobile) ── */
        .topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 40;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .hamburger {
          width: 36px; height: 36px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px; cursor: pointer;
          background: none; border: none; padding: 4px;
        }
        .hamburger span {
          display: block; width: 20px; height: 2px;
          background: #1a1a1a; border-radius: 2px;
          transition: all 0.2s;
        }

        .close-sidebar-btn {
          background: none; border: none; cursor: pointer;
          font-size: 20px; color: #aaa; padding: 4px; line-height: 1;
        }
        .close-sidebar-btn:hover { color: #d32f2f; }

        /* ── Overlay ── */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 45;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Content ── */
        .admin-content {
          margin-left: 220px;
          flex: 1;
          padding: 36px 32px;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.12); }
          .sidebar-overlay { display: block; }
          .topbar { display: flex; }
          .admin-content { margin-left: 0; padding: 80px 16px 32px; }
        }
      `}</style>

      {/* ── Mobile Topbar ── */}
      <div className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <span /><span /><span />
        </button>
        <Image src="/images/logo-black.png" alt="Logo" width={120} height={30} style={{ height: 28, width: "auto" }} priority />
        <div style={{ width: 36 }} />
      </div>

      {/* ── Overlay ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <Image src="/images/logo-black.png" alt="Logo" width={160} height={40} style={{ height: 36, width: "auto" }} priority />
          <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname.startsWith(item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span style={{ fontSize: 12, color: "#bbb" }}>@{adminName}</span>
          <button
            className="signout-btn"
            onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}