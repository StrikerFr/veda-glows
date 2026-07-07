import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const dailyClean = "/assets/dailyclean.webp";

const glowRepair = "/assets/glowrepair.webp";

const deepDetox = "/assets/deepdetox.webp";

const leaf1 = "/assets/leaf-1.webp";

const leaf2 = "/assets/leaf-2.webp";

/* ─── Shared ─── */

type Product = {
  id: "daily" | "glow" | "detox";
  name: string;
  step: string;
  src: string;
  description: string;
  benefits: string[];
  glow: string;
  rot: number;
  tagline: string;
  ingredients: { name: string; pct: string }[];
  use: string;
  time: string;
  texture: string;
  hue: string;
};

const PRODUCTS: Product[] = [
  {
    id: "daily",
    name: "Daily Clean",
    step: "Cleanse",
    src: dailyClean,
    description:
      "Gently removes dirt, oil, and impurities while preparing your skin for the next steps.",
    benefits: ["Cleanses", "Balances", "Refreshes"],
    glow: "rgba(170,200,150,0.55)",
    rot: -4,
    tagline: "Wake the skin.",
    ingredients: [
      { name: "Neem", pct: "32%" },
      { name: "Tulsi", pct: "24%" },
      { name: "Rose Clay", pct: "18%" },
    ],
    use: "Morning · 30 sec massage",
    time: "AM",
    texture: "Fine herbal powder",
    hue: "#8FA577",
  },
  {
    id: "glow",
    name: "Glow Repair",
    step: "Repair",
    src: glowRepair,
    description:
      "Helps support skin recovery and improves overall skin appearance for a brighter, even tone.",
    benefits: ["Nourishes", "Repairs", "Brightens"],
    glow: "rgba(240,200,130,0.55)",
    rot: 0,
    tagline: "Restore the glow.",
    ingredients: [
      { name: "Saffron", pct: "28%" },
      { name: "Turmeric", pct: "22%" },
      { name: "Sandalwood", pct: "20%" },
    ],
    use: "AM + PM · leave 5 min",
    time: "AM · PM",
    texture: "Golden silk powder",
    hue: "#D6A84B",
  },
  {
    id: "detox",
    name: "Deep Detox",
    step: "Detox",
    src: deepDetox,
    description:
      "A weekly detox treatment designed to deeply purify and refresh your skin from within.",
    benefits: ["Detoxifies", "Purifies", "Renews"],
    glow: "rgba(180,120,80,0.5)",
    rot: 4,
    tagline: "Reset from within.",
    ingredients: [
      { name: "Activated Charcoal", pct: "30%" },
      { name: "Multani Mitti", pct: "26%" },
      { name: "Ashwagandha", pct: "16%" },
    ],
    use: "Weekly · 10 min mask",
    time: "Weekly",
    texture: "Earthy clay blend",
    hue: "#8B5A3C",
  },
];

/* ═══════════════════ PART A — Problem → Ritual (compact merged) ═══════════════════ */

