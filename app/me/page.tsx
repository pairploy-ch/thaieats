"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";

interface Profile {
  id: string;
  username: string;
  phone: string;
  points?: number;
  stamp_count?: number;
}
interface Promotion {
  id: number;
  img: string;
}

const TOTAL_STAMPS = 10;

export default function MePage() {
  
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
const [promotions, setPromotions] = useState<Promotion[]>([]);
const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

 const fetchData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { router.push("/login"); return; }

  const [{ data: profileData }, { data: promoData }, { data: contactData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("reward").select("id, img").order("id", { ascending: true }),
     supabase.from("contact").select("*").eq("title", "Phone").single(),
  ]);

  
  setProfile(profileData);
  setPromotions(promoData ?? []);
  setPhone(contactData?.lines?.[0] ?? null);
  setLoading(false);
  
};

fetchData();

  }, []);



  const stampCount = profile?.stamp_count ?? 2;
  const points = profile?.points ?? 0;


  if (loading) {
    return (
      <div className="me-root">
        <style>{baseStyles}</style>
        <div className="skeleton-wrap">
          <div
            className="skeleton"
            style={{ height: 90, borderRadius: 12, marginBottom: 20 }}
          />
          <div
            className="skeleton"
            style={{ height: 160, borderRadius: 12, marginBottom: 20 }}
          />
          <div className="skeleton" style={{ height: 280, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="me-root">
      <style>{baseStyles}</style>
   <Navbar activePage="me" phone={phone} />
      <div className="max-w-3xl mx-auto" style={{paddingTop: '100px'}}>
        {/* ── Top bar ── */}
     
        {/* <div className="topbar">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Thai Street Eats"
              width={140}
              height={48}
              className="topbar-logo"
              priority
            />
          </Link>
          <button className="logout-btn" onClick={handleLogout} type="button">
            Sign Out
          </button>
        </div> */}

        {/* ── Points ── */}
        <div className="points-section">
          <p className="points-label">Your point</p>
          <div className="points-row">
            <span className="coin-emoji">🪙</span>
            <span className="points-number">{points.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Promotion ── */}
        <div className="section-wrap">
          <h2 className="section-title">Promotion</h2>
          <div className="promo-scroll">
            {promotions.length === 0 ? (
  <p style={{ color: "#555", fontSize: 13 }}>No promotions are currently available</p>
) : (
  promotions.map((p) => (
    <div className="promo-card" key={p.id}>
      <Image src={p.img} alt={`Promotion ${p.id}`} fill style={{ objectFit: "cover" }} />
    </div>
  ))
)}
          </div>
        </div>

        {/* ── Reward Card ── */}
        <div className="section-wrap">
          <h2 className="section-title">Reward Card</h2>
          <div className="reward-card">
            {/* Name row */}
            <div className="name-row">
              <span className="name-label">NAME:</span>
              <div className="name-line-wrap">
                <span className="name-value font-handwritten">{profile?.username}</span>
                <div className="name-underline" />
              </div>
            </div>

            {/* Stamp grid — 5 columns × 2 rows */}
            <div className="stamp-grid">
              {Array.from({ length: TOTAL_STAMPS }).map((_, i) => {
                const slot = i + 1;
                const filled = slot <= stampCount;
                const isFreeSlot = slot === TOTAL_STAMPS;

                if (isFreeSlot) {
                  return (
                    <div
                      key={i}
                      className={`stamp stamp-free ${filled ? "stamp-free-filled" : ""}`}
                    >
                      {filled ? "✓" : "Free!"}
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className={`stamp ${filled ? "stamp-filled" : "stamp-empty"}`}
                  >
                    {filled ? (
                      <div className="chili-wrap">
                        <Image
                          src="/images/stamp.png"
                          alt="stamp"
                          fill
                          style={{ objectFit: "contain",  }}
                          onError={() => {}}
                        />
                      </div>
                    ) : (
                      <span className="stamp-num">{slot}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="buy-caption">BUY {TOTAL_STAMPS} GET 1 FREE</p>
          </div>
        </div>
      </div>

    </div>
  );
}

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Sarabun:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .me-root {
    min-height: 100vh;
    
    background-color: #2a2a2a;
    background-image: url("/images/bg-chalkboard.png");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    font-family: 'Sarabun', sans-serif;
    color: #fff;
    padding-bottom: 60px;
  }

  /* ── Topbar ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: rgba(20,20,20,0.8);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .topbar-logo { height: 38px; width: auto; }

  .logout-btn {
    background: none;
    border: 1.5px solid rgba(255,255,255,0.18);
    color: #999;
    font-family: 'Kanit', sans-serif;
    font-size: 12px;
    letter-spacing: 0.05em;
    padding: 5px 14px;
   
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .logout-btn:hover { border-color: #d32f2f; color: #ff6b6b; }

  /* ── Points ── */
  .points-section {
    text-align: center;
    padding: 40px 24px 32px;
  }

  .points-label {
    font-family: 'Kanit', sans-serif;
    font-size: 15px;
    color: #aaa;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .points-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .coin-emoji { font-size: 46px; line-height: 1; }

  .points-number {
    font-family: 'Kanit', sans-serif;
    font-weight: 600;
    font-size: 64px;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #fff;
  }

  /* ── Sections ── */
  .section-wrap {
    padding: 0 20px;
    margin-bottom: 36px;
  }

  .section-title {
    font-family: 'Kanit', sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: #fff;
    margin-bottom: 14px;
  }

  /* ── Promotion ── */
  .promo-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .promo-scroll::-webkit-scrollbar { display: none; }

  .promo-card {
    flex-shrink: 0;
    width: calc(72vw);
    max-width: 320px;
    height: 160px;
   
    overflow: hidden;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    position: relative;
  }

  /* ── Reward Card ── */
  .reward-card {
    background: rgba(50,48,48,0.92);
    border: 1px solid rgba(255,255,255,0.08);
   
    padding: 22px 18px 18px;
  }

  /* Name row */
  .name-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 22px;
  }

  .name-label {
    font-family: 'Kanit', sans-serif;
    font-size: 13px;
    color: #777;
    letter-spacing: 0.1em;
    white-space: nowrap;
    padding-bottom: 4px;
  }

  .name-line-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .name-value {
  
    font-size: 32px;
    font-weight: 500;
    color: #fff;
    letter-spacing: 0.04em;
    line-height: 1.1;
  }

  .name-underline {
    width: 100%;
    height: 1.5px;
    background: rgba(255,255,255,0.25);
  }

  /* ── Stamp grid ── */
  .stamp-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stamp {
    aspect-ratio: 1;

    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Filled stamp — red background with chili logo */
  .stamp-filled {
    background: #cc2222;
    box-shadow: 0 2px 10px rgba(204,34,34,0.45);
  }

  .chili-wrap {
    position: absolute;
    inset: 0;
  }

  /* Empty stamp */
  .stamp-empty {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.12);
  }

  .stamp-num {
    font-family: 'Kanit', sans-serif;
    font-weight: 600;
    font-size: clamp(14px, 4vw, 20px);
    color: #555;
  }

  /* Free slot */
  .stamp-free {
    background: #111;
    border: 2px solid #555;
  }

  .stamp-free-filled {
    background: #111;
    border-color: #d32f2f;
    color: #fff;
    font-family: 'Kanit', sans-serif;
    font-weight: 700;
    font-size: 13px;
  }

  .stamp-free:not(.stamp-free-filled) {
    font-family: 'Kanit', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #fff;
    letter-spacing: 0.02em;
  }

  /* Caption */
  .buy-caption {
    text-align: center;
    font-family: 'Kanit', sans-serif;
    font-size: 12px;
    color: #666;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ── Skeleton ── */
  .skeleton-wrap { padding: 24px; }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer { to { background-position: -200% 0; } }
`;
