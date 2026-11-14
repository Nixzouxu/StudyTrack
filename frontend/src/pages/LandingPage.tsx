import { useRef } from "react";
import { gsap } from "gsap";
import type { User } from "../types";
import AuthForm from "../components/AuthForm";
import Dial from "../components/landing/Dial";
import Rings from "../components/Rings";
import { useScenes } from "../components/landing/useScenes";
import { prefersReducedMotion, usePointerParallax } from "../lib/motion";

const kalimat =
  "Tugas yang kurang dari 24 jam lagi naik ke paling atas. Yang sudah lewat tetap tampil dengan tanda berbeda. Sisanya tetap rapi, tanpa gangguan.";

// halaman landing: hero, penjelasan, demo urutan kartu, lalu panel masuk
// hiasan dikasih aria-hidden, isinya tetap kebaca walau tanpa animasi
export default function LandingPage({ onLogin }: { onLogin: (user: User) => void }) {
  const root = useRef<HTMLDivElement>(null);
  useScenes(root);
  usePointerParallax(root);

  // kalau login berhasil, halaman memudar dulu baru masuk ke aplikasi
  function masuk(user: User) {
    if (prefersReducedMotion() || !root.current) return onLogin(user);
    gsap.to(root.current, { opacity: 0, scale: 1.03, duration: 0.45, ease: "power2.in", onComplete: () => onLogin(user) });
  }

  return (
    <div className="landing" ref={root}>
      <header className="l-nav">
        <span className="brand">StudyTrack</span>
        <a className="btn btn-ghost" href="#masuk">
          Masuk
        </a>
      </header>

      {/* bagian 1: hero */}
      <section className="scene hero" aria-labelledby="judul">
        <div className="stage">
          <div className="layer depth-0" data-depth="0" aria-hidden="true">
            <span className="numeral">24</span>
          </div>
          <div className="layer depth-1" data-depth="1" aria-hidden="true">
            <span className="glow glow-a" />
            <span className="glow glow-b" />
          </div>

          <div className="hero-grid">
            <div className="layer-text hero-text depth-4" data-depth="4">
              <p className="eyebrow hero-fade">Pengingat deadline untuk mahasiswa</p>
              <h1 id="judul">
                <span className="mask"><span>Deadline dekat,</span></span>
                <span className="mask"><span>langsung terlihat.</span></span>
              </h1>
              <p className="lead hero-fade">
                StudyTrack menandai tugas yang kurang dari 24 jam lagi dan menaruhnya di paling atas, sebelum kamu sempat lupa.
              </p>
              <div className="cta hero-fade">
                <a className="btn btn-primary" href="#masuk">Mulai sekarang</a>
                <a className="btn btn-ghost" href="#cara">Lihat cara kerjanya</a>
              </div>
            </div>

            <div className="dial-col depth-3" data-depth="3">
              <div className="dial-wrap">
                <div className="float">
                  <Dial />
                </div>
                <div className="comp comp-late depth-2" data-depth="2" aria-hidden="true">
                  <b>Laporan Praktikum</b>
                  <small>Terlambat 2 jam</small>
                </div>
                <div className="comp comp-soon depth-2" data-depth="2" aria-hidden="true">
                  <b>Project 3: BSTMap</b>
                  <small>Segera: sisa 5 jam 30 menit</small>
                </div>
                <div className="comp comp-ok depth-2" data-depth="2" aria-hidden="true">
                  <b>Sprint 2: Backend API</b>
                  <small>Selesai</small>
                </div>
              </div>
            </div>
          </div>

          <div className="layer depth-5" data-depth="5" aria-hidden="true">
            <span className="dot d1" />
            <span className="dot d2" />
            <span className="dot d3" />
            <span className="dot d4" />
          </div>
          <p className="scroll-hint hero-fade" aria-hidden="true">Scroll</p>
        </div>
      </section>

      {/* bagian 2: kalimat penjelasan */}
      <section className="scene words" id="cara" aria-label="Cara kerja">
        <div className="stage center">
          <p className="words-text" aria-label={kalimat}>
            {kalimat.split(" ").map((w, i) => (
              <span className="w" key={i} aria-hidden="true">{w} </span>
            ))}
          </p>
        </div>
      </section>

      {/* bagian 3: demo urutan kartu */}
      <section className="scene demo" aria-label="Contoh urutan tugas">
        <div className="stage demo-stage">
          <div className="captions">
            <p className="eyebrow">Urutan tugas</p>
            <div className="cap-box">
              <h2 className="cap cap-before">Biasanya berurutan sesuai waktu dibuat.</h2>
              <h2 className="cap cap-after">Dengan StudyTrack, yang paling mendesak naik ke atas.</h2>
            </div>
          </div>
          <ol className="stack">
            <li className="dc dc-new">
              <span className="tint tint-none" aria-hidden="true" />
              <b>Sprint 2: Backend API</b>
              <small>Deadline 3 hari lagi</small>
            </li>
            <li className="dc dc-late">
              <span className="tint tint-late" aria-hidden="true" />
              <b>Lab 4: Query Optimization</b>
              <small>Deadline kemarin</small>
              <span className="chip chip-late mono">Terlambat 2 jam</span>
            </li>
            <li className="dc dc-near">
              <span className="tint tint-soon" aria-hidden="true" />
              <b>Project 3: BSTMap</b>
              <small>Deadline hari ini</small>
              <span className="chip chip-soon mono">Segera: sisa 5 jam 30 menit</span>
            </li>
          </ol>
        </div>
      </section>

      {/* bagian 4: panel masuk */}
      <section className="scene masuk" id="masuk" aria-label="Masuk">
        <div className="curtain">
          <div className="layer depth-0" data-depth="0" aria-hidden="true">
            <div className="rings-wrap" data-pointer="14">
              <Rings className="masuk-rings" />
            </div>
          </div>
          <div className="layer depth-1" data-depth="1" aria-hidden="true">
            <span className="glow glow-c" />
            <span className="glow glow-d" />
          </div>
          <div className="layer depth-2" data-depth="2" aria-hidden="true">
            <div className="chip-float cf-soon" data-pointer="30">Segera: sisa 5 jam 30 menit</div>
            <div className="chip-float cf-late" data-pointer="-24">Terlambat 2 jam</div>
          </div>
          <div className="masuk-grid">
            <div className="masuk-copy">
              <p className="eyebrow">Mulai</p>
              <h2>Jangan biarkan deadline mengejutkanmu.</h2>
              <p className="lead">Catat tugasmu sekali, sisanya biar StudyTrack yang mengingatkan.</p>
            </div>
            <AuthForm onLogin={masuk} />
          </div>
        </div>
      </section>
    </div>
  );
}