export function StoryProblem() {
  const painPoints = [
    "Too many products",
    "Too many ingredients",
    "Too many promises",
    "Too much trial & error",
  ];

  const jars = [
    { name: "Daily Clean", step: "Cleanse", src: dailyClean, glow: "rgba(170,200,150,0.55)", rot: -4 },
    { name: "Glow Repair", step: "Repair", src: glowRepair, glow: "rgba(240,200,130,0.55)", rot: 0 },
    { name: "Deep Detox", step: "Detox", src: deepDetox, glow: "rgba(180,120,80,0.5)", rot: 4 },
  ];

  return (
    <section
      id="routine"
      aria-label="The Problem and The Ritual"
      className="relative grain overflow-hidden"
    >
      {/* Ambient atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,238,205,0.45), rgba(247,243,236,0) 70%)",
          filter: "blur(22px)",
        }}
      />
      <img decoding="async"
        src={leaf1}
        alt=""
        aria-hidden
        className="hidden md:block absolute top-[4%] left-[3%] w-[90px] opacity-50"
        style={{ transform: "rotate(-20deg)", animation: "float-slower 12s ease-in-out infinite" }}
      />
      <img decoding="async"
        src={leaf2}
        alt=""
        aria-hidden
        className="hidden md:block absolute bottom-[6%] right-[4%] w-[100px] opacity-50"
        style={{ transform: "rotate(140deg)", animation: "float-slow 11s ease-in-out infinite" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 pt-10 md:pt-16 pb-10 md:pb-16">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-foreground/50 mb-3 md:mb-4">
          <span className="h-px w-8 bg-foreground/30" />
          The Problem
          <span className="h-px w-8 bg-foreground/30" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-center text-foreground leading-[1.02] tracking-[-0.02em] font-light text-[clamp(1.8rem,4.6vw,3.6rem)] max-w-[900px] mx-auto">
          Most Skincare Isn&apos;t{" "}
          <span className="italic text-primary/85">Complicated.</span>
          <br className="hidden sm:block" />{" "}
          It&apos;s Just Confusing.
        </h2>

        {/* Pain point chips */}
        <div className="mt-5 md:mt-7 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-[920px] mx-auto">
          {painPoints.map((pp) => (
            <div
              key={pp}
              className="flex items-center gap-2 rounded-full px-3 py-2 md:px-4 md:py-2.5"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(20,58,42,0.10)",
                boxShadow: "0 6px 16px -10px rgba(60,40,20,0.18)",
              }}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ background: "rgba(180,60,50,0.10)", color: "#9A3A30" }}
                aria-hidden
              >
                ✕
              </span>
              <span className="text-[12px] md:text-[13px] text-foreground/80 leading-tight">
                {pp}
              </span>
            </div>
          ))}
        </div>

        {/* Bridge */}
        <div className="mt-7 md:mt-9 flex flex-col items-center">
          <div className="h-5 w-px bg-foreground/20" />
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] md:text-[10.5px] tracking-[0.3em] uppercase"
            style={{
              background: "linear-gradient(135deg, #143A2A 0%, #1F5A40 100%)",
              color: "#F4ECDC",
              boxShadow: "0 10px 24px -10px rgba(20,58,42,0.5)",
            }}
          >
            <Check className="h-3 w-3" strokeWidth={2.4} style={{ color: "#E8C98A" }} />
            One Simple Ritual
          </div>
        </div>

        {/* Sub-headline */}
        <h3 className="mt-5 md:mt-6 font-serif text-center text-foreground leading-[1.02] tracking-[-0.02em] font-light text-[clamp(1.6rem,3.6vw,2.6rem)]">
          Three Formulas.{" "}
          <span className="italic text-primary/85">One Ritual.</span>
        </h3>

        {/* Jars row */}
        <div className="mt-5 md:mt-7 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-[900px] mx-auto">
          {jars.map((j) => (
            <div key={j.name} className="group flex flex-col items-center">
              <div className="relative w-full aspect-square flex items-center justify-center">
                <div
                  aria-hidden
                  className="absolute inset-0 m-auto h-[78%] w-[78%] rounded-full"
                  style={{
                    background: `radial-gradient(closest-side, ${j.glow}, rgba(247,243,236,0) 72%)`,
                    filter: "blur(14px)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 bottom-1 h-3 w-[65%] rounded-[50%]"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(60,40,20,0.25), rgba(0,0,0,0) 70%)",
                    filter: "blur(8px)",
                  }}
                />
                <img decoding="async"
                  src={j.src}
                  alt={`VedaGlows ${j.name}`}
                  className="relative max-h-full w-auto object-contain transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                  style={{
                    transform: `rotate(${j.rot}deg)`,
                    filter:
                      "drop-shadow(0 20px 22px rgba(60,40,15,0.32)) drop-shadow(0 0 10px rgba(255,220,170,0.2))",
                  }}
                  draggable={false}
                />
              </div>
              <span className="mt-1 text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-foreground/50">
                {j.step}
              </span>
              <span className="mt-0.5 font-serif italic font-light text-foreground text-[13px] sm:text-[15px] md:text-[17px] leading-tight text-center">
                {j.name}
              </span>
            </div>
          ))}
        </div>

        {/* Closer copy */}
        <p className="mt-5 md:mt-7 text-center max-w-[520px] mx-auto text-[13px] md:text-[14px] leading-[1.6] text-foreground/65">
          Three products designed to work together — instead of making you guess.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════ PART B — Ritual ═══════════════════ */

