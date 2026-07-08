import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  siteContentQuery, projectsQuery, servicesQuery,
} from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroImg from "@/assets/herimg.jpeg";
import {
  ArrowUpRight, Download, Github, Linkedin, Instagram,
  Mail, MapPin, Phone, Send, Menu, X, Dribbble, Twitter,
  Code2, Palette, Sparkles, LayoutTemplate, LayoutDashboard,
  Image as ImageIcon, ShoppingCart, Server, Brush,
} from "lucide-react";

/* ── Color tokens (plum + lavender) ── */
const C = {
  plum:       "#5B1A8A",
  plumDark:   "#3D0F63",
  plumMid:    "#7B2FBE",
  lavender:   "#E9D5FF",
  lavMid:     "#D8B4FE",
  lavLight:   "#F5EEFF",
  lavBg:      "#FAF7FF",
  lilac:      "#C4B5FD",
  ink:        "#1E0A3C",
  muted:      "#7B5EA7",
  border:     "#E2D0F8",
};

/* ── Icon map for services ── */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Palette, Sparkles, LayoutTemplate, LayoutDashboard,
  Image: ImageIcon, ShoppingCart, Server, Brush,
};

/* ── Illustration map for services ── */
const SVC_ILLUSTRATIONS: Record<string, string> = {
  // DB service names
  "Full Stack Development": "/svc-fullstack.png",
  "UI/UX Design":           "/svc-uiux.png",
  "Brand Identity":         "/svc-brand.png",
  "Landing Pages":          "/svc-landing.png",
  "Admin Dashboards":       "/svc-admin.png",
  "Graphic Design":         "/svc-graphic.png",
  // Fallback / legacy names
  "Illustration":           "/svc-illustration.png",
  "Web Development":        "/svc-fullstack.png",
  "Logo Design":            "/svc-brand.png",
  "Social Media Design":    "/svc-graphic.png",
  "Poster & Banner Design": "/svc-graphic.png",
};

/* ── Fade-up animation preset ── */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export const Route = createFileRoute("/")(({
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(siteContentQuery),
    context.queryClient.ensureQueryData(projectsQuery),
    context.queryClient.ensureQueryData(servicesQuery),
  ]),
  component: Home,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <p className="text-lg font-semibold" style={{ color: C.ink }}>Something went wrong loading the page.</p>
        <p className="text-sm mt-2" style={{ color: C.muted }}>{error.message}</p>
      </div>
    </div>
  ),
} as any));

