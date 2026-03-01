"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
const router = useRouter();

  const handleSubmit = async () => {
    setError(null);

    // ── Basic validation ──
    if (!username.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // ── 1. เช็ค username ซ้ำ ──
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim())
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        setError("This username is already taken. Please choose another one.");
        setLoading(false);
        return;
      }

      // ── 2. Supabase Auth signUp ──
      // ใช้ fake email เพราะ Auth ต้องการ email แต่ระบบ login ด้วย username
      const fakeEmail = `${username.trim().toLowerCase()}@thaieats.app`;

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
      });

      if (signUpError) throw signUpError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Unable to create account. Please try again.");

      // ── 3. Insert ลง profiles table ──
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        username: username.trim(),
        phone: phone.trim(),
      });

      if (insertError) throw insertError;

 router.push("/profile");

// redirect ไปหน้า profile หลัง 1 วิ
setTimeout(() => {
  router.push("/profile");
}, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700&family=Sarabun:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-image: url("/images/bg-chalkboard.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          font-family: 'Sarabun', sans-serif;
          padding: 24px;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.12);
          color: #ccc;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
        }
        .back-btn:hover {
          background: rgba(211,47,47,0.15);
          border-color: #d32f2f;
          color: #fff;
          transform: translateX(-2px);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: fadeUp 0.6s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 48px;
        }

        .login-heading {
          font-family: 'Kanit', sans-serif;
          font-size: 26px;
          color: #fff;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .input-wrap { position: relative; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.12);
          padding: 16px 18px;
          font-family: 'Sarabun', sans-serif;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }

        .input-field::placeholder { color: #666; }

        .input-field:focus {
          border-color: #d32f2f;
          background: rgba(211,47,47,0.06);
          box-shadow: 0 0 0 3px rgba(211,47,47,0.15);
        }

        .input-field:disabled { opacity: 0.5; cursor: not-allowed; }

        .alert {
          padding: 12px 16px;
         
          font-size: 13px;
          margin-bottom: 16px;
          animation: fadeUp 0.3s ease both;
          line-height: 1.5;
        }
        .alert-error {
          background: rgba(211,47,47,0.12);
          border: 1px solid rgba(211,47,47,0.35);
          color: #ff8a80;
        }
        .alert-success {
          background: rgba(56,142,60,0.12);
          border: 1px solid rgba(56,142,60,0.35);
          color: #a5d6a7;
        }

        .signin-btn {
          margin-top: 20px;
          width: 100%;
          padding: 17px;
          background: #d32f2f;
          border: none;
          font-family: 'Kanit', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.12em;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(211,47,47,0.35);
          animation: fadeUp 0.6s 0.35s ease both;
        }



        .signin-btn:active:not(:disabled) { transform: translateY(0); }
        .signin-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-signup {
          text-align: center;
          font-size: 14px;
          color: #777;
          margin-top: 32px;
          animation: fadeUp 0.6s 0.45s ease both;
        }

        .footer-signup a {
          color: #d32f2f;
          text-decoration: none;
          font-weight: 500;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .footer-signup a:hover { color: #ef5350; }

        .deco-dots {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .deco-dot {
          position: absolute;
          border-radius: 50%;
          background: #d32f2f;
          opacity: 0.04;
        }
        .login-card { position: relative; z-index: 1; }
      `}</style>

      {/* Back button */}
      <Link href="/" className="back-btn" aria-label="Go back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
        </svg>
      </Link>

      <div className="deco-dots" aria-hidden="true">
        <div className="deco-dot" style={{ width: 320, height: 320, top: -80, right: -100 }} />
        <div className="deco-dot" style={{ width: 200, height: 200, bottom: 60, left: -60 }} />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="logo-wrap">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Thai Street Eats Logo"
              width={300}
              height={400}
              className="h-14 sm:h-16 w-auto"
              priority
            />
          </Link>
        </div>

        <h1 className="login-heading">Create your Account</h1>

        {/* Error / Success alerts */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}


        {/* Form — ซ่อนหลัง success */}
      
            <div className="input-group">
              <div className="input-wrap">
                <input
                  className="input-field"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              <div className="input-wrap">
                <input
                  className="input-field"
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="numeric"
                  disabled={loading}
                />
              </div>

              <div className="input-wrap">
                <input
                  className="input-field"
                  type="password"
                  placeholder="Password (at least 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              className="signin-btn"
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              {loading && <span className="btn-spinner" />}
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
  

        <p className="footer-signup">
          Already have an account?
          <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}