export function StoryRitual() {
  const [activeId, setActiveId] = useState<Product["id"]>("glow");
  const [hovering, setHovering] = useState(false);
  const active = PRODUCTS.find((pr) => pr.id === activeId) ?? PRODUCTS[1];
  const activeIdx = PRODUCTS.findIndex((p) => p.id === active.id);

  // Auto-rotate when user isn't hovering
  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => {
      setActiveId((curr) => {
        const i = PRODUCTS.findIndex((p) => p.id === curr);
        return PRODUCTS[(i + 1) % PRODUCTS.length].id;
      });
    }, 3600);
    return () => clearInterval(t);
  }, [hovering]);

  return (
    <section
      aria-label="The Reset Ritual"
      className="relative overflow-hidden grain"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Atmosphere — reactive glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2 h-[95vh] w-[95vh] rounded-full transition-all duration-[1200ms]"
        style={{
          background: `radial-gradient(closest-side, ${active.glow}, rgba(247,243,236,0) 70%)`,
          filter: "blur(28px)",
        }}
      />

      {/* Botanicals */}
      <img decoding="async"
        src={leaf1}
        alt=""
        aria-hidden
        className="absolute top-[8%] left-[2%] w-[150px] opacity-50 hidden md:block"
        style={{
          transform: "rotate(-18deg)",
          animation: "float-slower 13s ease-in-out infinite",
          filter: "drop-shadow(0 14px 14px rgba(40,60,30,0.15))",
        }}
      />
      <img decoding="async"
        src={leaf2}
        alt=""
        aria-hidden
        className="absolute bottom-[6%] right-[3%] w-[170px] opacity-50 hidden md:block"
        style={{
          transform: "rotate(150deg)",
          animation: "float-slow 11s ease-in-out infinite",
          filter: "drop-shadow(0 14px 14px rgba(40,60,30,0.15))",
        }}
      />

      {/* Vertical label */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 text-[10px] tracking-[0.4em] uppercase text-foreground/40 [writing-mode:vertical-rl] pointer-events-none hidden lg:block">
        The Ritual · 03 Steps
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pt-14 lg:pt-20 pb-20 lg:pb-28">
        {/* Intro */}
        <div className="text-center max-w-[920px] mx-auto">
          <div className="flex items-center justify-center gap-4 text-[11px] tracking-[0.45em] uppercase text-foreground/55 mb-6">
            <span className="h-px w-10 bg-foreground/30" />
            The Ritual
            <span className="h-px w-10 bg-foreground/30" />
          </div>
          <h2 className="font-serif text-foreground leading-[0.98] tracking-[-0.025em] font-light text-[clamp(2.4rem,5.6vw,4.6rem)]">
            The Complete{" "}
            <span className="italic text-primary/85">Skin Reset</span> Ritual
          </h2>
          <p className="mt-5 mx-auto max-w-[620px] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.65] text-foreground/65">
            Three carefully designed formulas that work together to cleanse,
            repair, and reset your skin in under five minutes a day.
          </p>

          {/* Live indicator */}
          <div className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-foreground/55">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: active.hue }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: active.hue }}
              />
            </span>
            Now Showing | Step 0{activeIdx + 1} · {active.name}
          </div>
        </div>

        {/* Main interactive stage: 3-column with side panels */}
        <div className="relative mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-8 lg:gap-10 items-center">
          {/* LEFT: Ingredient breakdown */}
          <div
            key={`l-${active.id}`}
            className="order-2 lg:order-1 rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur-sm p-6 lg:p-7"
            style={{ animation: "fade-up 600ms ease-out both" }}
          >
            <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-foreground/50 mb-5">
              <span className="h-px w-6 bg-foreground/30" />
              Key Ingredients
            </div>
            <ul className="space-y-4">
              {active.ingredients.map((ing, i) => (
                <li
                  key={ing.name}
                  className="group"
                  style={{
                    animation: `fade-up 600ms ease-out ${i * 90}ms both`,
                  }}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-serif italic text-[1.15rem] text-foreground/90">
                      {ing.name}
                    </span>
                    <span className="text-[11px] tracking-[0.3em] text-foreground/60 tabular-nums">
                      {ing.pct}
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: ing.pct,
                        background: active.hue,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-foreground/10">
              <div className="text-[10px] tracking-[0.4em] uppercase text-foreground/45 mb-2">
                Texture
              </div>
              <div className="font-serif italic text-foreground/85 text-[1.05rem]">
                {active.texture}
              </div>
            </div>
          </div>

          {/* CENTER: Product stage */}
          <div className="order-1 lg:order-2 relative">
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 bottom-[8%] h-10 w-[70%] rounded-[50%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(60,45,25,0.35), rgba(0,0,0,0) 70%)",
                filter: "blur(14px)",
              }}
            />

            {/* Concentric rings around active product */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: "min(420px, 80%)",
                aspectRatio: "1",
              }}
            >
              <div
                className="absolute inset-0 rounded-full border transition-all duration-1000"
                style={{
                  borderColor: `${active.hue}40`,
                  animation: "spin-slow 40s linear infinite",
                }}
              />
              <div
                className="absolute inset-[8%] rounded-full border transition-all duration-1000"
                style={{
                  borderColor: `${active.hue}25`,
                  animation: "spin-slow 60s linear infinite reverse",
                }}
              />
              <div
                className="absolute inset-[16%] rounded-full border-dashed border transition-all duration-1000"
                style={{ borderColor: `${active.hue}30` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end relative">
              {PRODUCTS.map((prod) => {
                const isActive = prod.id === activeId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onMouseEnter={() => setActiveId(prod.id)}
                    onFocus={() => setActiveId(prod.id)}
                    onClick={() => setActiveId(prod.id)}
                    className="group relative flex flex-col items-center pt-6 outline-none cursor-pointer"
                    aria-pressed={isActive}
                    aria-label={`View ${prod.name}`}
                  >
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-[6%] -translate-x-1/2 h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] rounded-full transition-all duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(closest-side, ${prod.glow}, rgba(247,243,236,0) 72%)`,
                        filter: "blur(18px)",
                        opacity: isActive ? 1 : 0.2,
                        transform: `scale(${isActive ? 1.1 : 0.85})`,
                      }}
                    />

                    <img decoding="async"
                      src={prod.src}
                      alt={`VedaGlows ${prod.name}`}
                      draggable={false}
                      className="relative w-full max-w-[180px] sm:max-w-[230px] lg:max-w-[280px] h-auto select-none transition-all duration-700 ease-out will-change-transform"
                      style={{
                        transform: `translateY(${isActive ? -22 : 6}px) rotate(${isActive ? 0 : prod.rot}deg) scale(${isActive ? 1.18 : 0.88})`,
                        opacity: isActive ? 1 : 0.7,
                        filter: isActive
                          ? "drop-shadow(0 60px 50px rgba(60,30,15,0.45)) drop-shadow(0 14px 22px rgba(60,30,15,0.25))"
                          : "drop-shadow(0 24px 26px rgba(60,30,15,0.22)) drop-shadow(0 6px 10px rgba(60,30,15,0.14))",
                        animation: isActive
                          ? "float-slow 6s ease-in-out infinite"
                          : "none",
                      }}
                    />

                    <div className="relative mt-5 flex flex-col items-center text-center">
                      <span
                        className="text-[10px] tracking-[0.4em] uppercase transition-colors duration-500"
                        style={{
                          color: isActive
                            ? "var(--primary)"
                            : "rgb(0 0 0 / 0.4)",
                        }}
                      >
                        Step 0{PRODUCTS.indexOf(prod) + 1}
                      </span>
                      <span
                        className="mt-2 font-serif italic font-light text-[clamp(1.1rem,1.5vw,1.5rem)] transition-colors duration-500"
                        style={{
                          color: isActive
                            ? "rgb(0 0 0 / 0.95)"
                            : "rgb(0 0 0 / 0.55)",
                        }}
                      >
                        {prod.name}
                      </span>
                      <span
                        aria-hidden
                        className="mt-2 block h-px bg-primary transition-all duration-500"
                        style={{ width: isActive ? 36 : 0 }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: How to use + benefits */}
          <div
            key={`r-${active.id}`}
            className="order-3 rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur-sm p-6 lg:p-7"
            style={{ animation: "fade-up 600ms ease-out 80ms both" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-foreground/50">
                <span className="h-px w-6 bg-foreground/30" />
                The Ritual
              </div>
              <span
                className="text-[10px] tracking-[0.3em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: `${active.hue}20`,
                  color: active.hue,
                }}
              >
                {active.time}
              </span>
            </div>

            <p className="font-serif italic text-foreground/90 text-[1.4rem] leading-[1.25] mb-4">
              "{active.tagline}"
            </p>
            <p className="text-[0.95rem] leading-[1.6] text-foreground/70 mb-6">
              {active.description}
            </p>

            <div className="text-[10px] tracking-[0.4em] uppercase text-foreground/45 mb-3">
              How to use
            </div>
            <div className="font-serif italic text-foreground/85 text-[1.05rem] mb-6">
              {active.use}
            </div>

            <ul className="flex flex-wrap gap-2">
              {active.benefits.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-foreground/15"
                >
                  <Check
                    className="h-3 w-3"
                    strokeWidth={2.5}
                    style={{ color: active.hue }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flow: Cleanse → Repair → Detox */}
        <div className="mt-16 lg:mt-20">
          <div className="flex items-center justify-center gap-3 text-[10px] tracking-[0.5em] uppercase text-foreground/45 mb-6">
            <span className="h-px w-8 bg-foreground/25" />
            The Flow
            <span className="h-px w-8 bg-foreground/25" />
          </div>

          <div className="mx-auto max-w-[900px] grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 sm:gap-5">
            {PRODUCTS.map((prod, i) => (
              <FlowStepFragment
                key={prod.id}
                prod={prod}
                index={i}
                isActive={prod.id === activeId}
                onActivate={() => setActiveId(prod.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FlowStepFragment helper ─── */

function FlowStepFragment({
  prod,
  index,
  isActive,
  onActivate,
}: {
  prod: Product;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className="group flex flex-col items-center text-center outline-none cursor-pointer"
      >
        <span
          className="text-[10.5px] tracking-[0.4em] uppercase transition-colors duration-500"
          style={{
            color: isActive ? "var(--primary)" : "rgb(0 0 0 / 0.4)",
          }}
        >
          0{index + 1}
        </span>
        <span
          className="mt-3 font-serif font-light text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-[-0.01em] transition-colors duration-500"
          style={{
            color: isActive ? "rgb(0 0 0 / 0.95)" : "rgb(0 0 0 / 0.55)",
          }}
        >
          {prod.step}
        </span>
        <span
          aria-hidden
          className="mt-2 block h-px bg-primary transition-all duration-500"
          style={{ width: isActive ? 28 : 0, opacity: isActive ? 1 : 0 }}
        />
      </button>

      {index < PRODUCTS.length - 1 && (
        <div
          aria-hidden
          className="relative h-px w-full bg-foreground/20 self-center"
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-foreground/30" />
        </div>
      )}
    </>
  );
}
