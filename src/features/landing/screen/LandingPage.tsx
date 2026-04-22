import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, ArrowRight, Sparkles, Lock,
  Smartphone, Mail, Phone, Database,
  Search, FileText, Users, Monitor,
  ScanFace, Activity, CheckCircle2, ChevronRight
} from "lucide-react";

import captureMockup from "../../../assets/images/settings.jpg";
import analysisMockup from "../../../assets/images/home.jpg";
import reportMockup from "../../../assets/images/login.jpg";

const NAV_ITEMS = ["Home", "Workflow", "About", "Features", "Contact"] as const;

const WORKFLOW = [
  {
    icon: <ScanFace size={22} />,
    step: "01",
    t: "Biometric Capture",
    d: "High-fidelity facial scanning using standard mobile or webcam hardware with sub-millimeter precision.",
  },
  {
    icon: <Activity size={22} />,
    step: "02",
    t: "Health Analysis",
    d: "AI-driven assessment of hydration, elasticity, and dermal biomarkers across 47 distinct indicators.",
  },
  {
    icon: <Search size={22} />,
    step: "03",
    t: "Clinical Matching",
    d: "Neural networks cross-reference results with a global dermatology dataset of 3.2M clinical cases.",
  },
  {
    icon: <FileText size={22} />,
    step: "04",
    t: "Expert Guidance",
    d: "Instant generation of structured dermatological reports with evidence-backed recommendations.",
  },
];

const FEATURES = [
  {
    icon: <Monitor size={20} />,
    title: "Real-time Monitoring",
    desc: "Track skin health progress longitudinally with AR overlays and trend analysis.",
  },
  {
    icon: <Lock size={20} />,
    title: "Data Privacy",
    desc: "AES-256 encryption at rest and in transit. Biometric data never leaves your infrastructure.",
  },
  {
    icon: <Database size={20} />,
    title: "EHR Integration",
    desc: "FHIR-compliant sync with Epic, Cerner, and 40+ electronic health record systems.",
  },
  {
    icon: <Smartphone size={20} />,
    title: "Cross-Platform",
    desc: "Native-feel experience across iOS, Android, and Web — shared codebase, zero compromise.",
  },
];

