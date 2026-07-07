import { useEffect, useMemo, useRef, useState } from "react";

import ingNeem from "@/assets/ing-neem.jpg";
import ingTulsi from "@/assets/ing-tulsi.jpg";
import ingMint from "@/assets/ing-mint.jpg";
import ingOrangePeel from "@/assets/ing-orange-peel.jpg";
import ingKasturi from "@/assets/ing-kasturi-haldi.jpg";
import ingSaffron from "@/assets/ing-saffron.jpg";
import ingMulethi from "@/assets/ing-mulethi.jpg";
import ingManjistha from "@/assets/ing-manjistha.jpg";
import ingCharcoal from "@/assets/ing-charcoal.jpg";
import ingAmla from "@/assets/ing-amla.jpg";
import ingMultani from "@/assets/ing-multani.jpg";

const dailyCleanProduct = "/assets/dailyclean.webp";
const glowRepairProduct = "/assets/glowrepair.webp";
const deepDetoxProduct = "/assets/deepdetox.webp";

type FormulaKey = "Daily Clean" | "Glow Repair" | "Deep Detox";

type Ingredient = {
  name: string;
  scientific: string;
  description: string;
  formula: FormulaKey;
  tags: string[];
  img: string;
};

const INGREDIENTS: Ingredient[] = [
  { name: "Neem", scientific: "Azadirachta indica", description: "Controls acne and excess oil", formula: "Daily Clean", tags: ["Acne", "Oil Control"], img: ingNeem },
  { name: "Tulsi", scientific: "Ocimum sanctum", description: "Soothes and protects daily", formula: "Daily Clean", tags: ["Calm", "Purify"], img: ingTulsi },
  { name: "Mint", scientific: "Mentha arvensis", description: "Cools and refreshes skin", formula: "Daily Clean", tags: ["Cooling", "Refresh"], img: ingMint },
  { name: "Orange Peel", scientific: "Citrus sinensis", description: "Gently exfoliates and brightens", formula: "Daily Clean", tags: ["Brighten", "Exfoliate"], img: ingOrangePeel },
  { name: "Kasturi Haldi", scientific: "Curcuma aromatica", description: "Reduces blemishes and spots", formula: "Glow Repair", tags: ["Brighten", "Even Tone"], img: ingKasturi },
  { name: "Saffron", scientific: "Crocus sativus", description: "Improves radiance and glow", formula: "Glow Repair", tags: ["Glow", "Radiance"], img: ingSaffron },
  { name: "Mulethi", scientific: "Glycyrrhiza glabra", description: "Lightens pigmentation naturally", formula: "Glow Repair", tags: ["Pigmentation", "Repair"], img: ingMulethi },
  { name: "Manjistha", scientific: "Rubia cordifolia", description: "Improves skin clarity and tone", formula: "Glow Repair", tags: ["Clarity", "Even Tone"], img: ingManjistha },
  { name: "Charcoal", scientific: "Bamboo activated", description: "Draws impurities from pores", formula: "Deep Detox", tags: ["Detox", "Pores"], img: ingCharcoal },
  { name: "Amla", scientific: "Phyllanthus emblica", description: "Antioxidant Vitamin C boost", formula: "Deep Detox", tags: ["Antioxidant", "Glow"], img: ingAmla },
  { name: "Neem", scientific: "Azadirachta indica", description: "Antibacterial deep cleanse", formula: "Deep Detox", tags: ["Acne", "Detox"], img: ingNeem },
  { name: "Multani Mitti", scientific: "Fuller's Earth", description: "Deeply cleanses clogged pores", formula: "Deep Detox", tags: ["Pores", "Texture"], img: ingMultani },
];

type Formula = {
  key: FormulaKey;
  category: string;
  img: string;
  accent: string;
  glow: string;
  shadow: string;
  pills: string[];
};

