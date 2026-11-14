import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import type { User } from "./types";
import { api, getToken, setToken } from "./api";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(Boolean(getToken()));

  // kalau ada token tersimpan, cek ke /auth/me buat ambil sesi
  useEffect(() => {
    if (!getToken()) return;
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <p className="muted" style={{ textAlign: "center", marginTop: 48 }}>Memuat...</p>;

  return (
    <>
      {user ? <p className="page">Halo, {user.nama}. Halaman tugas menyusul.</p> : <LandingPage onLogin={setUser} />}
      <Toaster position="bottom-center" theme="system" closeButton />
    </>
  );
}