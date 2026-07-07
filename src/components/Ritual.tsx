import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const dailyClean = "/assets/dailyclean.webp";
const glowRepair = "/assets/glowrepair.webp";
const deepDetox = "/assets/deepdetox.webp";
const leaf1 = "/assets/leaf-1.webp";
const leaf2 = "/assets/leaf-2.webp";

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
      { name: "Moong", pct: "22%" },
      { name: "Oats", pct: "18%" },
      { name: "Rice Flour", pct: "15%" },
      { name: "Multani Mitti", pct: "12%" },
      { name: "Aloe Vera", pct: "10%" },
      { name: "Orange Peel", pct: "8%" },
      { name: "Neem", pct: "5%" },
      { name: "Tulsi", pct: "4%" },
      { name: "Mint", pct: "3%" },
      { name: "Rose Petal", pct: "3%" },
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
      { name: "Moong", pct: "18%" },
      { name: "Oats", pct: "15%" },
      { name: "Rice Flour", pct: "12%" },
      { name: "Multani Mitti", pct: "10%" },
      { name: "Aloe Vera", pct: "9%" },
      { name: "Rose Petal", pct: "8%" },
      { name: "Orange Peel", pct: "7%" },
      { name: "Mulethi", pct: "6%" },
      { name: "Sandalwood", pct: "5%" },
      { name: "Manjistha", pct: "4%" },
      { name: "Kasturi Haldi", pct: "3%" },
      { name: "Saffron Extract", pct: "3%" },
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
      { name: "Moong", pct: "18%" },
      { name: "Oats", pct: "15%" },
      { name: "Rice Flour", pct: "12%" },
      { name: "Multani Mitti", pct: "10%" },
      { name: "Aloe Vera", pct: "9%" },
      { name: "Rose Petal", pct: "8%" },
      { name: "Orange Peel", pct: "7%" },
      { name: "Neem", pct: "6%" },
      { name: "Tulsi", pct: "5%" },
      { name: "Manjistha", pct: "4%" },
      { name: "Amla", pct: "3%" },
      { name: "Activated Bamboo Charcoal", pct: "3%" },
    ],
    use: "Weekly · 10 min mask",
    time: "Weekly",
    texture: "Earthy clay blend",
    hue: "#8B5A3C",
  },
];

