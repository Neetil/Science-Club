"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  // Event countdown example: set next activity date here
  const nextEvent = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7, 17, 30), []);
  const [remaining, setRemaining] = useState<string>("");

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date().getTime();
      const diff = nextEvent.getTime() - now;
      if (diff <= 0) return setRemaining("00d 00h 00m 00s");
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setRemaining(`${String(d).padStart(2, "0")}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    }, 1000);
    return () => clearInterval(id);
  }, [nextEvent]);

  // Simple galaxy/particle canvas background
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const DPR = Math.max(1, Math.min(2, (globalThis as any).devicePixelRatio || 1));
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
      vz: (Math.random() - 0.5) * 0.0002,
    }));
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * DPR);
      canvas.height = Math.floor(clientHeight * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    const draw = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        if (p.z < 0 || p.z > 1) p.vz *= -1;
        const px = (p.x - 0.5) * (w * 0.9) + w / 2;
        const py = (p.y - 0.5) * (h * 0.9) + h / 2;
        const size = p.r * (0.5 + p.z * 1.5);
        const grd = ctx.createRadialGradient(px, py, 0, px, py, size * 6);
        grd.addColorStop(0, "rgba(208,80,255,0.9)");
        grd.addColorStop(0.5, "rgba(0,255,214,0.7)");
        grd.addColorStop(1, "rgba(0,160,255,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const icons = [
    { label: "Atom", emoji: "⚛️", cls: "float-slow" },
    { label: "Rocket", emoji: "🚀", cls: "float-med" },
    { label: "DNA", emoji: "🧬", cls: "float-fast" },
    { label: "Satellite", emoji: "🛰️", cls: "float-med" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="snap-y">
      {/* HERO */}
      <section className="section snap-start relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(0,160,255,0.15),transparent_60%)]" />
        </div>
        <div className="container-g relative">
          <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center glow">🔬</div>
              <span className="font-semibold tracking-tight">Science Club</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {[
                ["About", "about"],
                ["Events", "events"],
                ["Gallery", "gallery"],
                ["Achievements", "achievements"],
                ["Join Us", "join"],
              ].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(String(id))} className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="mt-14 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs uppercase tracking-wider">Gen-Z • Futuristic • Playful</div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Where <span className="neon-text">Curiosity</span> Meets <span className="neon-text">Innovation</span>
              </h1>
              <p className="text-white/80 max-w-xl">Medi-Caps University Science Club — your lab for ideas, launches, and late-night breakthroughs. Join events, build projects, and vibe with folks who love science as much as memes.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#join" onClick={(e)=>{e.preventDefault();scrollTo("join");}} className="btn-neon">
                  <span className="px-6 py-3 rounded-xl">Join the Club</span>
                </a>
                <a href="#events" onClick={(e)=>{e.preventDefault();scrollTo("events");}} className="btn-neon">
                  <span className="px-6 py-3 rounded-xl">See Events</span>
                </a>
              </div>
              <div className="text-sm text-white/70">Next event starts in <span className="font-semibold text-white">{remaining}</span></div>
            </div>

            <div className="relative min-h-[420px] lg:min-h-[520px]">
              <div className="absolute inset-0 glass rounded-3xl" />
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center px-6">
                  <div className="text-white/80 mb-4">Interactive DNA/Rocket</div>
                  <div className="mx-auto size-48 md:size-64 rounded-full bg-gradient-to-b from-white/10 to-white/0 border border-white/20 grid place-items-center">
                    <div className="size-40 md:size-52 rounded-full border-2 border-dashed border-white/30 animate-spin-slow" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 [mask-image:radial-gradient(white,transparent_65%)]">
                <div className="absolute -top-6 -left-4 glow text-5xl opacity-90 float-slow">⚛️</div>
                <div className="absolute top-10 right-6 glow text-4xl opacity-90 float-med">🧬</div>
                <div className="absolute bottom-6 left-10 glow text-5xl opacity-90 float-fast">🚀</div>
                <div className="absolute -bottom-4 right-8 glow text-4xl opacity-90 float-med">🛰️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section snap-start">
        <div className="container-g grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">About the Club</h2>
            <p className="text-white/80">We explore physics, biology, astronomy, and the wild intersections of tech and science. Expect talks, hacky workshops, telescope nights, and collabs that actually ship.</p>
            <ul className="grid grid-cols-2 gap-3 text-sm text-white/80">
              <li className="glass rounded-xl p-4">Hands-on Workshops</li>
              <li className="glass rounded-xl p-4">Guest Talks</li>
              <li className="glass rounded-xl p-4">Stargazing</li>
              <li className="glass rounded-xl p-4">Research Sprints</li>
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-video w-full glass rounded-2xl grid place-items-center text-white/80">Club Reel Coming Soon 🎬</div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="section snap-start">
        <div className="container-g">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 space-y-3 hover:-translate-y-1 transition-transform">
                <div className="text-sm text-white/70">Upcoming</div>
                <div className="text-xl font-semibold">Event {i}: Quantum Jam</div>
                <p className="text-white/75 text-sm">Build tiny experiments, big ideas. Snacks guaranteed.</p>
                <button className="btn-neon"><span className="px-4 py-2 rounded-lg">Save the date</span></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="section snap-start">
        <div className="container-g">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="aspect-square glass rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="section snap-start">
        <div className="container-g">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["National Hackathon Winners","Published 3 Research Papers","Built a Student CubeSat"].map((t,idx)=>(
              <div key={idx} className="glass rounded-2xl p-6">
                <div className="text-2xl">🏆</div>
                <div className="mt-3 font-semibold">{t}</div>
                <p className="text-white/75 text-sm mt-1">Proud moments powered by hustle, curiosity, and a lil' caffeine.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="section snap-start">
        <div className="container-g grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Join Us</h2>
            <p className="text-white/80 mt-3">Pull up to our next meetup or drop your deets — we'll ping you with updates.</p>
            <form onSubmit={(e)=>{e.preventDefault(); alert("Submitted! See you at the club 🚀");}} className="mt-6 space-y-3 max-w-md">
              <input required placeholder="Your name" className="w-full glass rounded-xl px-4 py-3 outline-none placeholder:text-white/50" />
              <input required type="email" placeholder="Email" className="w-full glass rounded-xl px-4 py-3 outline-none placeholder:text-white/50" />
              <button className="btn-neon w-full"><span className="px-4 py-3 rounded-lg w-full text-center">Count me in</span></button>
              <div className="text-xs text-white/60">No spam. Only science.</div>
            </form>
          </div>
          <div className="relative min-h-[260px]">
            {icons.map((ic, i) => (
              <div key={i} className={`absolute text-5xl glow ${ic.cls}`} style={{ left: `${15 + i*18}%`, top: `${10 + (i%3)*22}%` }}>{ic.emoji}</div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-white/60 text-sm">© {new Date().getFullYear()} Science Club • Medi-Caps University</footer>
    </main>
  );
}
