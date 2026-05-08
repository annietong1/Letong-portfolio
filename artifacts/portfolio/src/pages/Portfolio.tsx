import { useEffect, useRef, useState, useCallback } from "react";

const NEON = "#b5f23d";
const BG = "#0b150b";

/* ── Scroll reveal ─────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("visible"); ob.unobserve(el); } }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    ob.observe(el);
    if (el.getBoundingClientRect().top < window.innerHeight - 40) el.classList.add("visible");
    return () => ob.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* ── Animated counter ──────────────────────────────────────────── */
function Counter({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        let start = 0;
        const step = () => {
          start += 1;
          setVal(start);
          if (start < target) setTimeout(step, 60);
        };
        step();
      }
    }, { threshold: 0.5 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [target]);
  return <div ref={ref} className="stat-value"><span>{val}{suffix}</span></div>;
}

/* ── Placeholder image ─────────────────────────────────────────── */
function ImgPlaceholder({ label = "Image", className = "", style = {} }: { label?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl ${className}`}
      style={{ border: "1.5px dashed rgba(181,242,61,0.25)", background: "rgba(181,242,61,0.03)", ...style }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={NEON} strokeWidth="1.5" strokeOpacity="0.5"/>
        <circle cx="12" cy="12" r="3" stroke={NEON} strokeWidth="1.5" strokeOpacity="0.5"/>
        <path d="M8 5V4M16 5V4" stroke={NEON} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
      </svg>
      <span style={{ color: NEON, opacity: 0.4, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Navbar ────────────────────────────────────────────────────── */
function Navbar() {
  const [mob, setMob] = useState(false);
  const links = [
    { href: "#home",       label: "Home" },
    { href: "#projects",   label: "Projects" },
    { href: "#about",      label: "About me" },
    { href: "#experience", label: "Reach me" },
    { href: "#uiwall",     label: "Practice" },
  ];
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); setMob(false);
    const onHome = !window.location.hash.startsWith("#/");
    const scrollTo = () => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    if (onHome) { scrollTo(); }
    else { window.location.hash = ""; setTimeout(scrollTo, 60); }
  };
  return (
    <header className="sticky top-0 z-50 flex justify-center pt-5 pb-2 px-4">
      <nav className="flex items-center gap-5 px-5 py-2.5 rounded-full"
        style={{ background: "rgba(8,18,8,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(181,242,61,0.15)" }}>
        {/* logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: NEON, color: BG }}>A</div>
          <span className="text-sm font-bold text-white hidden xs:inline">Annie</span>
        </div>
        <div className="hidden sm:flex items-center gap-5 ml-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}
              className="text-sm font-medium text-white/65 hover:text-white transition-colors">{l.label}</a>
          ))}
        </div>
        <a href="/resume.pdf" download="LeTong_Resume.pdf"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold px-4 py-1.5 rounded-full transition-all ml-1"
          style={{ border: `1.5px solid ${NEON}`, color: NEON }}
          onMouseEnter={(e) => { const t = e.currentTarget; t.style.background = NEON; t.style.color = BG; }}
          onMouseLeave={(e) => { const t = e.currentTarget; t.style.background = "transparent"; t.style.color = NEON; }}>
          Resume ↓
        </a>
        <button className="sm:hidden px-2" onClick={() => setMob(!mob)} aria-label="menu">
          <div className="space-y-1"><span className="block w-4 h-0.5 bg-white"/><span className="block w-4 h-0.5 bg-white"/></div>
        </button>
      </nav>
      {mob && (
        <div className="absolute top-16 left-4 right-4 rounded-2xl p-5 flex flex-col gap-3 z-50"
          style={{ background: "#0d1f0d", border: "1px solid rgba(181,242,61,0.2)" }}>
          {links.map((l) => <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}
            className="text-sm font-medium text-white/80 hover:text-white">{l.label}</a>)}
        </div>
      )}
    </header>
  );
}

/* ── Hanging ID Card ───────────────────────────────────────────── */
function HangingCard() {
  return (
    <div className="flex flex-col items-center select-none">
      {/* hook */}
      <div className="flex flex-col items-center" style={{ marginBottom: "-2px" }}>
        <div style={{ width: "2px", height: "28px", background: "rgba(255,255,255,0.2)" }} />
        <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.07)" }} />
      </div>
      {/* card */}
      <div className="card-hang flex flex-col items-center rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 168, background: "white", paddingBottom: "1.2rem" }}>
        <img src="/p2.png" alt="Profile" style={{ width: "100%", height: 180, objectFit: "cover", objectPosition: "center top", display: "block" }} />
        <div className="px-4 pt-3 text-center w-full">
          <p className="font-black text-base text-black tracking-tight">Le Tong</p>
          <div className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "#f0f0f0", color: "#444" }}>
            Available for work
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Spinning badge ────────────────────────────────────────────── */
function SpinBadge() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <div className="spin-badge absolute inset-0">
        <svg viewBox="0 0 100 100" width="100" height="100">
          <defs>
            <path id="cp" d="M 50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0"/>
          </defs>
          <text fontSize="7.5" fontWeight="600" letterSpacing="1" fill={NEON} fontFamily="Inter, sans-serif">
            <textPath href="#cp">✦ Drag to play ✦ Drag to play ✦ Drag to</textPath>
          </text>
        </svg>
      </div>
      {/* crosshair */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="5" stroke={NEON} strokeWidth="1.5"/>
        <line x1="14" y1="2" x2="14" y2="9" stroke={NEON} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="19" x2="14" y2="26" stroke={NEON} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="2" y1="14" x2="9" y2="14" stroke={NEON} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="19" y1="14" x2="26" y2="14" stroke={NEON} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Ticker ────────────────────────────────────────────────────── */
const TICKER_ITEMS = ["Product Design", "User-Centric", "Business Impact", "Design thinking", "Problem solving", "Immediate Joiner", "Product Design", "User-Centric", "Business Impact", "Design thinking", "Problem solving", "Immediate Joiner"];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-3" style={{ background: NEON, marginTop: "2rem" }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="mx-4 text-sm font-semibold whitespace-nowrap flex items-center gap-3" style={{ color: BG }}>
            <span className="opacity-50 text-xs">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Scroll indicator ──────────────────────────────────────────── */
function ScrollIndicator() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const h = () => setShow(window.scrollY < 80);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
      <div className="scroll-caret" />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]" style={{ color: NEON }}>SCROLL</span>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 pt-28 pb-8 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Left */}
        <div className="flex-1 min-w-0 pt-4">
          <p className="text-white/50 text-sm font-medium mb-5 flex items-center gap-2">
            Hello <span>👋</span>, great to have you here
          </p>
          <h1 className="font-black uppercase leading-[0.95] tracking-tight mb-6 text-white"
            style={{ fontSize: "clamp(3rem, 8.5vw, 6rem)" }}>
            I'M A{" "}
            <span style={{ color: NEON }}>PRODUCT<br />DESIGNER</span>
          </h1>
          <p className="text-white/55 text-base max-w-md leading-relaxed">
            2+ years experience in e-commerce & global platforms. An adventurous designer passionate about exploring and learning new things.
          </p>
        </div>

        {/* Right — card + badge */}
        <div className="flex items-start gap-4 md:pt-0 pt-4 self-start md:self-center">
          <HangingCard />
          <div className="mt-16">
            <SpinBadge />
          </div>
        </div>
      </div>

      <Ticker />
      <ScrollIndicator />
    </section>
  );
}

/* ── Featured Projects ─────────────────────────────────────────── */
const FEATURED = [
  { title: "直播间进间链路设计", enTitle: "Live Room Entry Path Design", tags: ["框架创新", "0-1设计", "设计专利", "全链路设计"], img: "/proj1.png" },
  { title: "评价填写链路优化",   tags: ["AIGC", "交互优化", "提效率"],                  img: "/proj2.png" },
  { title: "商品评价导购链路优化", tags: ["UI改版", "促转化"],                           img: "/proj3.png" },
  { title: "春节送礼物项目",     tags: ["0-1搭建", "紧急项目", "多端设计"],              img: "/proj4.png" },
];

const SIDE = [
  { title: "11·11营销设计",          tags: ["大促", "UI", "组件"],  img: "/side1.png" },
  { title: "B 端商家侧设计",          tags: ["to B", "AI"],          img: "/side2.png" },
  { title: "TikTok internship project", tags: ["to C", "广告样式"], img: "/side3.png" },
];

function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
      {/* Featured */}
      <Reveal>
        <h2 className="font-black text-white mb-10" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Featured Projects
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
        {FEATURED.map((p, i) => {
          const linkHash = i === 0 ? "#/project/1" : null;
          const handleClick = linkHash ? () => { window.location.hash = linkHash; } : undefined;
          return (
            <Reveal key={i} delay={i * 80}>
              <div
                className="project-card rounded-2xl overflow-hidden cursor-pointer group"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={handleClick}
                role={linkHash ? "link" : undefined}
                tabIndex={linkHash ? 0 : undefined}
                onKeyDown={linkHash ? (e) => { if (e.key === "Enter") handleClick?.(); } : undefined}
              >
                <div style={{ width: "100%", overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                  <img src={p.img} alt={p.title}
                    style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
                </div>
                <div className="p-5">
                  <p className="font-bold text-white text-base leading-snug mb-3 group-hover:text-[#b5f23d] transition-colors">
                    {p.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-xs text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Side Projects */}
      <Reveal>
        <h2 className="font-black text-white mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Side Projects
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SIDE.map((p, i) => (
          <Reveal key={i} delay={i * 70}>
            <div className="project-card rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ width: "100%", overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                <img src={p.img} alt={p.title}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }} />
              </div>
              <div className="p-4">
                <p className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#b5f23d] transition-colors">
                  {p.title}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[0.65rem] text-white/35 border border-white/10 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Personal Experience ───────────────────────────────────────── */
const WORK_EXP = [
  {
    company: "Kuaishou · 快手",
    role: "UX Designer · E-commerce Design Center",
    period: "2024.07 – 2026.03",
    type: "full-time" as const,
    bullets: [
      "Led live-streaming room redesign, increased entry rate by +1.145%",
      "Optimized product display & visual hierarchy, lifted entry rate by +0.947% in total",
      "Revamped review/comment full chain with AI, boosted payment conversion +0.352% and effective reviews +2.902%",
      "Owned 618/Double 11 UI and navigation bar design system components, coordinated team work",
    ],
  },
  {
    company: "ByteDance · 字节跳动",
    role: "Product Design Intern (Ads & Commerce)",
    period: "2022.10 – 2024.03",
    type: "internship" as const,
    bullets: [
      "Designed livestream/short-video ad formats, boosted Adv+ +0.99%, GMV +0.66%, CVR +20%",
      "Integrated e-commerce ads into search, built design specs with 5+ teams",
      "Launched 0→1 AR try-on ads, generated $3.2M estimated first-year revenue",
      "Optimized ad quality feedback loop, increased survey recovery rate by 18%",
    ],
  },
  {
    company: "ByteDance · 字节跳动",
    role: "Interaction Design Intern (Global E-commerce)",
    period: "2022.05 – 2022.09",
    type: "internship" as const,
    bullets: [
      "Led S-level Indonesia Independence Day H5 project, increased new user GMV +2.715% and conversion +4.54%",
      "Researched SEA cross-cultural design patterns, supported mega-sale strategies",
      "Co-authored UK localized marketing design white paper",
    ],
  },
  {
    company: "Tencent · 腾讯",
    role: "Interaction Design Intern",
    period: "2020.04 – 2020.08",
    type: "internship" as const,
    bullets: [
      "Designed game interfaces and interaction flows for The Legend of Qin, fixed bugs",
      "Built game component library from scratch, improved development handoff efficiency by 30%",
    ],
  },
];

const EDUCATION = [
  {
    school: "Beijing University of Science & Technology",
    degree: "M.A. Design · Interaction Design",
    period: "2021 – 2024",
    note: "GPA: Top tier, 1st class scholarship",
  },
  {
    school: "Shenyang Aerospace University",
    degree: "B.E. Industrial Design (Interaction & Experience)",
    period: "2016 – 2020",
    note: "Outstanding Graduate of Liaoning Province",
  },
];

function WorkExpList() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="space-y-10 mb-20">
      {WORK_EXP.map((job, i) => {
        const isHovered = hovered === i;
        const isFull = job.type === "full-time";
        return (
          <Reveal key={i} delay={i * 60}>
            <div
              className="rounded-xl px-6 py-5 transition-all duration-300 cursor-default"
              style={{
                borderLeft: `2px solid ${isHovered ? NEON : "rgba(255,255,255,0.12)"}`,
                background: isHovered ? "rgba(181,242,61,0.05)" : "transparent",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`font-black transition-colors duration-200 ${isFull ? "text-xl" : "text-base"}`}
                  style={{ color: isHovered ? NEON : "white" }}>{job.company}</span>
                <span className="text-[0.62rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: isFull ? "rgba(181,242,61,0.15)" : "rgba(255,255,255,0.1)", color: isFull ? NEON : "rgba(255,255,255,0.5)" }}>
                  {isFull ? "Full-time" : "Internship"}
                </span>
              </div>
              <p className={`mb-1 transition-colors duration-200 ${isFull ? "text-base font-semibold" : "text-sm font-medium"}`}
                style={{ color: isHovered ? "rgba(181,242,61,0.85)" : "rgba(255,255,255,0.55)" }}>
                {job.role}
              </p>
              <p className="text-xs text-white/30 mb-4 font-medium">{job.period}</p>
              <ul className="space-y-1.5">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm leading-relaxed transition-colors duration-200"
                    style={{ color: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)" }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-200"
                      style={{ background: isHovered ? NEON : "rgba(255,255,255,0.3)" }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <h2 className="font-black text-white mb-14" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Personal Experience
        </h2>
      </Reveal>

      {/* Work Experience */}
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-8" style={{ color: NEON }}>
          Work Experience
        </p>
      </Reveal>
      <WorkExpList />

      {/* Education */}
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-8" style={{ color: NEON }}>
          Education
        </p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {EDUCATION.map((edu, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-black text-white text-base mb-1">{edu.school}</p>
              <p className="text-sm font-semibold mb-1" style={{ color: NEON }}>{edu.degree}</p>
              <p className="text-xs text-white/30 mb-3">{edu.period}</p>
              <p className="text-xs text-white/45">{edu.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── About Photo with tilt + float ─────────────────────────────── */
function AboutPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);
  const raf = useRef<number>(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setTilt({ rx: -y * 14, ry: x * 14 });
    });
  }, []);

  const onLeave = useCallback(() => {
    setHovered(false);
    cancelAnimationFrame(raf.current);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ perspective: "800px", cursor: "none", display: "inline-block", width: "100%", maxWidth: 380 }}
    >
      <div
        className={hovered ? "" : "photo-float"}
        style={{
          transform: hovered
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.03)`
            : undefined,
          transition: hovered ? "transform 0.08s linear" : "transform 0.6s ease",
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: hovered
            ? `${-tilt.ry * 1.2}px ${tilt.rx * 1.2}px 40px rgba(181,242,61,0.18)`
            : "0 8px 40px rgba(0,0,0,0.35)",
          willChange: "transform",
        }}
      >
        <img
          src="/about-photo.png"
          alt="Le Tong"
          style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <h2 className="font-black text-white mb-12" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          About Me
        </h2>
      </Reveal>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Text + stats */}
        <div className="flex-1">
          <Reveal>
            <ul className="text-white/55 text-base leading-relaxed mb-10 max-w-lg space-y-3">
              <li className="flex items-start gap-2"><span style={{ color: NEON }}>→</span> Global & local design vision, data-driven and self-motivated.</li>
              <li className="flex items-start gap-2"><span style={{ color: NEON }}>→</span> Keep track of industry trends and focus on real user insights.</li>
              <li className="flex items-start gap-2"><span style={{ color: NEON }}>→</span> Diverse aesthetics with AIGC skills to boost design efficiency.</li>
              <li className="flex items-start gap-2"><span style={{ color: NEON }}>→</span> Good at team collaboration and accumulating design assets.</li>
            </ul>
          </Reveal>

          {/* Stats */}
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-10">
              {[
                { target: 2,  suffix: "+", label: "Years of Experience" },
                { target: 4,  suffix: "+", label: "Completed Projects" },
                { target: 3,  suffix: "+", label: "Companies worked" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-black text-5xl text-white mb-1">
                    <Counter target={s.target} suffix={s.suffix} />
                  </div>
                  <p className="text-white/40 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Photo */}
        <Reveal delay={150} className="flex-shrink-0 flex justify-center lg:justify-end">
          <AboutPhoto />
        </Reveal>
      </div>
    </section>
  );
}

/* ── UI Wall ───────────────────────────────────────────────────── */
function UIWall() {
  const items = Array.from({ length: 8 }, (_, i) => i);
  const doubled = [...items, ...items];
  return (
    <section id="uiwall" className="py-12 overflow-hidden">
      <Reveal>
        <h2 className="font-black text-white mb-8 px-6 max-w-6xl mx-auto" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
          Some AI Practices
        </h2>
      </Reveal>
      <div className="wall-track">
        {doubled.map((_, i) => (
          <ImgPlaceholder key={i} label="UI Visual" style={{ width: 160, height: 280, flexShrink: 0, borderRadius: "1rem" }} />
        ))}
      </div>
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="font-black uppercase text-white mb-3" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 1.05 }}>
            Available for<br />
            <span style={{ color: NEON }}>New Challenges</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="text-white/45 text-base mb-10">
            Open to new roles, feedback, or a simple coffee chat.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="flex flex-wrap justify-center gap-5 mb-14 text-sm text-white/40">
            <a href="tel:+8618842417092" className="hover:text-white transition-colors">+86 18842417092</a>
            <span>Email:</span>
            <a href="mailto:906074545@qq.com" className="hover:text-white transition-colors">906074545@qq.com</a>
          </div>
        </Reveal>

        <p className="text-white/20 text-xs">© Le Tong 2026</p>
      </div>
    </section>
  );
}

