"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // ── 1. หา email จาก username ใน profiles ──
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username.trim())
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile?.email) {
        setError("Username not found. Please check and try again.");
        setLoading(false);
        return;
      }

      // ── 2. signIn ด้วย email ที่ได้มา ──
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes("invalid")) {
          setError("Incorrect password. Please try again.");
        } else {
          throw signInError;
        }
        return;
      }

      // ── 3. redirect ──
      router.push("/me");

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
          gap: 12px;
          justify-content: center;
          margin-bottom: 56px;
          animation: fadeUp 0.6s ease both;
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

        .forgot-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .forgot-link {
          font-size: 13px;
          color: #aaa;
          text-decoration: none;
          font-style: italic;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #d32f2f; }

        .alert {
          padding: 12px 16px;
          font-size: 13px;
          margin-bottom: 16px;
          animation: fadeUp 0.3s ease both;
          line-height: 1.5;
          background: rgba(211,47,47,0.12);
          border: 1px solid rgba(211,47,47,0.35);
          color: #ff8a80;
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

      <div className="deco-dots" aria-hidden="true">
        <div className="deco-dot" style={{ width: 320, height: 320, top: -80, right: -100 }} />
        <div className="deco-dot" style={{ width: 200, height: 200, bottom: 60, left: -60 }} />
      </div>

      <div className="login-card">
        <div className="logo-wrap">
          <Link href="/" className="flex items-center gap-3 z-50">
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

        <h1 className="login-heading">Login to your Account</h1>

        {/* ── Error alert ── */}
        {error && <div className="alert">⚠️ {error}</div>}

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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
        </div>

        <div className="forgot-wrap">
          <a href="/forgot-password" className="forgot-link">Forget Password?</a>
        </div>

        <button
          className="signin-btn"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading && <span className="btn-spinner" />}
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <p className="footer-signup">
          Don&apos;t have an account?
          <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}