import { useRef, useState } from "react";
import { gsap } from "gsap";
import type { User } from "../types";
import { api, setToken } from "../api";
import { prefersReducedMotion } from "../lib/motion";

interface Props {
  onLogin: (user: User) => void;
}

type Mode = "masuk" | "daftar";

// form login dan daftar dalam satu kartu
// ganti mode lewat tab di atas, kalau error kartunya goyang
export default function AuthForm({ onLogin }: Props) {
  const card = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<Mode>("masuk");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const daftar = mode === "daftar";

  function pilih(next: Mode) {
    setMode(next);
    setError("");
  }

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api<{ token: string; user: User }>(daftar ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(daftar ? { nama, email, password } : { email, password })
      });
      setToken(res.token);
      onLogin(res.user);
    } catch (err) {
      setError((err as Error).message);
      if (!prefersReducedMotion() && card.current) {
        gsap.fromTo(card.current, { x: 0 }, { keyframes: { x: [-10, 10, -6, 6, 0] }, duration: 0.4, ease: "power2.out" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" ref={card} onSubmit={submit} noValidate={false}>
      <div className="seg" role="tablist" aria-label="Masuk atau daftar" data-mode={mode}>
        <span className="seg-pill" aria-hidden="true" />
        <button type="button" role="tab" aria-selected={!daftar} onClick={() => pilih("masuk")}>
          Masuk
        </button>
        <button type="button" role="tab" aria-selected={daftar} onClick={() => pilih("daftar")}>
          Daftar
        </button>
      </div>

      <div className="auth-body" key={mode}>
        <div>
          <h2>{daftar ? "Mulai catat tugasmu" : "Selamat datang kembali"}</h2>
          <p className="muted">
            {daftar ? "Buat akun untuk menyimpan semua tugas kuliahmu." : "Masuk untuk melihat tugas yang perlu diurus."}
          </p>
        </div>

        {daftar && (
          <div className="field">
            <label htmlFor="a-nama">Nama</label>
            <input id="a-nama" value={nama} onChange={(e) => setNama(e.target.value)} required autoComplete="name" />
          </div>
        )}
        <div className="field">
          <label htmlFor="a-email">Email</label>
          <input id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="a-pass">Password</label>
          <div className="pw">
            <input
              id="a-pass"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={daftar ? 6 : undefined}
              autoComplete={daftar ? "new-password" : "current-password"}
            />
            <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-pressed={show}>
              {show ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>

        {error && <p className="error auth-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" aria-busy={loading} disabled={loading}>
          {loading ? "Memproses" : daftar ? "Buat akun" : "Masuk"}
        </button>

        {!daftar && (
          <button
            type="button"
            className="btn btn-text demo-fill"
            onClick={() => {
              setEmail("demo@studytrack.test");
              setPassword("demo1234");
            }}
          >
            Isi dengan akun demo
          </button>
        )}
      </div>
    </form>
  );
}