/* ── Project Detail helpers ────────────────────────────────────── */
function DetailImg({ src, alt, noBorder }: { src: string; alt: string; noBorder?: boolean }) {
  return (
    <Reveal>
      <div className="rounded-2xl overflow-hidden my-10"
        style={noBorder ? {} : { border: "1px solid rgba(255,255,255,0.07)" }}>
        <img src={src} alt={alt} loading="lazy"
          style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    </Reveal>
  );
}

const GlassCard: React.FC<React.PropsWithChildren<{ neon?: boolean; className?: string }>> = ({ children, neon, className = "" }) => (
  <div className={className} style={{
    background: neon ? "rgba(181,242,61,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${neon ? "rgba(181,242,61,0.3)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "1rem", padding: "1.25rem 1.5rem",
  }}>{children}</div>
);

function SectionDivider({ num, zh, en, sub }: { num: string; zh: string; en: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mt-20 mb-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-black text-4xl" style={{ color: NEON }}>{num}</span>
          <div>
            {zh && <p className="text-white/40 text-xs mb-0.5 leading-tight">{zh}</p>}
            <p className="font-black text-white tracking-wide uppercase" style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)" }}>{en}</p>
          </div>
        </div>
        {sub && <p className="text-white/55 text-sm leading-relaxed max-w-2xl mt-2">{sub}</p>}
      </div>
    </Reveal>
  );
}

