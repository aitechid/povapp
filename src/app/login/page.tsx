"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased flex overflow-hidden relative">
      <main className="flex-1 flex flex-col md:flex-row min-h-screen w-full">
        {/* Left Panel: Sleek Institutional Branding */}
        <section className="hidden md:flex md:w-7/12 lg:w-3/5 relative bg-[#091a2f] overflow-hidden items-center justify-center p-12 lg:p-20">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#1e40af]/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#0f766e]/15 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Decorative Grid Mesh overlay */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}>
          </div>

          <div className="relative z-10 max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-10 lg:p-14 rounded-2xl shadow-2xl">
            <div className="mb-6">
              <span className="bg-white/10 border border-white/10 text-white tracking-widest text-[10px] font-semibold uppercase px-3 py-1 rounded-full inline-block mb-4">
                REPUBLIK INDONESIA
              </span>
              <h1 className="font-sans font-bold tracking-tight text-3xl lg:text-4xl text-white leading-tight">
                Portal Penanggulangan Kemiskinan dan Analisis
              </h1>
            </div>

            <h3 className="text-lg font-semibold text-sky-400 opacity-90 border-l-2 border-sky-400 pl-4 mb-6">
              AitechID
            </h3>

            <p className="text-white/70 text-sm lg:text-base leading-relaxed">
              Sistem intelijen data terpadu untuk percepatan penghapusan kemiskinan ekstrem melalui analisis kewilayahan dan integrasi program perlindungan sosial.
            </p>
          </div>

          {/* Decorative Corner Bracket */}
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/20 pointer-events-none"></div>
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/20 pointer-events-none"></div>
        </section>

        {/* Right Panel: Clean, High-Contrast Form */}
        <section className="w-full md:w-5/12 lg:w-2/5 flex flex-col bg-white justify-between relative shadow-2xl z-10">
          <div className="flex-grow flex items-center justify-center px-6 py-12 lg:px-12">
            <div className="w-full max-w-sm space-y-8">

              {/* Logo Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-[#0f2c59]/5 border border-[#0f2c59]/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  {/* Clean SVG Shield Icon */}
                  <svg className="w-8 h-8 text-[#0f2c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-[#0f2c59]">Masuk ke Portal</h2>
                  <p className="text-xs text-slate-500 font-medium">Akses Konsol Analis dan Dashboard Program</p>
                </div>
              </div>

              {/* Form fields */}
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/mfa'; }}>
                {/* Username Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="identity">
                    Email / Username
                  </label>
                  <div className="relative flex items-center border border-slate-200 rounded-lg hover:border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all bg-white overflow-hidden">
                    <span className="pl-3.5 pr-2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      className="w-full py-3 pr-4 border-none focus:outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                      id="identity"
                      name="identity"
                      placeholder="personnama@instansi.go.id"
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center border border-slate-200 rounded-lg hover:border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all bg-white overflow-hidden">
                    <span className="pl-3.5 pr-2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      className="w-full py-3 pr-10 border-none focus:outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Controls */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500/20" type="checkbox" />
                    <span className="text-slate-500 group-hover:text-slate-800 transition-colors">Ingat saya</span>
                  </label>
                  <a className="text-sky-600 font-semibold hover:underline" href="#">Lupa Password?</a>
                </div>

                {/* Submit button */}
                <button className="w-full bg-[#0f2c59] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#153a70] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2" type="submit">
                  <span>Masuk dengan Kredensial</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </button>
              </form>

              {/* Separator */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Atau masuk menggunakan</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* SSO Button */}
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] group">
                <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">Single Sign-On (SSO) Pemerintah</span>
              </button>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Informasi Login</h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    User: admin password: admin.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer inside right panel */}
          <div className="py-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Hak Cipta © 2026 AitechID
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
