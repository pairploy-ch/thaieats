"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const NAV = [
  { href: "/admin/users", label: "Users", },
  { href: "/admin/menus", label: "Menus" },
    { href: "/admin/banner", label: "Banners" },
      { href: "/admin/about", label: "About" },
         { href: "/admin/contact", label: "Contact" },
           { href: "/admin/quote", label: "Quote" },
           { href: "/admin/promotion", label: "Promotion" },
           { href: "/admin/reward", label: "Reward" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [adminName, setAdminName] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: me } = await supabase
        .from("profiles")
        .select("isAdmin, username")
        .eq("id", session.user.id)
        .single();

      if (!me?.isAdmin) { router.replace("/me"); return; }

      setAdminName(me.username ?? "");
      setChecking(false);
    };
    check();
  }, [router]);

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: 32, height: 32,
          border: "3px solid #e0e0e0",
          borderTopColor: "#d32f2f",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7f7", fontFamily: "'Sarabun', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Sarabun:wght@300;400;500&display=swap');

        .sidebar {
          width: 220px;
          min-height: 100vh;
          background: #fff;
          border-right: 1px solid #e8e8e8;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          box-shadow: 2px 0 8px rgba(0,0,0,0.04);
        }

        .sidebar-top {
          padding: 24px 20px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .sidebar-brand {
          font-family: 'Kanit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .sidebar-brand span { color: #d32f2f; }

        .sidebar-admin-name {
          font-size: 12px;
          color: #aaa;
        }

        nav { padding: 12px 0; flex: 1; }

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
        }
        .nav-item:hover {
          background: #fafafa;
          color: #333;
        }
        .nav-item.active {
          color: #d32f2f;
          background: #fff5f5;
          border-left-color: #d32f2f;
          font-weight: 600;
        }
        .nav-icon { font-size: 15px; width: 20px; text-align: center; }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .back-link {
          font-size: 12px;
          color: #bbb;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: #d32f2f; }

        .signout-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #ccc;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-family: 'Sarabun', sans-serif;
          transition: color 0.2s;
        }
        .signout-btn:hover { color: #d32f2f; }

        .admin-content {
          margin-left: 220px;
          flex: 1;
          padding: 36px 32px;
          min-height: 100vh;
          color: #1a1a1a;
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
                  <Image
                          src="/images/logo-black.png"
                          alt="Thai Street Eats Logo"
                          width={200}
                          height={50}
                          className="h-10 sm:h-10 w-auto"
                          priority
                        />
          {/* <div className="sidebar-brand">
            Admin Panel
          </div> */}
          {/* <div className="sidebar-admin-name">@{adminName}</div> */}
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
         
          <button
            className="signout-btn"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
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