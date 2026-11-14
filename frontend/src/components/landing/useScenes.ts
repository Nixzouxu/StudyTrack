import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// aturan yang sama kayak di backend, cuma buat ilustrasi jam
const BATAS = 24 * 3600;

function format(detik: number) {
  const abs = Math.abs(Math.round(detik));
  const h = String(Math.floor(abs / 3600)).padStart(2, "0");
  const m = String(Math.floor((abs % 3600) / 60)).padStart(2, "0");
  const s = String(abs % 60).padStart(2, "0");
  return `${detik < 0 ? "-" : ""}${h}:${m}:${s}`;
}

const STATE_LABEL = { normal: "NORMAL", soon: "SEGERA", late: "TERLAMBAT" } as const;

/*
  semua animasi halaman landing ada di sini
  kalau pengguna pilih gerak dikurangi atau pakai layar sentuh, animasinya dimatikan
  jadi semua bagian tampil biasa
*/
export function useScenes(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    if (calm.matches) {
      el.classList.add("calm");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // animasi pas halaman baru dibuka
      gsap.from(".mask > span", { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.12, delay: 0.1 });
      gsap.from(".hero-fade", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, delay: 0.55, ease: "power3.out" });
      gsap.from(".dial-wrap", { scale: 0.88, opacity: 0, duration: 1.1, ease: "expo.out", delay: 0.2 });

      // hero: satu timeline dari 0 sampai 1, ikut scroll
      const dial = el.querySelector<HTMLElement>(".dial");
      const label = el.querySelector<HTMLElement>(".readout-label");
      const time = el.querySelector<HTMLElement>(".readout-time");
      const clock = { s: 30 * 3600 };
      let state: keyof typeof STATE_LABEL = "normal";
      const render = () => {
        gsap.set(".dial-hand", { rotation: (clock.s / BATAS) * 360, svgOrigin: "200 200" });
        const next = clock.s < 0 ? "late" : clock.s < BATAS ? "soon" : "normal";
        if (next !== state && dial && label) {
          state = next;
          dial.dataset.state = next;
          label.textContent = STATE_LABEL[next];
        }
        if (time) time.textContent = format(clock.s);
      };

      const hero = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.6 }
      });
      hero
        .to(clock, { s: BATAS, duration: 0.2, onUpdate: render }, 0)
        .to(clock, { s: 0, duration: 0.6, onUpdate: render }, 0.2)
        .to(clock, { s: -2 * 3600, duration: 0.2, onUpdate: render }, 0.8)
        .to(".numeral", { yPercent: -22, scale: 1.15, duration: 1 }, 0)
        .to(".glow-a", { yPercent: 40, duration: 1 }, 0)
        .to(".dial-wrap", { scale: 1.16, duration: 1 }, 0)
        .to(".comp-late", { x: -120, y: -70, rotation: -8, duration: 1 }, 0)
        .to(".comp-soon", { x: -150, y: 40, rotation: 6, duration: 1 }, 0)
        .to(".comp-ok", { x: 110, y: 90, rotation: 7, duration: 1 }, 0)
        .to(".dot", { y: (i) => -80 - i * 40, duration: 1 }, 0)
        .to(".hero-text", { opacity: 0, x: -70, duration: 0.3 }, 0.55);

      render();

      // kata-kata menyala satu per satu
      gsap.fromTo(
        ".w",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: ".words", start: "top top", end: "bottom bottom", scrub: true }
        }
      );

      // demo: kartu masuk, lalu yang hampir deadline pindah ke atas
      const slot = 116;
      const demo = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".demo", start: "top top", end: "bottom bottom", scrub: 0.6 }
      });
      demo
        .fromTo(
          ".dc",
          { opacity: 0, skewY: 8, y: (i) => i * slot + 90 },
          { opacity: 1, skewY: 0, y: (i) => i * slot, duration: 0.25, stagger: 0.06, ease: "back.out(1.5)" },
          0
        )
        .to(".dc-near", { y: 0, duration: 0.25 }, 0.4)
        .to(".dc-new", { y: slot, duration: 0.25 }, 0.4)
        .to(".dc-late", { y: slot * 2, duration: 0.25 }, 0.4)
        .to(".tint, .chip", { opacity: 1, duration: 0.15 }, 0.55)
        .to(".cap-before", { opacity: 0, y: -16, duration: 0.15 }, 0.35)
        .fromTo(".cap-after", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55);

      // panel masuk kebuka dari atas
      gsap.fromTo(
        ".curtain",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: { trigger: ".masuk", start: "top 90%", end: "top 20%", scrub: true }
        }
      );
    }, el);

    // tinggi halaman bisa berubah setelah font siap, jadi dihitung ulang
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [root]);
}