/* ══════════════════════════════════════════
   HOME
══════════════════════════════════════════ */
function Home() {
  return (
    <div className="min-h-screen" style={{ background: C.lavBg, color: C.ink }}>
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn(); window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [["Projects", "#work"], ["Services", "#services"], ["Contact", "#contact"]];

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(250,247,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 16px rgba(91,26,138,0.08)" : "none",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
            {/* Monogram badge */}
            <div
              className="flex items-center justify-center rounded-xl text-white font-bold text-sm select-none transition-transform group-hover:scale-105"
              style={{
                width: 38, height: 38,
                background: `linear-gradient(135deg, ${C.plum} 0%, ${C.plumMid} 100%)`,
                boxShadow: `0 4px 12px rgba(91,26,138,0.35)`,
                letterSpacing: "0.02em",
              }}
            >
              IZ
            </div>
            {/* Brand name */}
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base" style={{ color: C.ink, letterSpacing: "-0.01em" }}>
                Iqra <span style={{ color: C.plum }}>Zakir</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: C.muted }}>
                Designer & Dev
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {links.map(([label, href]) => (
              <a key={href} href={href}
                className="transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = C.plum)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              >{label}</a>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:inline-flex btn-purple">
              Hire me <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full text-white md:hidden"
              style={{ background: `linear-gradient(135deg, ${C.plum}, ${C.plumMid})` }}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm"
              style={{ background: "rgba(30,10,60,0.35)" }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 shadow-2xl p-6 flex flex-col"
              style={{ background: C.lavBg, borderLeft: `1px solid ${C.border}` }}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center rounded-xl text-white font-bold text-sm"
                  style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${C.plum}, ${C.plumMid})` }}>
                  IZ
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-base" style={{ color: C.ink }}>
                    Iqra <span style={{ color: C.plum }}>Zakir</span>
                  </span>
                  <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: C.muted }}>
                    Designer & Dev
                  </span>
                </div>
              </div>
                <button onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{ background: C.lavender }}>
                  <X className="h-5 w-5" style={{ color: C.plum }} />
                </button>
              </div>
              <nav className="flex flex-col gap-5">
                {links.map(([label, href]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)}
                    className="text-lg font-semibold transition-colors"
                    style={{ color: C.ink }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.plum)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.ink)}
                  >{label}</a>
                ))}
              </nav>
              <div className="mt-auto">
                <a href="#contact" onClick={() => setMenuOpen(false)}
                  className="btn-purple w-full justify-center">
                  Hire me <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const hero = data.hero;
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % (hero.roles?.length || 1)), 2800);
    return () => clearInterval(t);
  }, [hero.roles?.length]);

  return (
    <section id="top" className="pt-16 relative overflow-hidden">
      {/* Lavender blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.lavender}CC 0%, transparent 70%)`, transform: "translate(35%, -35%)" }} />
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.lavMid}55 0%, transparent 70%)`, transform: "translate(-50%, -50%)" }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.lilac}44 0%, transparent 70%)`, transform: "translateY(40%)" }} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-0 items-center min-h-[calc(100vh-4rem)]">

        {/* LEFT — Portrait */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-end justify-center pt-10 md:pt-0"
        >
          <div className="relative" style={{ width: "min(340px, 90vw)", aspectRatio: "3/4" }}>
            {/* Plum offset frame */}
            <div className="absolute rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${C.plum}, ${C.plumMid})`,
                inset: 0, transform: "translate(14px, 14px)", zIndex: 0,
              }} />
            {/* Lavender decorative dot */}
            <div className="absolute rounded-full"
              style={{ width: 60, height: 60, background: C.lavender, top: -20, right: -20, zIndex: 0, opacity: 0.8 }} />
            {/* Photo */}
            <img
              src={heroImg}
              alt="Iqra Zakir"
              loading="eager"
              className="relative w-full h-full object-cover object-top rounded-2xl"
              style={{ zIndex: 1, boxShadow: `0 24px 64px rgba(91,26,138,0.28)` }}
            />
          </div>
        </motion.div>

        {/* RIGHT — Text */}
        <div className="py-12 md:py-16 md:pl-14 flex flex-col justify-center">
          {/* Role pill */}
          <motion.div {...fadeUp(0.05)}>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
                className="pill-label"
              >
                {hero.roles?.[roleIdx] ?? "Designer & Developer"}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Heading */}
          <motion.div {...fadeUp(0.1)} className="mt-5">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: C.ink }}>
              Hi there, I'm
              <br />
              <span style={{ color: C.plum }}>{hero.name ?? "Iqra Zakir"}!</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p {...fadeUp(0.15)}
            className="mt-5 text-base md:text-lg leading-relaxed max-w-md"
            style={{ color: C.muted }}>
            {hero.tagline}
          </motion.p>

          {/* Buttons */}
          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-purple">
              Hire Me <ArrowUpRight className="h-4 w-4" />
            </a>
            {hero.resume_url ? (
              <a href={hero.resume_url} target="_blank" rel="noreferrer" className="btn-outline">
                Download CV <Download className="h-4 w-4" />
              </a>
            ) : (
              <a href="#work" className="btn-outline">View Projects</a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
function Services() {
  const { data } = useSuspenseQuery(servicesQuery);

  const FALLBACK_SERVICES = [
    { id: "g1", title: "Graphic Design",   description: "Visual identities and stunning designs that communicate your message.",   icon: "Palette",       illustration_url: "/svc-graphic.png" },
    { id: "g2", title: "Illustration",     description: "Custom illustrations that bring ideas to life with creativity.",          icon: "Brush",         illustration_url: "/svc-illustration.png" },
    { id: "g3", title: "Web Development",  description: "Modern, responsive and fast websites built with clean code.",             icon: "Code2",         illustration_url: "/svc-webdev.png" },
    { id: "g4", title: "Brand Identity",   description: "Unique brand identities that make you stand out from the crowd.",        icon: "Sparkles",      illustration_url: "/svc-brand.png" },
    { id: "g5", title: "UI/UX Design",     description: "User-centered designs that are beautiful and functional.",               icon: "LayoutDashboard", illustration_url: "/svc-uiux.png" },
    { id: "g6", title: "Logo Design",      description: "Memorable logos that represent your brand perfectly.",                   icon: "Image",         illustration_url: "/svc-logo.png" },
  ];

  const services = (data?.length ? data : FALLBACK_SERVICES) as Array<{
    id: string; title: string; description: string; icon?: string; illustration_url?: string;
  }>;

  return (
    <section id="services" className="py-16 md:py-20"
      style={{ background: `linear-gradient(180deg, ${C.lavBg} 0%, #EFE5FF 100%)` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div {...fadeUp()}>
          <div className="section-underline" />
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>What I Do</h2>
          <p className="mt-3 max-w-xl" style={{ color: C.muted }}>
            A curated set of services crafted through years of creative and technical work.
          </p>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon ?? ""] ?? Sparkles;
            const illustration = s.illustration_url ?? SVC_ILLUSTRATIONS[s.title];
            return (
              <motion.div key={s.id} {...fadeUp(i * 0.06)} className="portfolio-card p-6 group cursor-default">
                <h3 className="font-bold text-lg" style={{ color: C.ink }}>{s.title}</h3>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: C.muted }}>{s.description}</p>
                <div className="mt-4 h-36 flex items-center justify-center rounded-xl overflow-hidden"
                  style={{ background: C.lavLight }}>
                  {illustration ? (
                    <img src={illustration} alt={s.title}
                      className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Icon className="h-16 w-16" style={{ color: C.lilac }} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════ */
function Projects() {
  const { data } = useSuspenseQuery(projectsQuery);
  const cats = ["All", ...Array.from(new Set(data.map(p => p.category).filter(Boolean)))];
  const [cat, setCat] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = cat === "All" ? data : data.filter(p => p.category === cat);
  const shown = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="work" className="py-16 md:py-20" style={{ background: C.lavBg }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="section-underline" />
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.ink }}>My Projects</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => { setCat(c); setShowAll(false); }}
                className="text-xs font-semibold px-4 py-1.5 rounded-full border transition-all"
                style={cat === c
                  ? { background: `linear-gradient(135deg, ${C.plum}, ${C.plumMid})`, color: "#fff", borderColor: C.plum }
                  : { background: "transparent", color: C.muted, borderColor: C.border }
                }>{c}</button>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((p, i) => (
            <motion.article key={p.id} {...fadeUp(i * 0.05)} className="portfolio-card overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden" style={{ background: C.lavLight }}>
                {p.cover_url ? (
                  <img src={p.cover_url} alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-6xl font-bold"
                    style={{ color: C.lilac }}>{p.title[0]}</div>
                )}
                {p.featured && (
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white px-2.5 py-1 rounded-full font-bold"
                    style={{ background: `linear-gradient(135deg, ${C.plum}, ${C.plumMid})` }}>
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: C.plum }}>{p.category}</div>
                <h3 className="mt-1.5 font-bold text-lg" style={{ color: C.ink }}>{p.title}</h3>
                <p className="mt-1.5 text-sm line-clamp-2" style={{ color: C.muted }}>{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech?.slice(0, 4).map((t: string) => (
                    <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: C.lavLight, color: C.plumMid }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length > 6 && (
          <motion.div {...fadeUp(0.2)} className="mt-8 text-center">
            <button onClick={() => setShowAll(v => !v)} className="btn-outline">
              {showAll ? "Show Less" : `Show All (${filtered.length})`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CONTACT
══════════════════════════════════════════ */
const contactSchema = z.object({
  name:    z.string().trim().min(1).max(100),
  email:   z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  body:    z.string().trim().min(10).max(2000),
});
type ContactForm = z.infer<typeof contactSchema>;

function Contact() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const c = data.contact;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactForm) => {
    const { error } = await supabase.from("messages").insert({
      name: values.name, email: values.email,
      subject: values.subject || null, body: values.body,
    });
    if (error) { toast.error("Couldn't send. Try again."); return; }
    toast.success("Message sent! I'll reply soon 🎉");
    reset();
  };

  return (
    <section id="contact" className="py-16 md:py-20"
      style={{ background: `linear-gradient(180deg, ${C.lavBg} 0%, #EFE5FF 100%)` }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <motion.div {...fadeUp()}>
            <div className="section-underline" />
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: C.ink }}>
              Get in touch
            </h2>
            <p className="mt-4 leading-relaxed max-w-sm" style={{ color: C.muted }}>
              Looking for a creative partner for your next project? I'm currently available for
              freelance work and would love to hear about your ideas. Let's collaborate to bring
              your vision to life.
            </p>
            <ul className="mt-8 space-y-4">
              {c?.email && (
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.lavender }}>
                    <Mail className="h-4 w-4" style={{ color: C.plum }} />
                  </span>
                  <a href={`mailto:${c.email}`} className="font-medium transition-colors"
                    style={{ color: C.ink }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.plum)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.ink)}>
                    {c.email}
                  </a>
                </li>
              )}
              {c?.phone && (
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.lavender }}>
                    <Phone className="h-4 w-4" style={{ color: C.plum }} />
                  </span>
                  <span className="font-medium" style={{ color: C.ink }}>{c.phone}</span>
                </li>
              )}
              {c?.location && (
                <li className="flex items-center gap-3 text-sm">
                  <span className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.lavender }}>
                    <MapPin className="h-4 w-4" style={{ color: C.plum }} />
                  </span>
                  <span className="font-medium" style={{ color: C.ink }}>{c.location}</span>
                </li>
              )}
            </ul>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.form {...fadeUp(0.1)} onSubmit={handleSubmit(onSubmit)}
            className="portfolio-card p-6 md:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <CField label="Your Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Iqra Zakir"
                  style={{ borderColor: C.border }} className="focus:ring-[#7B2FBE]/20" />
              </CField>
              <CField label="Your Email" error={errors.email?.message}>
                <Input type="email" {...register("email")} placeholder="iqra@example.com"
                  style={{ borderColor: C.border }} className="focus:ring-[#7B2FBE]/20" />
              </CField>
            </div>
            <CField label="Subject">
              <Input {...register("subject")} placeholder="Project inquiry..."
                style={{ borderColor: C.border }} className="focus:ring-[#7B2FBE]/20" />
            </CField>
            <CField label="Your Message" error={errors.body?.message}>
              <Textarea rows={5} {...register("body")} placeholder="Tell me about your project..."
                style={{ borderColor: C.border }} className="focus:ring-[#7B2FBE]/20 resize-none" />
            </CField>
            <button type="submit" disabled={isSubmitting} className="btn-purple w-full justify-center">
              {isSubmitting ? "Sending…" : "Send Message"}
              <Send className="h-4 w-4" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const c = data.contact;

  const socials = [
    { href: c?.socials?.twitter,   Icon: Twitter,   label: "X / Twitter" },
    { href: c?.socials?.linkedin,  Icon: Linkedin,  label: "LinkedIn" },
    { href: c?.socials?.instagram, Icon: Instagram, label: "Instagram" },
    { href: c?.socials?.github,    Icon: Github,    label: "GitHub" },
    { href: c?.socials?.dribbble,  Icon: Dribbble,  label: "Dribbble" },
  ].filter(s => s.href);

  return (
    <footer className="py-8 border-t" style={{ background: C.lavBg, borderColor: C.border }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold" style={{ color: C.ink }}>
          Iqra <span style={{ color: C.plum }}>Zakir</span>
          <span className="ml-3 text-xs font-normal" style={{ color: C.muted }}>
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div className="text-sm" style={{ color: C.muted }}>
          Designed & Developed by{" "}
          <span className="font-semibold" style={{ color: C.plum }}>Iqra Zakir</span>{" "}
          <span style={{ color: "#e879a0" }}>♥</span>
        </div>
        {socials.length > 0 && (
          <div className="flex items-center gap-2">
            {socials.map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="h-9 w-9 rounded-full flex items-center justify-center border transition-all"
                style={{ borderColor: C.border, color: C.muted }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.plum;
                  (e.currentTarget as HTMLElement).style.color = C.plum;
                  (e.currentTarget as HTMLElement).style.background = C.lavLight;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.color = C.muted;
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

/* ── Helper ── */
function CField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 inline-block font-medium" style={{ color: "#7B5EA7" }}>{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