export function Ritual() {
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
      <img
        src={leaf1}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute top-[8%] left-[2%] w-[150px] opacity-50 hidden md:block"
        style={{
          transform: "rotate(-18deg)",
          animation: "float-slower 13s ease-in-out infinite",
          filter: "drop-shadow(0 14px 14px rgba(40,60,30,0.15))",
        }}
      />
      <img
        src={leaf2}
        alt=""
        aria-hidden
        loading="lazy"
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
            The Complete <span className="italic text-primary/85">Skin Reset</span> Ritual
          </h2>
          <p className="mt-5 mx-auto max-w-[620px] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.65] text-foreground/65">
            Three carefully designed formulas that work together to cleanse, repair, and reset your
            skin in under five minutes a day.
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

        {/* Desktop interactive stage: hidden on mobile */}
        <div className="hidden lg:grid relative mt-12 lg:mt-16 grid-cols-[1fr_1.4fr_1fr] gap-8 lg:gap-10 items-center">
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
            <ul className="space-y-2.5">
              {active.ingredients.map((ing, i) => (
                <li
                  key={ing.name}
                  className="group"
                  style={{
                    animation: `fade-up 600ms ease-out ${i * 90}ms both`,
                  }}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-serif italic text-[1.05rem] text-foreground/90">
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

                    <img
                      src={prod.src}
                      alt={`VedaGlow ${prod.name}`}
                      draggable={false}
                      loading="lazy"
                      className="relative w-full max-w-[180px] sm:max-w-[230px] lg:max-w-[280px] h-auto select-none transition-all duration-700 ease-out will-change-transform"
                      style={{
                        transform: `translateY(${isActive ? -22 : 6}px) rotate(${isActive ? 0 : prod.rot}deg) scale(${isActive ? 1.18 : 0.88})`,
                        opacity: isActive ? 1 : 0.7,
                        filter: isActive
                          ? "drop-shadow(0 60px 50px rgba(60,30,15,0.45)) drop-shadow(0 14px 22px rgba(60,30,15,0.25))"
                          : "drop-shadow(0 24px 26px rgba(60,30,15,0.22)) drop-shadow(0 6px 10px rgba(60,30,15,0.14))",
                        animation: isActive ? "float-slow 6s ease-in-out infinite" : "none",
                      }}
                    />

                    <div className="relative mt-5 flex flex-col items-center text-center">
                      <span
                        className="text-[10px] tracking-[0.4em] uppercase transition-colors duration-500"
                        style={{
                          color: isActive ? "var(--primary)" : "rgb(0 0 0 / 0.4)",
                        }}
                      >
                        Step 0{PRODUCTS.indexOf(prod) + 1}
                      </span>
                      <span
                        className="mt-2 font-serif italic font-light text-[clamp(1.1rem,1.5vw,1.5rem)] transition-colors duration-500"
                        style={{
                          color: isActive ? "rgb(0 0 0 / 0.95)" : "rgb(0 0 0 / 0.55)",
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
                  <Check className="h-3 w-3" strokeWidth={2.5} style={{ color: active.hue }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile interactive stage: hidden on desktop */}
        <div className="lg:hidden mt-8 flex flex-col gap-6">
          {/* Active Product display */}
          <div className="relative flex justify-center py-6">
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] rounded-full transition-all duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(closest-side, ${active.glow}, rgba(247,243,236,0) 72%)`,
                filter: "blur(18px)",
                transform: "scale(1.1)",
              }}
            />

            {/* Concentric rings */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[280px] h-[280px]"
            >
              <div
                className="absolute inset-0 rounded-full border transition-all duration-1000"
                style={{
                  borderColor: `${active.hue}35`,
                  animation: "spin-slow 40s linear infinite",
                }}
              />
              <div
                className="absolute inset-[10%] rounded-full border-dashed border transition-all duration-1000"
                style={{ borderColor: `${active.hue}25` }}
              />
            </div>

            <img
              src={active.src}
              alt={`VedaGlow ${active.name}`}
              loading="lazy"
              className="relative w-full max-w-[190px] h-auto select-none transition-all duration-700 ease-out will-change-transform"
              style={{
                filter:
                  "drop-shadow(0 40px 35px rgba(60,30,15,0.35)) drop-shadow(0 10px 15px rgba(60,30,15,0.2))",
                animation: "float-slow 6s ease-in-out infinite",
              }}
            />
          </div>

          {/* Flow selector (directly under the image) */}
          <div className="flex items-center justify-center gap-1 bg-background/30 backdrop-blur-sm border border-foreground/5 rounded-full p-1 max-w-[360px] mx-auto w-full">
            {PRODUCTS.map((prod, idx) => {
              const isActive = prod.id === activeId;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveId(prod.id)}
                  className="flex-1 py-1.5 rounded-full text-center transition-all duration-300 border border-transparent cursor-pointer"
                  style={{
                    background: isActive ? "rgba(244,236,220,0.25)" : "transparent",
                    borderColor: isActive ? `${active.hue}30` : "transparent",
                  }}
                >
                  <span
                    className="block text-[8px] tracking-[0.25em] uppercase transition-colors"
                    style={{ color: isActive ? "var(--primary)" : "rgba(0,0,0,0.4)" }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className="block font-serif text-[12.5px] leading-tight font-medium transition-colors"
                    style={{ color: isActive ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)" }}
                  >
                    {prod.step}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unified Detail Card */}
          <div
            key={active.id}
            className="rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur-sm p-5"
            style={{ animation: "fade-up 600ms ease-out both" }}
          >
            {/* Header info */}
            <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-foreground/5">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/45">
                  Step 0{activeIdx + 1}
                </span>
                <h3 className="font-serif italic font-light text-[1.35rem] leading-tight text-foreground">
                  {active.name}
                </h3>
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

            <p className="font-serif italic text-foreground/90 text-[1.2rem] leading-[1.3] mb-3">
              "{active.tagline}"
            </p>
            <p className="text-[0.88rem] leading-[1.5] text-foreground/70 mb-5">
              {active.description}
            </p>

            {/* Grid of Key Ingredients & How to Use */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 pb-5 border-b border-foreground/5">
              {/* Ingredients */}
              <div>
                <div className="text-[9px] tracking-[0.35em] uppercase text-foreground/40 mb-3">
                  Key Ingredients
                </div>
                <ul className="space-y-2">
                  {active.ingredients.map((ing) => (
                    <li key={ing.name}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-serif italic text-foreground/90">{ing.name}</span>
                        <span className="text-foreground/60 tabular-nums">{ing.pct}</span>
                      </div>
                      <div className="h-[2px] w-full bg-foreground/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: ing.pct, background: active.hue }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ritual & Texture */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[9px] tracking-[0.35em] uppercase text-foreground/40 mb-2">
                    How to use
                  </div>
                  <div className="font-serif italic text-foreground/80 text-[0.98rem] leading-snug">
                    {active.use}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.35em] uppercase text-foreground/40 mb-1.5">
                    Texture
                  </div>
                  <div className="font-serif italic text-foreground/80 text-[0.98rem] leading-snug">
                    {active.texture}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <ul className="flex flex-wrap gap-1.5">
              {active.benefits.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1 text-[9.5px] tracking-[0.18em] uppercase px-2.5 py-1.5 rounded-full border border-foreground/10"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} style={{ color: active.hue }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flow: Cleanse → Repair → Detox (Desktop only) */}
        <div className="hidden lg:block mt-16 lg:mt-20">
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
        <div aria-hidden className="relative h-px w-full bg-foreground/20 self-center">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-foreground/30" />
        </div>
      )}
    </>
  );
}
