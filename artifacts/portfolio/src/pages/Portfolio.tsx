import { useEffect, useRef, useState } from "react";
import { experiences, projects, awards, ticker, strengths } from "../data";

const NEON = "#b5f23d";

/* ─── Scroll reveal hook ─────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    ob.observe(el);
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 40) el.classList.add("visible");
    return () => ob.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 flex justify-center pt-5 pb-3 px-4">
      <nav
        className="flex items-center gap-6 px-5 py-3 rounded-full border"
        style={{
          background: "rgba(10,22,10,0.85)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(181,242,61,0.18)",
        }}
      >
        {/* Logo */}
        <span
          className="text-sm font-bold tracking-tight whitespace-nowrap"
          style={{ color: NEON }}
        >
          佟乐 · Le Tong
        </span>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Resume pill */}
        <a
          href="mailto:906074545@qq.com"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition-all"
          style={{
            background: "transparent",
            border: `1.5px solid ${NEON}`,
            color: NEON,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = NEON;
            (e.currentTarget as HTMLAnchorElement).style.color = "#0a160a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = NEON;
          }}
        >
          Reach me ↗
        </a>

        {/* Mobile toggle */}
        <button
          className="sm:hidden flex flex-col gap-1 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="block w-4 h-0.5 bg-white" />
          <span className="block w-4 h-0.5 bg-white" />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-4 right-4 rounded-2xl border p-5 flex flex-col gap-3"
          style={{
            background: "#0d1f0d",
            borderColor: "rgba(181,242,61,0.2)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              className="text-sm font-medium text-white/80 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ─── Ticker / Marquee ───────────────────────────────────────────── */
function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{ borderColor: "rgba(181,242,61,0.25)", background: "rgba(181,242,61,0.07)" }}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-5 text-sm font-medium whitespace-nowrap flex items-center gap-3"
            style={{ color: NEON }}
          >
            <span className="opacity-50">+</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">
      <div className="max-w-2xl">
        <p className="text-white/50 text-sm font-medium mb-5">
          你好 👋, great to have you here
        </p>

        <h1
          className="font-black uppercase leading-[1.0] tracking-tight mb-6"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            color: NEON,
          }}
        >
          I'M A UX DESIGNER<br />CRAFTING E-COMMERCE<br />EXPERIENCES
        </h1>

        <p className="text-white/60 text-base max-w-lg leading-relaxed mb-8">
          2+ years at Kuaishou & ByteDance, turning data into design decisions
          that move metrics and elevate user journeys.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {["30+ Design Awards", "AIGC Workflow", "Data-driven UX", "Global Perspective"].map((b) => (
            <span
              key={b}
              className="text-xs font-medium px-3 py-1.5 rounded-full border"
              style={{ borderColor: "rgba(181,242,61,0.3)", color: "rgba(181,242,61,0.8)" }}
            >
              {b}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-full text-sm font-bold transition-all"
            style={{ background: NEON, color: "#0a160a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            View Work ↓
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-full text-sm font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Section label ──────────────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: NEON }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(181,242,61,0.15)" }} />
    </div>
  );
}

/* ─── Experience ─────────────────────────────────────────────────── */
function Experience() {
  return (
    <section id="work" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel label="Work Experience" />
      <h2
        className="font-black uppercase mb-10"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "white" }}
      >
        Career Path
      </h2>
      <div className="flex flex-col gap-5">
        {experiences.map((exp, i) => (
          <Reveal key={exp.company + exp.role} delay={i * 80}>
            <div
              className="rounded-2xl p-6 border group hover:border-[rgba(181,242,61,0.35)] transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <div className="font-bold text-white text-base">{exp.company}</div>
                  <div
                    className="text-sm font-medium mt-0.5"
                    style={{ color: NEON }}
                  >
                    {exp.role}
                  </div>
                </div>
                <span className="text-xs text-white/40 border border-white/10 px-3 py-1 rounded-full self-start whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-white/55 flex items-start gap-2">
                    <span className="mt-1 text-[0.4rem] rounded-full flex-shrink-0" style={{ color: NEON }}>●</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Projects ───────────────────────────────────────────────────── */
function Projects() {
  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel label="Selected Projects" />
      <h2
        className="font-black uppercase mb-10"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "white" }}
      >
        Product Stories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj, i) => (
          <Reveal key={proj.title} delay={i * 70}>
            <div
              className="rounded-2xl p-5 border h-full flex flex-col group hover:border-[rgba(181,242,61,0.35)] hover:-translate-y-1 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="font-bold text-white text-sm leading-snug mb-1">
                {proj.title}
              </div>
              <div className="text-xs text-white/35 mb-3">{proj.subtitle}</div>
              <div
                className="text-xs font-semibold mb-4 px-2.5 py-1 rounded-full self-start"
                style={{ background: "rgba(181,242,61,0.1)", color: NEON }}
              >
                {proj.metrics}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] px-2 py-0.5 rounded-full border text-white/40"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel label="About Me" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <Reveal>
          <div
            className="rounded-2xl p-6 border h-full"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: NEON }}
            >
              Education
            </h3>
            <div className="flex flex-col gap-5">
              <div>
                <div className="font-bold text-white text-sm">Beijing University of Science & Technology</div>
                <div className="text-xs text-white/50 mt-0.5">M.A. Design · Interaction Design</div>
                <div className="text-xs text-white/30 mt-0.5">2021 – 2024 · 1st Class Scholarship</div>
              </div>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div>
                <div className="font-bold text-white text-sm">Shenyang Aerospace University</div>
                <div className="text-xs text-white/50 mt-0.5">B.E. Industrial Design · Interaction & Experience</div>
                <div className="text-xs text-white/30 mt-0.5">2016 – 2020 · Outstanding Graduate of Liaoning Province</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Strengths */}
        <Reveal delay={100}>
          <div
            className="rounded-2xl p-6 border h-full"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: NEON }}
            >
              Core Strengths
            </h3>
            <ul className="flex flex-col gap-3 mb-5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span style={{ color: NEON }} className="mt-0.5 text-xs">→</span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {["Figma", "Principle", "Axure", "Midjourney", "Stable Diffusion", "AIGC"].map((t) => (
                  <span
                    key={t}
                    className="text-[0.65rem] px-2 py-0.5 rounded-full border text-white/40"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Awards */}
        <Reveal delay={150} className="lg:col-span-2">
          <div
            className="rounded-2xl p-6 border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: NEON }}
            >
              Awards & Honours
            </h3>
            <div className="flex flex-wrap gap-2">
              {awards.map((a, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full border text-white/55 hover:text-white transition-colors"
                  style={{ borderColor: "rgba(181,242,61,0.2)" }}
                >
                  🏅 {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */
function Contact() {
  return (
    <footer
      id="contact"
      className="border-t py-16"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2
          className="font-black uppercase mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: NEON }}
        >
          LET'S WORK TOGETHER
        </h2>
        <p className="text-white/50 text-sm mb-8">
          Open to full-time roles & collaborations
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a
            href="mailto:906074545@qq.com"
            className="px-6 py-3 rounded-full text-sm font-bold transition-all"
            style={{ background: NEON, color: "#0a160a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            ✉️ 906074545@qq.com
          </a>
          <a
            href="tel:+8618842417092"
            className="px-6 py-3 rounded-full text-sm font-bold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            📱 +86 18842417092
          </a>
        </div>
        <p className="text-white/20 text-xs">
          © 2025 佟乐 (Le Tong) — Designed with intention & curiosity
        </p>
      </div>
    </footer>
  );
}

/* ─── Scroll indicator ───────────────────────────────────────────── */
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-40">
      <div className="w-px h-8 animate-pulse" style={{ background: NEON }} />
      <span className="text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: NEON }}>
        Scroll
      </span>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────── */
export default function Portfolio() {
  return (
    <div style={{ background: "#0a160a", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Ticker />
      <Experience />
      <Projects />
      <About />
      <Contact />
      <ScrollHint />
    </div>
  );
}
