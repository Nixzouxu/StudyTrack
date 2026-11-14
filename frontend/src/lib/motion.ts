import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// kalau pengguna minta gerak dikurangi, semua animasi dilewati
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(pointer: fine)").matches;

const dua = (n: number) => String(n).padStart(2, "0");

/*
  animasi pas halaman pertama tampil, jalan sekali aja
  judul naik dari bawah, kartu muncul berurutan, angka ringkasan naik pelan, garis waktu terisi
  data yang diambil ulang tiap menit nggak memicu animasi lagi
*/
export function useRevealOnce(root: RefObject<HTMLElement | null>, ready: boolean) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!ready || !el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".mask > span", { yPercent: 115, duration: 0.7, ease: "power4.out" });

      gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 28,
          skewY: 2.5,
          duration: 0.55,
          ease: "power3.out",
          delay: ScrollTrigger.isInViewport(item) ? Math.min(i, 7) * 0.06 : 0,
          scrollTrigger: { trigger: item, start: "top 94%", once: true }
        });
      });

      gsap.from(".rail > span", { scaleX: 0, duration: 0.9, ease: "power3.out", delay: 0.3 });

      el.querySelectorAll<HTMLElement>("[data-val]").forEach((n) => {
        const target = Number(n.dataset.val);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 0.9,
          ease: "power2.out",
          snap: { v: 1 },
          delay: 0.2,
          onUpdate: () => (n.textContent = dua(counter.v))
        });
      });
    }, el);

    return () => ctx.revert();
  }, [root, ready]);
}

/*
  background ikut gerak sedikit pas mouse digeser
  elemen dengan data-pointer bergeser sejauh nilainya (negatif = arah sebaliknya)
  cuma buat mouse, layar sentuh dilewati
*/
export function usePointerParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !finePointer()) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-pointer]"));
    const movers = targets.map((t) => ({
      x: gsap.quickTo(t, "x", { duration: 0.9, ease: "power3" }),
      y: gsap.quickTo(t, "y", { duration: 0.9, ease: "power3" }),
      k: Number(t.dataset.pointer)
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => {
        m.x(nx * m.k);
        m.y(ny * m.k);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [root]);
}

// popup kebuka dengan lingkaran yang melebar, isinya muncul menyusul
export function playModalIn(panel: HTMLElement | null) {
  if (!panel || prefersReducedMotion()) return;
  gsap.fromTo(
    panel,
    { clipPath: "circle(0% at 50% 40%)" },
    { clipPath: "circle(80% at 50% 40%)", duration: 0.55, ease: "power3.out", clearProps: "clipPath" }
  );
  gsap.from(panel.querySelectorAll(".m-item"), { opacity: 0, y: 14, duration: 0.4, ease: "power3.out", stagger: 0.05, delay: 0.12 });
}

// popup nutup dengan lingkaran yang menyempit, habis itu done dijalankan
export function playModalOut(panel: HTMLElement | null, done: () => void) {
  if (!panel || prefersReducedMotion()) return done();
  gsap.to(panel, { clipPath: "circle(0% at 50% 40%)", duration: 0.3, ease: "power2.in", onComplete: done });
}