const STATS = [
  { value: "99.2%", label: "Diagnostic accuracy" },
  { value: "3.2M", label: "Clinical cases indexed" },
  { value: "<2s", label: "Analysis turnaround" },
  { value: "HIPAA", label: "Certified compliant" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((label: string) => {
    setActiveNav(label);
    const target = sectionRefs.current[label];
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 88,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div style={s.root}>

      {/* ── Navigation ── */}
      <nav style={{
        ...s.nav,
        background: isScrolled ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottom: isScrolled ? "1px solid #e8edf2" : "1px solid transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        boxShadow: isScrolled ? "0 1px 0 rgba(0,0,0,0.04)" : "none",
      }}>
        <div style={s.navInner}>
          <div style={s.navLogo}>
            <div style={s.logoMark}>
              <ShieldCheck size={16} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={s.logoText}>
              Derma<span style={{ color: "#0ea5e9" }}>AI</span>
            </span>
          </div>

          <div style={s.navLinks}>
            {NAV_ITEMS.map((label) => (
              <button
                key={label}
                onClick={() => scrollTo(label)}
                style={{
                  ...s.navLink,
                  color: activeNav === label ? "#0f172a" : "#64748b",
                  fontWeight: activeNav === label ? 600 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={s.navActions}>
            <button style={s.navSignIn} onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button style={s.navCta} onClick={() => navigate("/login")}>
              Get started <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header
        ref={(el) => (sectionRefs.current["Home"] = el)}
        style={s.hero}
      >
        {/* Background grid */}
        <div style={s.heroGrid} aria-hidden="true" />
        <div style={s.heroGlow} aria-hidden="true" />

        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroBadge}>
              <Sparkles size={12} strokeWidth={2} />
              <span>Clinical-grade AI · Now in public beta</span>
            </div>

            <h1 style={s.heroH1}>
              Facial health intelligence,{" "}
              <span style={s.heroAccent}>clinically validated</span>
            </h1>

            <p style={s.heroBody}>
              DermaAI bridges advanced computer vision and dermatological science 
              to deliver instant, actionable skin health insights from any device — 
              no specialist appointment required.
            </p>

            <div style={s.heroCtas}>
              <button style={s.heroPrimary} onClick={() => navigate("/login")}>
                Start free assessment
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button style={s.heroSecondary} onClick={() => scrollTo("Workflow")}>
                See how it works
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

            <div style={s.heroTrust}>
              {["SOC 2 Type II", "HIPAA Compliant", "FDA Registered"].map((t) => (
                <div key={t} style={s.trustPill}>
                  <CheckCircle2 size={12} color="#16a34a" strokeWidth={2.5} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={s.mockupFrame}>
              <div style={{ ...s.mockupCard, ...s.mockupBack }}>
                <img src={reportMockup} alt="Report screen" style={s.mockupImg} />
              </div>
              <div style={{ ...s.mockupCard, ...s.mockupMid }}>
                <img src={captureMockup} alt="Capture screen" style={s.mockupImg} />
              </div>
              <div style={{ ...s.mockupCard, ...s.mockupFront }}>
                <img src={analysisMockup} alt="Analysis screen" style={s.mockupImg} />
                <div style={s.mockupBadge}>
                  <div style={s.mockupBadgeDot} />
                  Live analysis
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={s.statsBar}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div style={s.statCell}>
                <span style={s.statValue}>{stat.value}</span>
                <span style={s.statLabel}>{stat.label}</span>
              </div>
              {i < STATS.length - 1 && <div style={s.statDivider} />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* ── Workflow ── */}
      <section
        ref={(el) => (sectionRefs.current["Workflow"] = el)}
        style={s.section}
      >
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>How it works</p>
            <h2 style={s.sectionTitle}>Four steps to clinical clarity</h2>
            <p style={s.sectionSubtitle}>
              From a single selfie to a fully structured dermatological report — 
              the entire pipeline runs in under two seconds.
            </p>
          </div>

          <div style={s.workflowGrid}>
            {WORKFLOW.map((item, i) => (
              <div key={i} style={s.workflowCard}>
                <div style={s.workflowTop}>
                  <div style={s.workflowIconWrap}>{item.icon}</div>
                  <span style={s.workflowStep}>{item.step}</span>
                </div>
                <h3 style={s.workflowTitle}>{item.t}</h3>
                <p style={s.workflowDesc}>{item.d}</p>
                {i < WORKFLOW.length - 1 && (
                  <div style={s.workflowArrow}>
                    <ArrowRight size={14} color="#94a3b8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section
        ref={(el) => (sectionRefs.current["About"] = el)}
        style={s.sectionAlt}
      >
        <div style={s.container}>
          <div style={s.splitLayout}>
            <div style={s.splitText}>
              <p style={s.eyebrow}>Our mission</p>
              <h2 style={s.sectionTitle}>
                Making specialist-grade care accessible to everyone
              </h2>
              <p style={s.bodyText}>
                Over 3 billion people lack access to a dermatologist. DermaAI was built 
                to close that gap — combining clinical research, computer vision, and 
                regulatory-grade infrastructure to deliver insights that were previously 
                only available in a specialist's office.
              </p>
              <p style={s.bodyText}>
                Every recommendation is cross-referenced against peer-reviewed literature 
                and reviewed by our clinical advisory board before deployment.
              </p>
              <div style={s.checkList}>
                {[
                  "99.2% concordance with board-certified dermatologists",
                  "HIPAA-compliant infrastructure, zero data sold",
                  "Available in 34 languages across 80+ countries",
                ].map((t) => (
                  <div key={t} style={s.checkItem}>
                    <CheckCircle2 size={16} color="#0ea5e9" strokeWidth={2.5} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.splitImage}>
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=900"
                alt="Clinical setting"
                style={s.aboutImg}
              />
              <div style={s.aboutImgCard}>
                <div style={s.aboutImgCardTop}>
                  <div style={s.dot} />
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                    Assessment complete
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>
                  Healthy baseline
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
                  Moisture index · 84/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        ref={(el) => (sectionRefs.current["Features"] = el)}
        style={s.section}
      >
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>Platform capabilities</p>
            <h2 style={s.sectionTitle}>Built for clinical environments</h2>
            <p style={s.sectionSubtitle}>
              Every component of DermaAI is designed to meet the rigorous standards 
              of healthcare data infrastructure.
            </p>
          </div>

          <div style={s.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={s.featureIconWrap}>{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div style={s.ctaBanner}>
        <div style={s.container}>
          <div style={s.ctaInner}>
            <div>
              <h2 style={s.ctaTitle}>Ready to assess your skin health?</h2>
              <p style={s.ctaBody}>
                Join 40,000+ users who've received their first AI-powered dermatological report.
              </p>
            </div>
            <button style={s.ctaBtn} onClick={() => navigate("/login")}>
              Start free assessment <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <section
        ref={(el) => (sectionRefs.current["Contact"] = el)}
        style={s.section}
      >
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <p style={s.eyebrow}>Contact</p>
            <h2 style={s.sectionTitle}>Get in touch</h2>
            <p style={s.sectionSubtitle}>
              Clinical partnerships, press inquiries, or technical support — we respond within one business day.
            </p>
          </div>

          <div style={s.contactLayout}>
            <div style={s.contactDetails}>
              <div style={s.contactItem}>
                <div style={s.contactIconWrap}>
                  <Mail size={16} color="#0ea5e9" strokeWidth={2} />
                </div>
                <div>
                  <p style={s.contactLabel}>Email</p>
                  <p style={s.contactValue}>support@derma-ai.com</p>
                </div>
              </div>
              <div style={s.contactItem}>
                <div style={s.contactIconWrap}>
                  <Phone size={16} color="#0ea5e9" strokeWidth={2} />
                </div>
                <div>
                  <p style={s.contactLabel}>Phone</p>
                  <p style={s.contactValue}>+1 (800) 555-DERMA</p>
                </div>
              </div>
              <div style={s.contactNote}>
                <Users size={14} color="#94a3b8" />
                <span>
                  For clinical partnership inquiries, please include your institution name and NPI number.
                </span>
              </div>
            </div>

            <form style={s.form} onSubmit={(e) => e.preventDefault()}>
              <div style={s.formRow}>
                <input type="text" placeholder="Full name" style={s.input} />
                <input type="text" placeholder="Organization" style={s.input} />
              </div>
              <input type="email" placeholder="Email address" style={s.inputFull} />
              <textarea placeholder="Your message" rows={5} style={s.textarea} />
              <button type="submit" style={s.submitBtn}>
                Send message <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <div style={s.logoMark}>
              <ShieldCheck size={14} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={s.logoText}>
              Derma<span style={{ color: "#0ea5e9" }}>AI</span>
            </span>
          </div>
          <p style={s.footerText}>
            © 2026 DermaAI System. Professional dermatological intelligence.
          </p>
          <div style={s.footerLinks}>
            {["Privacy Policy", "Terms of Use", "HIPAA Notice"].map((l) => (
              <a key={l} href="#" style={s.footerLink}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const C = {
  sky: "#0ea5e9",
  navy: "#0f172a",
  slate: "#64748b",
  border: "#e2e8f0",
  bgAlt: "#f8fafc",
  white: "#ffffff",
};

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: C.navy,
    background: C.white,
    overflowX: "hidden",
  },

  // Nav
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s, backdrop-filter 0.2s",
  },
  navInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 40px",
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "10px" },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: C.navy,
  },
  navLinks: {
    display: "flex",
    gap: "4px",
    position: "absolute" as const,
    left: "50%",
    transform: "translateX(-50%)",
  },
  navLink: {
    background: "none",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  navActions: { display: "flex", gap: "8px", alignItems: "center" },
  navSignIn: {
    background: "none",
    border: "none",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 500,
    color: C.slate,
    cursor: "pointer",
    borderRadius: "8px",
  },
  navCta: {
    padding: "9px 18px",
    background: C.navy,
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  // Hero
  hero: {
    paddingTop: "72px",
    background: "#fafbfc",
    borderBottom: `1px solid ${C.border}`,
    overflow: "hidden",
    position: "relative",
  },
  heroGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  heroGlow: {
    position: "absolute",
    top: "-120px",
    right: "-80px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "80px 40px 60px",
    display: "flex",
    alignItems: "center",
    gap: "80px",
    position: "relative",
    zIndex: 1,
  },
  heroLeft: { flex: "0 0 52%", maxWidth: "620px" },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px 5px 10px",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: "28px",
    letterSpacing: "0.01em",
  },
  heroH1: {
    fontSize: "clamp(36px, 4vw, 52px)",
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: "-0.035em",
    marginBottom: "20px",
    color: C.navy,
  },
  heroAccent: {
    background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroBody: {
    fontSize: "17px",
    lineHeight: 1.65,
    color: C.slate,
    marginBottom: "36px",
    maxWidth: "520px",
  },
  heroCtas: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "28px",
  },
  heroPrimary: {
    padding: "14px 24px",
    background: C.sky,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 1px 2px rgba(14,165,233,0.3), 0 4px 12px rgba(14,165,233,0.15)",
  },
  heroSecondary: {
    padding: "14px 20px",
    background: C.white,
    color: C.navy,
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  heroTrust: { display: "flex", gap: "20px", flexWrap: "wrap" as const },
  trustPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#475569",
  },

  // Mockup
  heroRight: { flex: 1, display: "flex", justifyContent: "center" },
  mockupFrame: {
    position: "relative",
    width: "280px",
    height: "520px",
  },
  mockupCard: {
    position: "absolute",
    borderRadius: "24px",
    overflow: "hidden",
    border: "3px solid #1e293b",
    background: "#000",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
  },
  mockupBack: {
    width: "200px",
    top: "40px",
    left: "-30px",
    opacity: 0.5,
    transform: "rotate(-6deg)",
    zIndex: 1,
  },
  mockupMid: {
    width: "200px",
    top: "20px",
    right: "-20px",
    opacity: 0.65,
    transform: "rotate(4deg)",
    zIndex: 2,
  },
  mockupFront: {
    width: "230px",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
  },
  mockupImg: { width: "100%", display: "block" },
  mockupBadge: {
    position: "absolute",
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.95)",
    border: `1px solid ${C.border}`,
    borderRadius: "50px",
    padding: "6px 14px",
    fontSize: "12px",
    fontWeight: 600,
    color: C.navy,
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  mockupBadgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  },

  // Stats bar
  statsBar: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: `1px solid ${C.border}`,
    position: "relative",
    zIndex: 1,
  },
  statCell: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "28px 48px",
    gap: "3px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 800,
    color: C.navy,
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: C.slate,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  statDivider: {
    width: "1px",
    height: "36px",
    background: C.border,
  },

  // Sections
  section: { padding: "96px 0" },
  sectionAlt: { padding: "96px 0", background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` },
  container: { maxWidth: "1280px", margin: "0 auto", padding: "0 40px" },
  sectionHeader: { textAlign: "center", maxWidth: "640px", margin: "0 auto 60px" },
  eyebrow: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: C.sky,
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 3vw, 38px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    marginBottom: "16px",
    color: C.navy,
  },
  sectionSubtitle: {
    fontSize: "16px",
    lineHeight: 1.65,
    color: C.slate,
  },

  // Workflow
  workflowGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "2px",
    background: C.border,
    borderRadius: "16px",
    overflow: "hidden",
  },
  workflowCard: {
    background: C.white,
    padding: "36px 28px",
    position: "relative",
  },
  workflowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  workflowIconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.sky,
  },
  workflowStep: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#cbd5e1",
    letterSpacing: "0.05em",
    fontVariantNumeric: "tabular-nums",
  },
  workflowTitle: {
    fontSize: "17px",
    fontWeight: 700,
    marginBottom: "10px",
    color: C.navy,
    letterSpacing: "-0.02em",
  },
  workflowDesc: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: C.slate,
  },
  workflowArrow: {
    position: "absolute",
    top: "52px",
    right: "-10px",
    zIndex: 10,
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // About / Split
  splitLayout: {
    display: "flex",
    gap: "80px",
    alignItems: "center",
  },
  splitText: { flex: "0 0 48%" },
  splitImage: { flex: 1, position: "relative" },
  bodyText: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: C.slate,
    marginBottom: "16px",
  },
  checkList: { marginTop: "24px", display: "flex", flexDirection: "column" as const, gap: "12px" },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "15px",
    fontWeight: 500,
    color: C.navy,
    lineHeight: 1.4,
  },
  aboutImg: {
    width: "100%",
    borderRadius: "20px",
    display: "block",
    objectFit: "cover" as const,
    aspectRatio: "4/3",
  },
  aboutImgCard: {
    position: "absolute",
    bottom: "-20px",
    left: "-20px",
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "18px 22px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  aboutImgCardTop: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" },

  // Features
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  featureCard: {
    padding: "28px 24px",
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    transition: "border-color 0.2s",
  },
  featureIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.sky,
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "8px",
    color: C.navy,
    letterSpacing: "-0.02em",
  },
  featureDesc: { fontSize: "14px", lineHeight: 1.6, color: C.slate },

  // CTA Banner
  ctaBanner: {
    background: C.navy,
    padding: "60px 0",
  },
  ctaInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap" as const,
  },
  ctaTitle: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.03em",
    marginBottom: "8px",
  },
  ctaBody: { fontSize: "15px", color: "#94a3b8", margin: 0 },
  ctaBtn: {
    padding: "14px 24px",
    background: C.sky,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap" as const,
    boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
    flexShrink: 0,
  },

  // Contact
  contactLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1.8fr",
    gap: "60px",
    alignItems: "start",
  },
  contactDetails: { display: "flex", flexDirection: "column" as const, gap: "24px" },
  contactItem: { display: "flex", gap: "16px", alignItems: "flex-start" },
  contactIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactLabel: { fontSize: "12px", fontWeight: 600, color: C.slate, margin: "0 0 3px", textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  contactValue: { fontSize: "15px", fontWeight: 600, color: C.navy, margin: 0 },
  contactNote: {
    display: "flex",
    gap: "10px",
    padding: "14px 16px",
    background: C.bgAlt,
    borderRadius: "10px",
    fontSize: "13px",
    color: C.slate,
    lineHeight: 1.55,
    alignItems: "flex-start",
    border: `1px solid ${C.border}`,
  },

  // Form
  form: { display: "flex", flexDirection: "column" as const, gap: "12px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1px solid ${C.border}`,
    fontSize: "14px",
    color: C.navy,
    outline: "none",
    background: C.white,
    fontFamily: "inherit",
  },
  inputFull: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1px solid ${C.border}`,
    fontSize: "14px",
    color: C.navy,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    background: C.white,
    fontFamily: "inherit",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1px solid ${C.border}`,
    fontSize: "14px",
    color: C.navy,
    outline: "none",
    resize: "vertical" as const,
    background: C.white,
    fontFamily: "inherit",
    lineHeight: 1.6,
  },
  submitBtn: {
    alignSelf: "flex-start",
    padding: "13px 24px",
    background: C.navy,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // Footer
  footer: {
    borderTop: `1px solid ${C.border}`,
    padding: "32px 0",
  },
  footerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  footerBrand: { display: "flex", alignItems: "center", gap: "8px" },
  footerText: { fontSize: "13px", color: C.slate, margin: 0 },
  footerLinks: { display: "flex", gap: "20px" },
  footerLink: {
    fontSize: "13px",
    color: C.slate,
    textDecoration: "none",
    fontWeight: 500,
  },
};