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
    { href: "#home",     label: "Home" },
    { href: "#projects", label: "Projects" },
    { href: "#about",    label: "About me" },
    { href: "#contact",  label: "Reach me" },
  ];
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); setMob(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
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
        <a href="#contact" onClick={(e) => go(e, "#contact")}
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
        <img src="/p1.jpg" alt="Profile" style={{ width: "100%", height: 180, objectFit: "cover", objectPosition: "center top", display: "block" }} />
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
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
      <div className="scroll-caret" />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]" style={{ color: NEON }}>SCROLL</span>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 pt-14 pb-8 flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Left */}
        <div className="flex-1 min-w-0 pt-4">
          <p className="text-white/50 text-sm font-medium mb-5 flex items-center gap-2">
            Hello <span>👋</span>, great to have you here
          </p>
          <h1 className="font-black uppercase leading-[0.95] tracking-tight mb-6 text-white"
            style={{ fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
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
  { title: "直播间进间链路设计", tags: ["框架创新", "0-1设计", "设计专利", "全链路设计"] },
  { title: "评价填写链路优化",   tags: ["AIGC", "交互优化", "提效率"] },
  { title: "商品评价导购链路优化", tags: ["UI改版", "促转化"] },
  { title: "春节送礼物项目",     tags: ["0-1搭建", "紧急项目", "多端设计"] },
];

const SIDE = [
  { title: "11·11营销设计",   tags: ["大促", "UI", "组件"] },
  { title: "B 端商家侧设计",  tags: ["to B", "AI"] },
  { title: "TikTok internship project",  tags: ["to C", "广告样式"] },
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
        {FEATURED.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="project-card rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <ImgPlaceholder label="Project Image" style={{ height: 260, borderRadius: 0, border: "none" }} />
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
        ))}
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
              <ImgPlaceholder label="Project Image" style={{ height: 180, borderRadius: 0, border: "none" }} />
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

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20">
      <Reveal>
        <h2 className="font-black text-white mb-12" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          A Bit About Me
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
                { target: 2,  suffix: "+", label: "Companies worked" },
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
        <Reveal delay={150} className="flex-1 w-full">
          <ImgPlaceholder label="Your Photo" style={{ height: 420, width: "100%" }} />
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
    <section className="py-12 overflow-hidden">
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

/* ── Root ──────────────────────────────────────────────────────── */
export default function Portfolio() {
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <UIWall />
      <Contact />
    </div>
  );
}
