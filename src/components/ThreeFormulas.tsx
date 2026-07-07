import { useEffect, useRef, useState } from "react";
import {
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Package,
} from "lucide-react";

const dailyClean = "/assets/dailyclean.webp";

const glowRepair = "/assets/glowrepair.webp";

const deepDetox = "/assets/deepdetox.webp";

const kitAsset = "/assets/kit.webp";

const leaf1 = "/assets/leaf-1.webp";

const leaf2 = "/assets/leaf-2.webp";

type Product = {
  id: string;
  step: string;
  stepLabel: string;
  name: string;
  short: string;
  img: string;
  rot: number;
  glow: string;
  benefits: string[];
};

const PRODUCTS: Product[] = [
  {
    id: "daily",
    step: "Step 01",
    stepLabel: "Cleanse",
    name: "Daily Clean",
    short: "Morning & Night Cleanser",
    img: dailyClean,
    rot: -4,
    glow: "rgba(190,215,170,0.7)",
    benefits: [
      "Removes dirt and oil",
      "Prepares skin for repair",
      "Gentle daily cleansing",
    ],
  },
  {
    id: "glow",
    step: "Step 02",
    stepLabel: "Repair",
    name: "Glow Repair",
    short: "Daily Repair Formula",
    img: glowRepair,
    rot: 4,
    glow: "rgba(240,200,130,0.7)",
    benefits: [
      "Supports brighter looking skin",
      "Helps improve texture",
      "Restores natural glow",
    ],
  },
  {
    id: "detox",
    step: "Step 03",
    stepLabel: "Detox",
    name: "Deep Detox",
    short: "Weekly Detox Formula",
    img: deepDetox,
    rot: -3,
    glow: "rgba(200,150,100,0.6)",
    benefits: [
      "Deep pore cleansing",
      "Removes buildup",
      "Supports clearer skin",
    ],
  },
];

