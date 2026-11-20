"use client";
import { useEffect, useRef } from "react";

/**
 * Rotating dotted globe with two orbit rings and "packets" travelling between them —
 * the Exol Swap hero motif. Pure canvas, paused off-screen, one static frame for reduced motion.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 900;
    const pts: [number, number, number][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
    }
    const packets = Array.from({ length: 9 }, (_, i) => ({ ring: i % 2, t: Math.random(), v: 0.0009 + Math.random() * 0.0012 }));

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let mx = 0, my = 0, tx = 0, ty = 0;

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const mobile = w < 900;
      const cx = mobile ? w * 0.5 : w * 0.72;
      const cy = mobile ? Math.min(h * 0.3, 260) : h * 0.5;
      const R = mobile ? Math.min(w * 0.55, 240) : Math.min(h * 0.42, w * 0.26, 330);
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      const rotY = time * 0.00012 + mx * 0.4;
      const tilt = -0.35 + my * 0.25;
      const cy1 = Math.cos(rotY), sy1 = Math.sin(rotY);
      const cx1 = Math.cos(tilt), sx1 = Math.sin(tilt);

      // halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.7);
      g.addColorStop(0, "rgba(47,107,255,0.22)");
      g.addColorStop(0.5, "rgba(34,211,255,0.06)");
      g.addColorStop(1, "rgba(5,7,13,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // globe dots
      for (const [x0, y0, z0] of pts) {
        const x = x0 * cy1 + z0 * sy1;
        const z1 = -x0 * sy1 + z0 * cy1;
        const y = y0 * cx1 - z1 * sx1;
        const z = y0 * sx1 + z1 * cx1;
        const depth = (z + 1) / 2;
        const px = cx + x * R;
        const py = cy + y * R;
        const s = 0.5 + depth * 1.4;
        ctx.fillStyle = depth > 0.55 ? `rgba(120,190,255,${0.15 + depth * 0.75})` : `rgba(47,107,255,${0.08 + depth * 0.3})`;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }

      // orbit rings
      const rings = [
        { rx: R * 1.45, ry: R * 0.42, rot: -0.38 },
        { rx: R * 1.25, ry: R * 0.3, rot: 0.55 },
      ];
      rings.forEach((rg, i) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rg.rot + my * 0.1);
        ctx.strokeStyle = i ? "rgba(34,211,255,0.22)" : "rgba(59,123,255,0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash(i ? [2, 6] : []);
        ctx.beginPath();
        ctx.ellipse(0, 0, rg.rx, rg.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // packets travelling on rings
      for (const p of packets) {
        if (!reduce) p.t = (p.t + p.v) % 1;
        const rg = rings[p.ring];
        const a = p.t * Math.PI * 2;
        const ex = Math.cos(a) * rg.rx, ey = Math.sin(a) * rg.ry;
        const rr = rg.rot + my * 0.1;
        const px = cx + ex * Math.cos(rr) - ey * Math.sin(rr);
        const py = cy + ex * Math.sin(rr) + ey * Math.cos(rr);
        const front = Math.sin(a) > 0;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 16);
        glow.addColorStop(0, p.ring ? "rgba(34,211,255,0.9)" : "rgba(120,170,255,0.95)");
        glow.addColorStop(1, "rgba(34,211,255,0)");
        ctx.globalAlpha = front ? 1 : 0.35;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e8f6ff";
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(cv);
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden />;
}
