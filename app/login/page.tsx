"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: implement authentication logic
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
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

        /* ── Logo ── */
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          margin-bottom: 56px;
          animation: fadeUp 0.6s ease both;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: #d32f2f;
        
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 4px 20px rgba(211,47,47,0.45);
        }

        .logo-text-wrap { display: flex; flex-direction: column; }

        .logo-title {
          font-family: 'Kanit', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #fff;
          letter-spacing: 0.06em;
          line-height: 1.1;
        }

        .logo-sub {
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 300;
        }

        /* ── Heading ── */
        .login-heading {
          font-family: 'Kanit', sans-serif;
        
          font-size: 26px;
          color: #fff;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        /* ── Inputs ── */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .input-wrap {
          position: relative;
        }

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

        .toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          font-size: 18px;
          padding: 4px;
          transition: color 0.2s;
        }
       

        /* ── Forget password ── */
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

        /* ── Sign in button ── */
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
          position: relative;
          overflow: hidden;
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

        /* ── Divider (optional) ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 0;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .divider-text { font-size: 12px; color: #555; letter-spacing: 0.06em; }

        /* ── Footer links ── */
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

        .footer-copy {
          font-size: 11px;
          color: #444;
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          max-width: 420px;
          letter-spacing: 0.03em;
        }

        /* ── Spice dots decoration ── */
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
        .login-card, .footer-copy { position: relative; z-index: 1; }
      `}</style>

      {/* Background decoration */}
      <div className="deco-dots" aria-hidden="true">
        <div className="deco-dot" style={{ width: 320, height: 320, top: -80, right: -100 }} />
        <div className="deco-dot" style={{ width: 200, height: 200, bottom: 60, left: -60 }} />
      </div>

      <div className="login-card">
        {/* Logo */}
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

        {/* Heading */}
        <h1 className="login-heading">Login to your Account</h1>

        {/* Form fields */}
        <div className="input-group">
          <div className="input-wrap">
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
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
              style={{ paddingRight: 44 }}
            />
       
          </div>
        </div>

        {/* Forgot password */}
        <div className="forgot-wrap">
          <a href="/forgot-password" className="forgot-link">Forget Password?</a>
        </div>

        {/* Sign in button */}
        <button
          className="signin-btn"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading && <span className="btn-spinner" />}
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        {/* Sign up link */}
        <p className="footer-signup">
          Don&apos;t have an account?
          <a href="/register">Sign up</a>
        </p>
      </div>

    </div>
  );
}