const FORMULAS: Formula[] = [
  {
    key: "Daily Clean",
    category: "Cleanser",
    img: dailyCleanProduct,
    accent: "#7F9A6C",
    glow: "rgba(190,215,170,0.55)",
    shadow: "0 24px 50px -22px rgba(127,154,108,0.55)",
    pills: ["Moong", "Oats", "Rice Flour", "Multani Mitti", "Aloe Vera", "Orange Peel", "Neem", "Tulsi", "Mint", "Rose"],
  },
  {
    key: "Glow Repair",
    category: "Repair",
    img: glowRepairProduct,
    accent: "#C9A86A",
    glow: "rgba(240,200,130,0.55)",
    shadow: "0 24px 50px -22px rgba(201,168,106,0.55)",
    pills: ["Moong", "Oats", "Rice Flour", "Multani Mitti", "Aloe Vera", "Rose", "Mulethi", "Sandalwood", "Manjistha", "Kasturi Haldi", "Saffron"],
  },
  {
    key: "Deep Detox",
    category: "Detox",
    img: deepDetoxProduct,
    accent: "#8A5A3C",
    glow: "rgba(200,150,100,0.5)",
    shadow: "0 24px 50px -22px rgba(138,90,60,0.55)",
    pills: ["Moong", "Oats", "Rice Flour", "Multani Mitti", "Aloe Vera", "Rose", "Orange Peel", "Neem", "Tulsi", "Manjistha", "Amla", "Charcoal"],
  },
];

const CYCLE_MS = 4000;