export function ThreeFormulas() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const w = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section
      id="formulas"
      aria-label="Three Formulas. One Ritual."
      className="relative w-full overflow-hidden grain"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-[18%] h-[55vh] w-[55vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,228,180,0.5), rgba(247,243,236,0) 70%)",
          filter: "blur(22px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-[6%] h-[55vh] w-[55vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(190,210,175,0.35), rgba(247,243,236,0) 70%)",
          filter: "blur(24px)",
        }}
      />
      <img decoding="async"
        src={leaf1}
        alt=""
        aria-hidden
        className="absolute top-[6%] right-[3%] w-[100px] opacity-50 hidden md:block"
        style={{
          transform: "rotate(28deg)",
          animation: "float-slower 12s ease-in-out infinite",
        }}
      />
      <img decoding="async"
        src={leaf2}
        alt=""
        aria-hidden
        className="absolute bottom-[8%] left-[3%] w-[110px] opacity-50 hidden md:block"
        style={{
          transform: "rotate(-22deg)",
          animation: "float-slow 11s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 pt-12 md:pt-16 pb-14 md:pb-20">
        {/* Header — tight spacing */}
        <div className="text-center max-w-[820px] mx-auto">
          <div className="flex items-center justify-center gap-3 text-[10.5px] md:text-[11px] tracking-[0.4em] uppercase text-foreground/50 mb-3 md:mb-4">
            <span className="h-px w-8 bg-foreground/30" />
            The Reset System
            <span className="h-px w-8 bg-foreground/30" />
          </div>
          <h2 className="font-serif text-foreground leading-[0.95] tracking-[-0.025em] font-light text-[clamp(2.2rem,5.2vw,4rem)]">
            Three Formulas.{" "}
            <span className="italic text-primary/85">One Ritual.</span>
          </h2>
          <p className="mt-3 md:mt-4 mx-auto max-w-[520px] text-[14px] leading-[1.65] text-foreground/65">
            Three premium Ayurvedic formulas that cleanse, repair, and reset
            your skin — in under 5 minutes a day.
          </p>
        </div>

        {/* Mobile arrows */}
        <div className="md:hidden mt-6 flex items-center justify-end gap-2 px-1">
          <button
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white/70 border border-foreground/10"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white/70 border border-foreground/10"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>

        {/* Ritual flow — desktop step connector */}
        <div className="hidden md:flex items-center justify-center gap-3 mt-8 mb-2 text-[10.5px] tracking-[0.32em] uppercase text-foreground/55">
          <span style={{ color: "#1F5A40" }}>Cleanse</span>
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span style={{ color: "#1F5A40" }}>Repair</span>
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span style={{ color: "#1F5A40" }}>Detox</span>
        </div>

        {/* Product cards — mobile horizontal scroll-snap, desktop grid */}
        <div
          ref={scrollerRef}
          className="mt-3 md:mt-4 -mx-4 md:mx-0 px-4 md:px-0 flex md:grid gap-4 md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar"
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        {/* Bridge + Starter Kit — visually attached */}
        <div className="mt-8 md:mt-10">
          <div className="flex flex-col items-center text-center">
            <div className="h-6 w-px bg-foreground/20" />
            <div
              className="flex items-center gap-2 text-[10.5px] tracking-[0.32em] uppercase px-4 py-1.5 rounded-full -mb-px"
              style={{
                background: "#F7F3EC",
                color: "rgba(20,58,42,0.7)",
                border: "1px solid rgba(20,58,42,0.12)",
              }}
            >
              <Package className="h-3.5 w-3.5" style={{ color: "#1F5A40" }} />
              Complete Ritual Included In One Kit
            </div>
          </div>
          <StarterKitHighlight />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <article
      data-card
      className="group relative shrink-0 w-[82vw] max-w-[360px] md:w-auto md:max-w-none snap-center flex flex-col rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(247,243,236,0.65) 100%)",
        border: "1px solid rgba(20,58,42,0.10)",
        boxShadow:
          "0 18px 44px -22px rgba(60,40,20,0.22), 0 1px 0 rgba(255,255,255,0.8) inset",
      }}
    >
      {/* hover shadow boost */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow:
            "0 40px 80px -30px rgba(60,40,20,0.35), 0 0 0 1px rgba(201,168,106,0.25)",
        }}
      />

      {/* Image stage */}
      <div className="relative px-6 pt-6 pb-2 h-[230px] md:h-[260px] flex items-center justify-center">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[220px] w-[220px] rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${p.glow}, rgba(247,243,236,0) 72%)`,
            filter: "blur(14px)",
          }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-2 h-6 w-[70%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(50,35,18,0.28), rgba(0,0,0,0) 70%)",
            filter: "blur(10px)",
          }}
        />
        <img decoding="async"
          src={p.img}
          alt={`VedaGlows ${p.name}`}
          className="relative max-h-full w-auto object-contain transition-all duration-700 group-hover:-translate-y-2 group-hover:scale-[1.04]"
          style={{
            transform: `rotate(${p.rot}deg)`,
            filter:
              "drop-shadow(0 32px 26px rgba(60,40,15,0.35)) drop-shadow(0 0 14px rgba(255,220,170,0.22))",
          }}
        />

        {/* Step badge */}
        <span
          className="absolute top-4 left-4 text-[9.5px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(20,58,42,0.08)",
            color: "#143A2A",
          }}
        >
          {p.step}
        </span>

        {/* Step label badge */}
        <span
          className="absolute top-4 right-4 text-[9.5px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={{
            background: "linear-gradient(135deg, #C9A86A 0%, #E8C98A 100%)",
            color: "#143A2A",
          }}
        >
          {p.stepLabel}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif italic font-light text-foreground text-[1.45rem] leading-tight">
            {p.name}
          </h3>
          <p className="mt-1 text-[13px] text-foreground/65 leading-snug">
            {p.short}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3"
                style={{ fill: "#E8C98A", color: "#E8C98A" }}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-[11px] text-foreground/60">4.8 (1,240)</span>
        </div>

        {/* Benefits — always visible */}
        <ul className="flex flex-col gap-1.5 mt-1">
          {p.benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-[12.5px] text-foreground/80"
            >
              <Check
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                strokeWidth={2}
                style={{ color: "#1F5A40" }}
              />
              {b}
            </li>
          ))}
        </ul>

        {/* Included in kit badge — replaces price + CTAs */}
        <div
          className="mt-auto pt-3 flex items-center gap-2 rounded-2xl px-3 py-2.5 border"
          style={{
            background: "rgba(20,58,42,0.05)",
            borderColor: "rgba(20,58,42,0.14)",
          }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #143A2A 0%, #1F5A40 100%)",
            }}
          >
            <Check className="h-3 w-3 text-[color:var(--ivory)]" strokeWidth={2.6} />
          </span>
          <span className="text-[11.5px] tracking-[0.16em] uppercase text-foreground/80 font-medium">
            Included In Starter Kit
          </span>
        </div>
      </div>
    </article>
  );
}

const BUYERS = [
  "Priya from Mumbai",
  "Aanya from Bengaluru",
  "Riya from Delhi",
  "Sneha from Pune",
  "Kavya from Hyderabad",
  "Meera from Jaipur",
  "Ananya from Chennai",
  "Ishita from Kolkata",
];

function StarterKitHighlight() {
  const [kitsLeft, setKitsLeft] = useState(42);
  const [buyerIdx, setBuyerIdx] = useState(0);
  const [showBuyer, setShowBuyer] = useState(true);

  useEffect(() => {
    const stockT = setInterval(() => {
      setKitsLeft((n) => (n > 11 ? n - 1 : n));
    }, 32000);
    const buyerT = setInterval(() => {
      setShowBuyer(false);
      setTimeout(() => {
        setBuyerIdx((i) => (i + 1) % BUYERS.length);
        setShowBuyer(true);
      }, 320);
    }, 6000);
    return () => {
      clearInterval(stockT);
      clearInterval(buyerT);
    };
  }, []);

  return (
    <div
      className="relative mt-0 rounded-[28px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,58,42,0.97) 0%, rgba(31,90,64,0.97) 100%)",
        boxShadow:
          "0 40px 80px -30px rgba(20,58,42,0.6), 0 0 0 1px rgba(232,201,138,0.25) inset",
      }}
    >
      {/* gold accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,201,138,0.45), rgba(20,58,42,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Most Popular ribbon */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-px">
        <div
          className="rounded-b-full px-5 py-1.5 text-[10px] font-semibold tracking-[0.28em] uppercase"
          style={{
            background:
              "linear-gradient(135deg, #C9A86A 0%, #E8C98A 100%)",
            color: "#143A2A",
            boxShadow: "0 14px 28px -10px rgba(201,168,106,0.6)",
          }}
        >
          ★ Most Popular
        </div>
      </div>

      <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 px-5 md:px-10 pt-10 pb-7 md:py-10 items-center">
        {/* Left content */}
        <div className="relative">
          {/* floating leaves */}
          <img decoding="async"
            src={leaf1}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -left-6 -top-4 h-16 w-16 opacity-40"
            style={{ animation: "kitLeafA 9s ease-in-out infinite", filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.4))" }}
          />
          <img decoding="async"
            src={leaf2}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-0 h-14 w-14 opacity-30"
            style={{ animation: "kitLeafB 11s ease-in-out infinite", filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.4))" }}
          />

          {/* Kit image */}
          <div className="relative mb-5 mx-auto md:mx-0 w-full max-w-[320px]">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(232,201,138,0.35), rgba(232,201,138,0) 70%)",
                filter: "blur(28px)",
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(244,236,220,0.06), rgba(0,0,0,0.25))",
                border: "1px solid rgba(232,201,138,0.22)",
                boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
              }}
            >
              <img decoding="async"
                src={kitAsset}
                alt="VedaGlows Starter Kit"
                className="w-full h-auto transition-transform duration-700 hover:scale-105"
                style={{ animation: "kitFloatHL 7s ease-in-out infinite" }}
                draggable={false}
              />
              {/* discount sticker */}
              <div
                className="absolute top-3 right-3 flex flex-col items-center justify-center h-14 w-14 rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A86A 0%, #E8C98A 100%)",
                  color: "#143A2A",
                  boxShadow: "0 10px 22px -8px rgba(201,168,106,0.7)",
                  transform: "rotate(-8deg)",
                }}
              >
                <span className="text-[15px] leading-none">40%</span>
                <span className="text-[7.5px] tracking-[0.18em] mt-0.5">OFF</span>
              </div>
            </div>
          </div>

          <div
            className="text-[10.5px] tracking-[0.32em] uppercase"
            style={{ color: "#E8C98A" }}
          >
            The Complete Ritual · 28 Days
          </div>
          <h3 className="font-serif italic font-light text-[color:var(--ivory)] mt-2 text-[clamp(1.9rem,3.6vw,2.6rem)] leading-[1.05]">
            The Starter Kit
          </h3>

          {/* Rating + social proof */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#E8C98A" }} />
              ))}
              <span className="ml-1 text-[12px] font-semibold text-[color:var(--ivory)]">4.8</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["#E8C98A", "#C9A86A", "#F4ECDC", "#A8896A"].map((c, i) => (
                  <span
                    key={i}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ring-2"
                    style={{
                      background: c,
                      color: "#143A2A",
                      // @ts-expect-error ring color
                      "--tw-ring-color": "#143A2A",
                    }}
                  >
                    {["P", "A", "R", "M"][i]}
                  </span>
                ))}
              </div>
              <span className="text-[11.5px] text-[color:var(--ivory)]/75">
                7,200+ happy customers
              </span>
            </div>
          </div>

          <p className="mt-3 text-[13.5px] leading-[1.65] text-[color:var(--ivory)]/75 max-w-[440px]">
            Everything you need to reset your skin in 28 days. Save 40% when you
            buy the full ritual together.
          </p>

          {/* Step flow */}
          <div className="mt-5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] text-[color:var(--ivory)]/90 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] cursor-default"
                  style={{
                    background: "rgba(232,201,138,0.08)",
                    border: "1px solid rgba(232,201,138,0.28)",
                    boxShadow: "inset 0 1px 0 rgba(244,236,220,0.06)",
                  }}
                >
                  <span
                    className="text-[8.5px] font-semibold tracking-[0.18em] px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(232,201,138,0.22)", color: "#E8C98A" }}
                  >
                    0{i + 1}
                  </span>
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} style={{ color: "#E8C98A" }} />
                  <span className="whitespace-nowrap">{p.name}</span>
                </div>
                {i < PRODUCTS.length - 1 && (
                  <ArrowRight className="h-3 w-3 shrink-0" style={{ color: "rgba(232,201,138,0.55)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: pricing + CTAs */}
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{
            background: "rgba(247,243,236,0.06)",
            border: "1px solid rgba(232,201,138,0.25)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Live urgency banner */}
          <div
            className="mb-3 flex items-center justify-between gap-3 rounded-full px-3 py-2 text-[10.5px]"
            style={{
              background: "rgba(20,58,42,0.55)",
              border: "1px solid rgba(232,201,138,0.28)",
            }}
          >
            <span className="flex items-center gap-1.5 font-semibold text-[#F4ECDC]/90 whitespace-nowrap">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#FF6B6B" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "#FF6B6B" }} />
              </span>
              Live · Only {kitsLeft} kits left
            </span>
            <span
              className="hidden sm:inline truncate text-right italic text-[#E8C98A]/90 transition-opacity duration-300"
              style={{ opacity: showBuyer ? 1 : 0 }}
            >
              {BUYERS[buyerIdx]} just bought
            </span>
          </div>
          <div
            className="sm:hidden -mt-1 mb-3 text-[10.5px] italic text-[#E8C98A]/90 text-center transition-opacity duration-300"
            style={{ opacity: showBuyer ? 1 : 0 }}
          >
            {BUYERS[buyerIdx]} just bought
          </div>

          {/* Offer tiers */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Starter */}
            <div
              className="relative rounded-xl p-3.5 flex flex-col"
              style={{
                background: "rgba(20,58,42,0.45)",
                border: "1px solid rgba(232,201,138,0.18)",
              }}
            >
              <div
                className="text-[9px] tracking-[0.24em] uppercase"
                style={{ color: "rgba(232,201,138,0.75)" }}
              >
                Starter
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-[1.9rem] leading-none text-[color:var(--ivory)]">
                  ₹499
                </span>
                <span className="text-[12px] text-[color:var(--ivory)]/45 line-through">
                  ₹1299
                </span>
              </div>
              <div className="mt-1 text-[10.5px] text-[color:var(--ivory)]/65">
                1 Kit
              </div>
            </div>

            {/* Bundle — highlighted */}
            <div
              className="relative rounded-xl p-3.5 flex flex-col"
              style={{
                background:
                  "linear-gradient(160deg, rgba(232,201,138,0.22) 0%, rgba(201,168,106,0.10) 100%)",
                border: "1.5px solid rgba(232,201,138,0.7)",
                boxShadow:
                  "0 18px 36px -18px rgba(201,168,106,0.55), inset 0 1px 0 rgba(255,243,218,0.18)",
              }}
            >
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8.5px] font-semibold tracking-[0.22em] uppercase whitespace-nowrap"
                style={{
                  background:
                    "linear-gradient(135deg, #C9A86A 0%, #E8C98A 100%)",
                  color: "#143A2A",
                }}
              >
                ★ Most Popular
              </div>
              <div
                className="text-[9px] tracking-[0.24em] uppercase"
                style={{ color: "#E8C98A" }}
              >
                Bundle
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-[1.9rem] leading-none text-[color:var(--ivory)]">
                  ₹998
                </span>
                <span className="text-[12px] text-[color:var(--ivory)]/45 line-through">
                  ₹2598
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[color:var(--ivory)]/80">
                2 Kits
              </div>
            </div>
          </div>

          {/* Benefits */}
          <ul className="mt-4 space-y-1.5">
            {[
              "3 focused formulas for acne, oil & dullness",
              "Fast delivery & secure checkout",
              "7-day satisfaction assurance",
            ].map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-[12px] text-[color:var(--ivory)]/85"
              >
                <Check
                  className="h-3.5 w-3.5 shrink-0 mt-[2px]"
                  strokeWidth={2.4}
                  style={{ color: "#E8C98A" }}
                />
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-4 flex flex-col gap-2.5">
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-full text-[12px] font-semibold tracking-[0.16em] uppercase transition-transform hover:-translate-y-0.5"
              style={{
                minHeight: 54,
                background:
                  "linear-gradient(135deg, #E8C98A 0%, #C9A86A 100%)",
                color: "#143A2A",
                boxShadow:
                  "0 20px 40px -16px rgba(201,168,106,0.65), 0 0 0 1px rgba(20,58,42,0.15) inset",
              }}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2} />
              Claim 1 Kit · ₹499
            </button>
            <button
              className="w-full relative inline-flex items-center justify-center gap-2 rounded-full text-[12px] font-semibold tracking-[0.16em] uppercase text-[color:var(--ivory)] transition-transform hover:-translate-y-0.5"
              style={{
                minHeight: 52,
                background:
                  "linear-gradient(135deg, rgba(232,201,138,0.18) 0%, rgba(232,201,138,0.06) 100%)",
                border: "1.5px solid rgba(232,201,138,0.65)",
                boxShadow: "0 0 24px -10px rgba(232,201,138,0.5)",
              }}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} style={{ color: "#E8C98A" }} />
              Upgrade to 2 Kits · ₹998
            </button>
          </div>

          <div
            className="mt-3 text-center text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "rgba(232,201,138,0.75)" }}
          >
            ✓ Free Shipping · ✓ COD · ✓ 7-Day Promise
          </div>
        </div>
      </div>
      <style>{`
        @keyframes kitFloatHL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes kitLeafA { 0%,100%{transform:translate(0,0) rotate(-6deg)} 50%{transform:translate(4px,-6px) rotate(4deg)} }
        @keyframes kitLeafB { 0%,100%{transform:translate(0,0) rotate(8deg)} 50%{transform:translate(-6px,6px) rotate(-4deg)} }
      `}</style>
    </div>
  );
}