function CardTypeHeader({ label, color = NEON, bullets }: { label: string; color?: string; bullets: string[] }) {
  return (
    <Reveal>
      <div className="mb-4 mt-8">
        <span className="inline-block font-black text-sm px-3 py-1 rounded-md mb-3"
          style={{ background: color, color: "#0b150b" }}>{label}</span>
        <ul className="space-y-1">
          {bullets.map((b) => (
            <li key={b} className="text-white/65 text-sm flex gap-2">
              <span className="text-white/25 shrink-0">•</span>{b}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function ProjectDetail({ title }: { title: string }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const goHome = () => { window.location.hash = ""; };
  const p = FEATURED.find((f) => f.title === title);
  const displayTitle = (p as { enTitle?: string } & typeof FEATURED[0])?.enTitle ?? title;

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-28">

        <button onClick={goHome}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-12 transition-opacity"
          style={{ color: NEON }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.65"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
          ← Back to Home
        </button>

        {/* HERO */}
        <Reveal>
          <p className="text-center font-black tracking-[0.35em] text-xs mb-5" style={{ color: NEON }}>CASE STUDY</p>
          <h1 className="font-black text-white text-center mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "0.01em", lineHeight: 1.1 }}>
            {displayTitle}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["New Framework for High-Exposure Scenarios", "Full-Funnel Capability"].map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ border: `1px solid ${NEON}`, color: NEON, letterSpacing: "0.03em" }}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-white/50 text-center max-w-xl mx-auto leading-relaxed text-sm">
            A new entry-card framework for high-exposure live-room scenarios — surfacing combined product and marketing signals to drive entry rate.
          </p>
        </Reveal>

        <DetailImg src="/provided-img1.png" alt="Before vs After — single card to composite card" noBorder />

        {/* Before / After */}
        <Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <GlassCard>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Before — Single Card</p>
              <p className="text-white/75 text-sm leading-relaxed">
                Either product info <em>or</em> a marketing campaign — only one type at a time.
              </p>
            </GlassCard>
            <GlassCard neon>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NEON }}>After — Composite Card</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Both product and marketing signals in one card, maximising benefit-point density.
              </p>
            </GlassCard>
          </div>
          <p className="text-center text-sm text-white/45">
            Goal —{" "}
            <span className="text-white font-semibold">show <span style={{ color: NEON }}>combined benefit points</span> within limited card space</span>
          </p>
        </Reveal>

        <DetailImg src="/provided-img2.png" alt="Framework structure — 8:2 main/sub card ratio" noBorder />

        {/* Validation */}
        <Reveal>
          <p className="text-center font-black text-xs tracking-widest uppercase mb-5" style={{ color: NEON }}>Validation Hypotheses</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">A</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Does combining benefit points in a composite card drive higher live-room entry?
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">B</p>
              <p className="text-white/80 text-sm leading-relaxed">
                What type of info — product or marketing — is the stronger entry driver?
              </p>
            </GlassCard>
          </div>
        </Reveal>

        {/* SECTION 1 — FRAMEWORK */}
        <SectionDivider num="1" zh="" en="Framework"
          sub="Allocate visual weight between main and sub cards. Settled on an 8 : 2 ratio — main card prominent enough to attract, sub card visible enough to inform." />
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            <GlassCard>
              <p className="font-bold text-white text-sm mb-1">Structure</p>
              <p className="text-white/45 text-xs leading-relaxed">Balance main card prominence vs sub card recognisability</p>
            </GlassCard>
            <GlassCard neon>
              <p className="font-bold text-sm mb-1" style={{ color: NEON }}>8 : 2</p>
              <p className="text-white/55 text-xs leading-relaxed">Main card: core attraction · Sub card: supplementary info</p>
            </GlassCard>
            <GlassCard>
              <p className="font-bold text-white text-sm mb-1">Main / Sub</p>
              <p className="text-white/45 text-xs leading-relaxed">Main drives desire · Sub reinforces decision</p>
            </GlassCard>
          </div>
        </Reveal>

        {/* SECTION 2 — CONTENT */}
        <SectionDivider num="2" zh="" en="Content"
          sub="Fill the framework with typed content. Info must fit and read clearly on the main card, and be recognisable on the sub card." />

        <Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <GlassCard>
              <p className="font-bold mb-3 text-sm" style={{ color: NEON }}>Product Info</p>
              <div className="space-y-2">
                <div>
                  <p className="text-white text-sm font-semibold">Standard Product</p>
                  <p className="text-white/45 text-xs mt-0.5">Title, image, selling points — makes people want to buy</p>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">AI Summary</p>
                  <p className="text-white/45 text-xs mt-0.5">AI-generated highlights — instant comprehension</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard>
              <p className="font-bold mb-3 text-sm" style={{ color: NEON }}>Marketing Info</p>
              <div className="space-y-2">
                <div>
                  <p className="text-white text-sm font-semibold">Coupon</p>
                  <p className="text-white/45 text-xs mt-0.5">Platform & merchant vouchers — drives purchase action</p>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Lottery</p>
                  <p className="text-white/45 text-xs mt-0.5">Real-time live-room giveaways — low-cost entry hook</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-center mt-8">
            <div className="space-y-10">
              {/* Standard Product Card */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: NEON, color: BG }}>01</span>
                  <span className="font-black text-white text-lg tracking-tight">Standard Product Card</span>
                </div>
                <ul className="space-y-2 pl-1">
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Image, title, selling points, CTA — priority: in-room bestseller › ranking › price › anchor points › reviews
                  </li>
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Two status modes: presenter active / recommendation
                  </li>
                </ul>
              </div>
              {/* AI Summary Card */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ border: `1.5px solid ${NEON}`, color: NEON, background: "transparent" }}>02</span>
                  <span className="font-black text-white text-lg tracking-tight">AI Summary Card</span>
                </div>
                <ul className="space-y-2 pl-1">
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Alternates with standard product in a carousel
                  </li>
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Avatar composite boosts authenticity; 24–28 char condensed summary as selling-point magnifier
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <img src="/provided-img3.png" alt="Standard and AI Summary card phone mockups"
                className="w-full rounded-2xl" style={{ maxHeight: 600, objectFit: "contain" }} />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-center mt-8">
            <div className="space-y-10">
              {/* Coupon Card */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: NEON, color: BG }}>03</span>
                  <span className="font-black text-white text-lg tracking-tight">Coupon Card</span>
                </div>
                <ul className="space-y-2 pl-1">
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Shows face value, type, conditions, CTA — supports 3 tiers (¥9 / ¥9.9 / ¥999.9)
                  </li>
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Animated value escalation strengthens perceived incentive; includes gov-subsidy coupon type
                  </li>
                </ul>
              </div>
              {/* Lottery Card */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ border: `1.5px solid ${NEON}`, color: NEON, background: "transparent" }}>04</span>
                  <span className="font-black text-white text-lg tracking-tight">Lottery Card</span>
                </div>
                <ul className="space-y-2 pl-1">
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Lucky-bag animation tied to in-room draw; reinforces brand memory and experience consistency
                  </li>
                  <li className="text-white/65 text-sm flex gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5" style={{ color: NEON }}>—</span>
                    Dynamic copy: countdown timer, participant count, win rate
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <img src="/provided-img-coupon-lottery.png" alt="Coupon and Lottery card phone mockups"
                className="w-full rounded-2xl" style={{ maxHeight: 600, objectFit: "contain" }} />
            </div>
          </div>
        </Reveal>

        {/* SECTION 3 — EXPERIMENTS */}
        <SectionDivider num="3" zh="" en="Experiments"
          sub="4 main-card types × 4 sub-card types form a combinable material library. Two A/B groups test the key question: product or marketing as the primary hook?" />

        <Reveal>
          <img src="/provided-img-experiments.png" alt="Experiments — combinable material library and A/B groups"
            className="w-full my-10 rounded-2xl" style={{ display: "block" }} />
        </Reveal>

        <Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <GlassCard>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Group A — Product as main</p>
              <p className="text-white/60 text-xs leading-relaxed">Product info as the primary card, paired with sub-cards (subsidy coupon › standard coupon › lottery › multi-product)</p>
            </GlassCard>
            <GlassCard neon>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: NEON }}>Group B — Marketing as main</p>
              <p className="text-white/65 text-xs leading-relaxed">Marketing info as the primary card, paired with product sub-cards (subsidy coupon › standard coupon › lottery › product)</p>
            </GlassCard>
          </div>
        </Reveal>

        {/* RESULTS */}
        <Reveal>
          <div className="text-center mt-16 mb-10">
            <p className="font-black tracking-[0.3em] text-xs mb-3" style={{ color: NEON }}>RESULTS</p>
            <h2 className="font-black text-white" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}>
              Data Conclusions
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Composite-card form validated for out-of-room display.{" "}
              <span style={{ color: NEON }} className="font-semibold">Marketing info is the universal hook.</span>
            </p>
          </div>

          <GlassCard neon className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-black px-2.5 py-1 rounded-full"
                style={{ background: NEON, color: BG }}>FULL ROLLOUT</span>
              <span className="text-white/65 text-xs">Group B — Marketing as main card</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {([
                ["+1.145%", "Single-column entry rate"],
                ["+1.129%", "Non-auto view sessions"],
                ["+0.983%", "E-commerce GMV"],
              ] as [string, string][]).map(([n, label]) => (
                <div key={label}>
                  <p className="font-black" style={{ color: NEON, fontSize: "clamp(1.7rem, 3.2vw, 2.2rem)" }}>{n}</p>
                  <p className="text-white/70 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Group A — Product as main card (control)</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {([
                ["+0.905%", "Single-column entry rate"],
                ["+0.937%", "Non-auto view sessions"],
                ["-0.133%", "E-commerce GMV"],
              ] as [string, string][]).map(([n, label]) => (
                <div key={label}>
                  <p className="font-black text-white/55" style={{ fontSize: "clamp(1.5rem, 2.8vw, 1.9rem)" }}>{n}</p>
                  <p className="text-white/40 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <div className="text-center mt-24">
          <button onClick={goHome}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity"
            style={{ color: NEON }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.65"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}

/* ── Hash routing ──────────────────────────────────────────────── */
function useHashRoute() {
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function Portfolio() {
  const hash = useHashRoute();
  if (hash === "#/project/1") {
    return <ProjectDetail title={FEATURED[0].title} />;
  }
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Experience />
      <UIWall />
      <Contact />
    </div>
  );
}
