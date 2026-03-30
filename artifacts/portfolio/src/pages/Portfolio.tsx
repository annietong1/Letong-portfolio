import { useEffect, useRef, useState } from "react";
import { experiences, projects, awards, strengths } from "../data";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-5");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("opacity-100", "translate-y-0");
      el.classList.remove("opacity-0", "translate-y-5");
      observer.unobserve(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-5 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#awards", label: "Awards" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-b border-[#eaeaea]" : "border-b border-[#eaeaea]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div
          className="text-xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #111, #3a3a3a)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          佟乐 / Le Tong
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-7">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="text-sm font-medium text-[#2c2c2c] hover:text-black hover:underline underline-offset-4 transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[#111] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#111] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#111] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#eaeaea] bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="text-sm font-medium text-[#2c2c2c] hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start justify-between">
        <div className="flex-[2] min-w-0">
          <div className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium mb-3">
            UX Designer · Product Design
          </div>
          <h1
            className="font-semibold leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)", letterSpacing: "-0.02em" }}
          >
            Crafting data‑driven<br />experiences with soul.
          </h1>
          <p className="text-[1.1rem] text-[#3a3a3a] max-w-xl mb-6 leading-relaxed">
            2+ years experience in E‑commerce &amp; global platforms. Passionate about
            AIGC, interaction design, and elevating user journeys.
          </p>
          <div className="flex flex-wrap gap-2 mb-7">
            {["🏆 30+ Design Awards", "📊 Data-driven · UX", "🤖 AIGC Workflow", "🌏 Global perspective"].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-block bg-[#f2f2f2] px-3 py-1 rounded-full text-xs font-medium"
                >
                  {badge}
                </span>
              )
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c2c2c] hover:-translate-y-0.5 transition-all duration-200"
            >
              Get in touch
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block border border-[#ccc] text-[#111] bg-transparent px-5 py-2.5 rounded-full text-sm font-medium hover:border-black hover:bg-[#f5f5f5] hover:-translate-y-0.5 transition-all duration-200"
            >
              View projects ↓
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

function SectionHeader({ subhead, title }: { subhead: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium mb-2">
        {subhead}
      </div>
      <h2
        className="font-semibold tracking-tight"
        style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-[#efefef] py-14">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader subhead="Career path" title="Work experience" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiences.map((exp, i) => (
            <RevealCard key={exp.company + exp.role} delay={i * 80}>
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:border-[#e0e0e0] hover:shadow-[0_16px_28px_-10px_rgba(0,0,0,0.08)] transition-all duration-250">
                <div className="text-lg font-bold mb-0.5">{exp.company}</div>
                <div className="font-semibold text-[#2c2c2c] text-sm mb-1">{exp.role}</div>
                <div className="text-xs text-[#7a7a7a] border-l-2 border-[#ddd] pl-2 mb-4">
                  {exp.period}
                </div>
                <ul className="list-disc pl-4 space-y-1.5">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-sm text-[#3e3e3e] leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-[#efefef] py-14">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader subhead="Selected projects" title="Impactful product stories" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj, i) => (
            <RevealCard key={proj.title} delay={i * 70}>
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:border-[#e0e0e0] hover:shadow-[0_16px_28px_-10px_rgba(0,0,0,0.08)] transition-all duration-250 h-full flex flex-col">
                <div className="text-base font-bold mb-2">{proj.title}</div>
                <p className="text-sm text-[#3d3d3d] mb-3 flex-1 leading-relaxed">{proj.desc}</p>
                <div className="inline-block bg-[#eef9f0] text-[#1e6f3f] text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                  📊 {proj.metrics}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.68rem] bg-[#f2f2f2] px-2 py-0.5 rounded-full text-[#444]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="border-t border-[#efefef] py-14">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader subhead="Background" title="Education & expertise" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-5 flex-1">
            <RevealCard>
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-base mb-1">🎓 Beijing University of Science & Technology</h3>
                <p className="font-semibold text-sm text-[#2c2c2c]">M.A. Design · Interaction Design</p>
                <p className="text-sm text-[#6b6b6b] mt-1">2021 – 2024 | GPA: Top tier, 1st class scholarship</p>
              </div>
            </RevealCard>
            <RevealCard delay={100}>
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-base mb-1">✈️ Shenyang Aerospace University</h3>
                <p className="font-semibold text-sm text-[#2c2c2c]">B.E. Industrial Design (Interaction & Experience)</p>
                <p className="text-sm text-[#6b6b6b] mt-1">2016 – 2020 | Outstanding Graduate of Liaoning Province</p>
              </div>
            </RevealCard>
          </div>
          <div className="flex-[1.4]">
            <RevealCard delay={150}>
              <div className="bg-white border border-[#f0f0f0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h3 className="font-bold text-base mb-4">⚡ Core strengths</h3>
                <ul className="space-y-2.5">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#3e3e3e] leading-relaxed">
                      <span className="mt-0.5 text-[#111]">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
                  <p className="text-xs text-[#6b6b6b] font-medium uppercase tracking-wider mb-2">Tools & skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Figma", "Principle", "Axure", "Midjourney", "Stable Diffusion", "AIGC", "Design System", "A/B Testing", "User Research", "Prototyping"].map((tool) => (
                      <span key={tool} className="text-[0.68rem] bg-[#f2f2f2] px-2 py-0.5 rounded-full text-[#444]">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardsSection() {
  return (
    <section id="awards" className="border-t border-[#efefef] py-14">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader subhead="Recognition" title="Awards & honors" />
        <div className="flex flex-wrap gap-3">
          {awards.map((award, i) => (
            <RevealCard key={i} delay={i * 50}>
              <span className="inline-block bg-[#f9f9f9] border border-[#ececec] px-4 py-2 rounded-full text-sm font-medium hover:border-[#d0d0d0] hover:bg-white transition-all duration-200 cursor-default">
                🏅 {award}
              </span>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFooter() {
  return (
    <footer id="contact" className="border-t border-[#efefef] py-14">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-xl font-semibold mb-3">Let's connect</h3>
        <p className="text-[#3e3e3e] text-sm mb-4">
          <a
            href="mailto:906074545@qq.com"
            className="text-[#111] hover:underline underline-offset-4"
          >
            ✉️ 906074545@qq.com
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            href="tel:+8618842417092"
            className="text-[#111] hover:underline underline-offset-4"
          >
            📱 +86 18842417092
          </a>
        </p>
        <div className="flex justify-center gap-5 mb-8">
          <a
            href="#"
            className="text-[#2c2c2c] hover:text-black text-sm font-medium transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-[#2c2c2c] hover:text-black text-sm font-medium transition-colors"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-[#2c2c2c] hover:text-black text-sm font-medium transition-colors"
            aria-label="Twitter"
          >
            Twitter
          </a>
        </div>
        <p className="text-[#6c6c6c] text-xs">
          © 2025 佟乐 (Le Tong) — Designed with intention &amp; curiosity
        </p>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  return (
    <div className="bg-white text-[#171717] min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <div id="work" />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
        <AwardsSection />
      </main>
      <ContactFooter />
    </div>
  );
}
