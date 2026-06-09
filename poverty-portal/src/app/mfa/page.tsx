"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [timer, setTimer] = useState(59);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased flex overflow-hidden relative">
      <main className="flex-1 flex flex-col md:flex-row min-h-screen w-full">
        {/* Left Panel: Identical to Login Page for Seamless Transition */}
        <section className="hidden md:flex md:w-7/12 lg:w-3/5 relative bg-[#091a2f] overflow-hidden items-center justify-center p-12 lg:p-20">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#1e40af]/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#0f766e]/15 rounded-full blur-[140px] pointer-events-none"></div>

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

          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/20 pointer-events-none"></div>
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/20 pointer-events-none"></div>
        </section>

        {/* Right Panel: MFA Verification Form */}
        <section className="w-full md:w-5/12 lg:w-2/5 flex flex-col bg-white justify-between relative shadow-2xl z-10">
          <div className="flex-grow flex items-center justify-center px-6 py-12 lg:px-12">
            <div className="w-full max-w-sm space-y-8">

              {/* Security Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-[#0f2c59]/5 border border-[#0f2c59]/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  {/* Clean SVG Lock/Shield Icon */}
                  <svg className="w-8 h-8 text-[#0f2c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-[#0f2c59]">Verifikasi Keamanan Ganda</h2>
                  <p className="text-xs text-slate-500 font-medium">Masukkan kode OTP dari aplikasi autentikator Anda</p>
                </div>
              </div>

              {/* Form fields */}
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href = '/national'; }}>
                {/* OTP input boxes */}
                <div className="flex justify-center gap-2" id="otp-container">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <input
                      key={idx}
                      aria-label={`Digit ${idx}`}
                      className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-lg hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none transition-all bg-white text-[#0f2c59]"
                      maxLength={1}
                      type="text"
                      onChange={(e) => {
                        if (e.target.value.length === 1) {
                          const nextInput = e.target.nextElementSibling as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !e.currentTarget.value) {
                          const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Resend Timer */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-500 font-medium">
                    Kirim ulang kode dalam <span className="font-semibold text-[#0f2c59]">{timer}</span> detik
                  </p>
                  <button className="text-xs font-semibold text-slate-400 cursor-not-allowed transition-colors" disabled type="button">
                    Masukkan kode: 123456
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-[#0f2c59] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#153a70] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2" type="submit">
                    <span>Verifikasi & Lanjutkan</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <Link href="/login" className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Kembali ke Halaman Login</span>
                  </Link>
                </div>
              </form>

              {/* Protective Shield Banner */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-medium pt-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Akses diproteksi protokol keamanan siber pemerintah.</span>
              </div>

            </div>
          </div>

          {/* Footer */}
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
