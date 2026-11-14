import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rings from "./Rings";
import { prefersReducedMotion, usePointerParallax } from "../lib/motion";

// background berlapis buat semua halaman setelah login
// tiap lapisan geraknya beda pas scroll, dan agak ikut mouse
export default function AppBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerParallax(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const scrub = { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true };
      gsap.to(".bd-0", { y: -70, ease: "none", scrollTrigger: scrub });
      gsap.to(".bd-1", { y: -150, ease: "none", scrollTrigger: scrub });
      gsap.to(".bd-2", { y: -280, ease: "none", scrollTrigger: scrub });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="backdrop" ref={ref} aria-hidden="true">
      <div className="bd-layer bd-0" data-depth="0">
        <div className="bd-inner" data-pointer="12">
          <Rings className="bd-rings" />
        </div>
      </div>
      <div className="bd-layer bd-1" data-depth="1">
        <div className="bd-inner" data-pointer="26">
          <span className="bd-glow bd-glow-a" />
          <span className="bd-glow bd-glow-b" />
        </div>
      </div>
      <div className="bd-layer bd-2" data-depth="2">
        <div className="bd-inner" data-pointer="-34">
          <span className="bd-dot" style={{ left: "14%", top: "30%" }} />
          <span className="bd-dot" style={{ left: "82%", top: "58%" }} />
          <span className="bd-dot sm" style={{ left: "46%", top: "78%" }} />
        </div>
      </div>
    </div>
  );
}