export function Formula() {
  const [visible, setVisible] = useState(false);
  const [activeFormula, setActiveFormula] = useState<FormulaKey>("Daily Clean");
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // formula cycle
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveFormula((cur) => {
        const i = FORMULAS.findIndex((f) => f.key === cur);
        return FORMULAS[(i + 1) % FORMULAS.length].key;
      });
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [paused, activeFormula]);

  const activeData = FORMULAS.find((f) => f.key === activeFormula)!;

  // Get ingredients for active formula and duplicate for marquee
  const activeIngredientsBase = useMemo(
    () => INGREDIENTS.filter((i) => i.formula === activeFormula),
    [activeFormula]
  );
  // Duplicate enough times to cover a wide screen
  const marqueeItems = useMemo(
    () => [...activeIngredientsBase, ...activeIngredientsBase, ...activeIngredientsBase],
    [activeIngredientsBase]
  );

  return (
    <section
      id="ingredients"
      ref={sectionRef}
      aria-label="Inside The Formula"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background:
          "radial-gradient(60% 50% at 15% 20%, rgba(190,215,170,0.08), transparent 70%), radial-gradient(50% 40% at 85% 80%, rgba(240,210,160,0.08), transparent 70%), var(--ivory, #F7F3EC)",
      }}
    >
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 py-8 md:py-10">
        {/* Header — compact */}
        <div
          className="text-center max-w-[760px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="flex items-center justify-center gap-3 text-[9.5px] tracking-[0.4em] uppercase text-foreground/45 mb-2.5">
            <span className="h-px w-6 bg-foreground/25" />
            Inside The Formula
            <span className="h-px w-6 bg-foreground/25" />
          </div>
          <h2 className="font-serif text-foreground leading-[1.05] tracking-[-0.02em] font-light text-[clamp(1.6rem,3.2vw,2.4rem)]">
            Powered By Nature.
            <span className="italic" style={{ color: activeData.accent, transition: "color 500ms" }}>
              {" "}{activeFormula}.
            </span>
          </h2>
        </div>

        {/* Ingredient autoplay slider */}
        <div
          className="mt-5 md:mt-6 overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.15s",
          }}
        >
          <div key={activeFormula} className="relative flex group/marquee" style={{ animation: "fade-in 0.6s ease-out" }}>
            <div className="ing-marquee flex gap-3 md:gap-4 pr-3 md:pr-4 shrink-0">
              {marqueeItems.map((ing, i) => {
                const accent = FORMULAS.find((f) => f.key === ing.formula)!.accent;
                return (
                  <article
                    key={`${ing.name}-${i}`}
                    className="ing-card group relative shrink-0 overflow-hidden bg-white"
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${accent}55`,
                      boxShadow: `0 18px 38px -20px ${accent}66, 0 0 0 1px ${accent}33 inset`,
                      transition: "transform 500ms ease",
                    }}
                  >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3.4" }}>
                      <img
                        src={ing.img}
                        alt={ing.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,15,8,0.55) 100%)",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-[8.5px] tracking-[0.22em] uppercase text-white/75 mb-0.5">
                          {ing.scientific}
                        </p>
                        <h3 className="font-serif italic font-light text-white text-[1rem] leading-tight">
                          {ing.name}
                        </h3>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            
            {/* Duplicate for seamless loop */}
            <div aria-hidden="true" className="ing-marquee flex gap-3 md:gap-4 pr-3 md:pr-4 shrink-0">
              {marqueeItems.map((ing, i) => {
                const accent = FORMULAS.find((f) => f.key === ing.formula)!.accent;
                return (
                  <article
                    key={`dup-${ing.name}-${i}`}
                    className="ing-card group relative shrink-0 overflow-hidden bg-white"
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${accent}55`,
                      boxShadow: `0 18px 38px -20px ${accent}66, 0 0 0 1px ${accent}33 inset`,
                    }}
                  >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3.4" }}>
                      <img
                        src={ing.img}
                        alt={ing.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,15,8,0.55) 100%)",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-[8.5px] tracking-[0.22em] uppercase text-white/75 mb-0.5">
                          {ing.scientific}
                        </p>
                        <h3 className="font-serif italic font-light text-white text-[1rem] leading-tight">
                          {ing.name}
                        </h3>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Formula cards — three across */}
        <div
          className="mt-5 md:mt-7 grid grid-cols-3 gap-2.5 md:gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s ease-out 0.25s",
          }}
        >
          {FORMULAS.map((f) => {
            const isActive = f.key === activeFormula;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFormula(f.key)}
                className="formula-card group relative flex flex-col items-center text-left bg-white overflow-hidden"
                style={{
                  borderRadius: 18,
                  border: `1px solid ${isActive ? f.accent + "55" : "rgba(20,58,42,0.08)"}`,
                  padding: "14px 12px 16px",
                  opacity: isActive ? 1 : 0.65,
                  transform: isActive ? "scale(1.02)" : "scale(0.96)",
                  boxShadow: isActive ? f.shadow : "0 6px 18px -14px rgba(60,40,20,0.2)",
                  transition: "all 600ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div className="relative flex items-center justify-center" style={{ width: "100%", height: 90 }}>
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(closest-side, ${f.glow}, transparent 72%)`,
                      filter: "blur(14px)",
                      opacity: isActive ? 1 : 0.4,
                      transition: "opacity 500ms ease",
                    }}
                  />
                  <img
                    src={f.img}
                    alt={f.key}
                    loading="lazy"
                    className="relative h-[80px] md:h-[88px] w-auto object-contain"
                    style={{
                      filter: `drop-shadow(0 14px 18px rgba(60,40,15,0.25))`,
                      animation: isActive ? "jar-float 3.6s ease-in-out infinite" : "none",
                    }}
                  />
                </div>

                <p className="mt-1.5 text-[8.5px] md:text-[9px] tracking-[0.28em] uppercase text-foreground/50 text-center w-full">
                  {f.category}
                </p>
                <h3
                  className="font-serif italic font-light text-foreground text-[1rem] md:text-[1.2rem] leading-tight text-center w-full"
                  style={{ color: isActive ? f.accent : undefined, transition: "color 500ms" }}
                >
                  {f.key}
                </h3>

                {/* pills appear inside active card only */}
                <div
                  className="w-full overflow-hidden"
                  style={{
                    maxHeight: isActive ? 200 : 0,
                    opacity: isActive ? 1 : 0,
                    transition: "max-height 600ms ease, opacity 500ms ease 100ms",
                  }}
                >
                  <div className="mt-2.5 hidden md:flex flex-wrap gap-1 justify-center">
                    {f.pills.slice(0, 8).map((p, i) => (
                      <span
                        key={p}
                        className="inline-flex items-center text-[10px]"
                        style={{
                          background: "#F7F3EC",
                          color: "#5C5C5C",
                          borderRadius: 999,
                          padding: "3px 8px",
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? "translateY(0)" : "translateY(6px)",
                          transition: `opacity 400ms ease ${i * 80}ms, transform 400ms ease ${i * 80}ms`,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile pills — only for active formula */}
        <div className="md:hidden mt-3 flex flex-wrap gap-1.5 justify-center">
          {activeData.pills.slice(0, 7).map((p, i) => (
            <span
              key={p + activeFormula}
              className="inline-flex items-center text-[10.5px]"
              style={{
                background: "#FFFFFF",
                color: "#5C5C5C",
                borderRadius: 999,
                padding: "4px 9px",
                border: `1px solid ${activeData.accent}33`,
                animation: `pill-in 400ms ease both`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {FORMULAS.map((f) => (
            <span
              key={f.key}
              className="block h-[3px] rounded-full transition-all duration-500"
              style={{
                width: f.key === activeFormula ? 28 : 10,
                background: f.key === activeFormula ? f.accent : "rgba(20,58,42,0.18)",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .ing-marquee {
          animation: scroll-left 35s linear infinite;
        }
        .group\\/marquee:hover .ing-marquee {
          animation-play-state: paused;
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .ing-card {
          width: 76vw;
        }
        @media (min-width: 768px) {
          .ing-card {
            width: calc((min(100vw, 1320px) - 48px - 48px) / 4);
          }
        }
        @keyframes jar-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pill-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
