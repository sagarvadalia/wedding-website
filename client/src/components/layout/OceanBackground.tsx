import { motion } from 'framer-motion';
import { useMemo } from 'react';

// ── Color Palettes ──

const FISH_PALETTES = [
  { body: '#4A90D9', accent: '#3A7BC8', eye: '#1E3A5F' },
  { body: '#6CB4EE', accent: '#5BA0DA', eye: '#2E5F8A' },
  { body: '#2E8B8B', accent: '#1E6B6B', eye: '#0F4545' },
  { body: '#5F9EA0', accent: '#4F8E90', eye: '#2F5E60' },
];

const CLOWN_PALETTE = { body: '#FF6B3D', stripe: '#FFFFFF', fin: '#FF8C55', eye: '#1a1a1a' };
const YELLOW_PALETTE = { body: '#FFD700', accent: '#E6C200', eye: '#8B7500' };

const TROPICAL_PALETTES = [
  { body: '#4682B4', band: '#FFD700', fin: '#3A6F9E' },
  { body: '#FF8C42', band: '#FFFFFF', fin: '#E67330' },
  { body: '#20B2AA', band: '#FFD700', fin: '#1A9090' },
  { body: '#9370DB', band: '#E6C65C', fin: '#7B5EC2' },
  { body: '#E8735A', band: '#FFFFFF', fin: '#D4614A' },
];

const JELLY_PALETTES = [
  { dome: '#FFB3D9', tentacle: '#FF8AC4', inner: '#FFC1E0' },
  { dome: '#B8A9E8', tentacle: '#9B7FCF', inner: '#D0C5F0' },
  { dome: '#87CEEB', tentacle: '#6BB8D9', inner: '#A8DCEF' },
  { dome: '#FFD1A9', tentacle: '#FFB87A', inner: '#FFE0C2' },
];

const SCHOOL_COLORS = ['#6CB4EE', '#87CEEB', '#4EABAB', '#FFD700', '#FF8C42'];

const STARFISH_COLORS = ['#FF6B6B', '#FF8C42', '#E8735A', '#FFB347'];

const CORAL_PALETTES = [
  { main: '#FF69B4', accent: '#FF85C8' },
  { main: '#FF8C42', accent: '#FFA366' },
  { main: '#9B59B6', accent: '#B370CF' },
  { main: '#E8735A', accent: '#EF8D79' },
  { main: '#FF6B9D', accent: '#FF85B1' },
  { main: '#20B2AA', accent: '#3CC8C0' },
];

const SEAHORSE_PALETTE = { body: '#DAA520', belly: '#F0D060', crown: '#B8860B' };
const TURTLE_PALETTE = { shell: '#2E8B57', shellInner: '#3CB371', skin: '#3A9E6E' };
const SHARK_PALETTE = { body: '#4A6B7A', belly: 'rgba(200,220,235,0.30)', fin: '#3D5A68' };

// ── Variant Configuration ──

interface VariantConfig {
  godRays: number;
  schoolCount: number;
  schoolSize: number;
  bgJellyfish: number;
  coralCount: number;
  kelpCount: number;
  starfishCount: number;
  midFish: number;
  tropicalFish: number;
  seahorses: number;
  turtles: number;
  hasShark: boolean;
  fgFish: number;
  fgJellyfish: number;
  bubbles: number;
  particles: number;
}

const CONFIGS: Record<'surface' | 'deep', VariantConfig> = {
  surface: {
    godRays: 3, schoolCount: 3, schoolSize: 4, bgJellyfish: 1,
    coralCount: 4, kelpCount: 4, starfishCount: 2,
    midFish: 6, tropicalFish: 2, seahorses: 1, turtles: 1, hasShark: false,
    fgFish: 3, fgJellyfish: 2, bubbles: 30, particles: 12,
  },
  deep: {
    godRays: 5, schoolCount: 4, schoolSize: 5, bgJellyfish: 2,
    coralCount: 5, kelpCount: 8, starfishCount: 4,
    midFish: 10, tropicalFish: 4, seahorses: 2, turtles: 2, hasShark: true,
    fgFish: 4, fgJellyfish: 4, bubbles: 40, particles: 15,
  },
};

// ── God Ray Presets ──

const GOD_RAY_PRESETS = [
  { left: '8%', w: 300, h: 700, angle: -20, blur: 30, peakDelay: 0, dur: 4 },
  { left: '25%', w: 250, h: 600, angle: -10, blur: 25, peakDelay: 1, dur: 5 },
  { left: '45%', w: 280, h: 650, angle: 5, blur: 28, peakDelay: 0.5, dur: 4.5 },
  { left: '62%', w: 220, h: 550, angle: 15, blur: 22, peakDelay: 2, dur: 5.5 },
  { left: '78%', w: 260, h: 580, angle: 22, blur: 26, peakDelay: 1.5, dur: 4.8 },
];

// ── Data Generators (deterministic, no Math.random) ──

function generateBubbles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 4 + (i % 7) * 2,
    left: `${(i * 7.3) % 100}%`,
    delay: (i * 0.35) % 14,
    duration: 10 + (i % 8) * 3,
  }));
}

function generateSchools(count: number, schoolSize: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    fishCount: schoolSize - (i % 2),
    top: `${12 + (i * 22) % 65}%`,
    direction: (i % 2 === 0 ? 'left' : 'right') as const,
    delay: i * 3,
    duration: 22 + (i % 4) * 3,
    opacity: 0.30 + (i % 3) * 0.05,
    colorIndex: i % SCHOOL_COLORS.length,
  }));
}

type FishLayer = 'bg' | 'mid' | 'fg';

function generateFish(count: number, layer: FishLayer) {
  const sizeBase = layer === 'bg' ? 18 : layer === 'fg' ? 42 : 32;
  const sizeStep = layer === 'bg' ? 3 : layer === 'fg' ? 5 : 4;
  const durBase = layer === 'bg' ? 30 : layer === 'fg' ? 15 : 20;
  const durStep = layer === 'bg' ? 3 : layer === 'fg' ? 2 : 2;
  const opBase = layer === 'bg' ? 0.25 : layer === 'fg' ? 0.42 : 0.35;
  const opStep = layer === 'bg' ? 0.02 : layer === 'fg' ? 0.03 : 0.03;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: sizeBase + (i % 5) * sizeStep,
    top: `${8 + (i * 17) % 75}%`,
    direction: (i % 2 === 0 ? 'left' : 'right') as const,
    delay: (i * 2.5) % 25,
    duration: durBase + (i % 5) * durStep,
    opacity: opBase + (i % 4) * opStep,
    paletteIndex: i % FISH_PALETTES.length,
    fishType: (i % 6 < 3 ? 'regular' : i % 6 < 5 ? 'clown' : 'yellow') as const,
  }));
}

function generateTropical(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: 58 + (i % 3) * 8,
    height: 38 + (i % 3) * 5,
    top: `${15 + i * 20}%`,
    direction: (i % 2 === 0 ? 'left' : 'right') as const,
    delay: i * 5 + 2,
    duration: 28 + i * 4,
    opacity: 0.38 + (i % 3) * 0.04,
    colorIndex: i % TROPICAL_PALETTES.length,
  }));
}

function generateJellyfish(count: number, layer: 'bg' | 'fg') {
  const sBase = layer === 'bg' ? 30 : 38;
  const sStep = layer === 'bg' ? 3 : 5;
  const oBase = layer === 'bg' ? 0.22 : 0.35;
  const oStep = layer === 'bg' ? 0.04 : 0.06;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: sBase + (i % 4) * sStep,
    height: Math.round((sBase + (i % 4) * sStep) * 1.5),
    left: `${12 + (i * 23) % 70}%`,
    delay: i * 5 + 1,
    duration: 32 + i * 5,
    opacity: oBase + (i % 3) * oStep,
    colorIndex: i % JELLY_PALETTES.length,
  }));
}

function generateSeahorses(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 38 + (i % 2) * 8,
    left: `${22 + i * 35}%`,
    delay: i * 8 + 5,
    duration: 28 + i * 5,
    opacity: 0.40 + (i % 2) * 0.06,
  }));
}

function generateTurtles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 80 + (i % 2) * 12,
    top: `${22 + i * 28}%`,
    direction: (i % 2 === 0 ? 'left' : 'right') as const,
    delay: i * 15 + 8,
    duration: 45 + i * 8,
    opacity: 0.40 + (i % 2) * 0.05,
  }));
}

function generateKelp(count: number) {
  const spacing = count > 1 ? 88 / (count - 1) : 44;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${6 + i * spacing}%`,
    height: 110 + (i % 3) * 45,
    delay: i * 0.4,
    swayAmount: 6 + (i % 3) * 3,
  }));
}

function generateStarfish(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + (i * 27) % 75}%`,
    bottom: 8 + (i % 3) * 14,
    size: 22 + (i % 3) * 5,
    rotation: (i * 37) % 360,
    colorIndex: i % STARFISH_COLORS.length,
  }));
}

function generateCoral(count: number) {
  const spacing = count > 1 ? 82 / (count - 1) : 41;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${9 + i * spacing}%`,
    coralType: (['branch', 'fan', 'brain'] as const)[i % 3],
    height: 55 + (i % 3) * 18,
    colorIndex: i % CORAL_PALETTES.length,
    delay: i * 0.6,
    swayAmount: 2 + (i % 3),
  }));
}

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + (i % 3),
    left: `${(i * 13.7) % 100}%`,
    top: `${(i * 11.3) % 100}%`,
    delay: (i * 0.8) % 15,
    duration: 20 + (i % 10) * 4,
  }));
}

// ── Main Component ──

interface OceanBackgroundProps {
  variant: 'surface' | 'deep';
  positioning?: 'absolute' | 'fixed';
}

export function OceanBackground({ variant, positioning = 'absolute' }: OceanBackgroundProps) {
  const cfg = CONFIGS[variant];

  const schools = useMemo(() => generateSchools(cfg.schoolCount, cfg.schoolSize), [cfg.schoolCount, cfg.schoolSize]);
  const bgJellyfish = useMemo(() => generateJellyfish(cfg.bgJellyfish, 'bg'), [cfg.bgJellyfish]);
  const midFish = useMemo(() => generateFish(cfg.midFish, 'mid'), [cfg.midFish]);
  const tropical = useMemo(() => generateTropical(cfg.tropicalFish), [cfg.tropicalFish]);
  const seahorses = useMemo(() => generateSeahorses(cfg.seahorses), [cfg.seahorses]);
  const turtles = useMemo(() => generateTurtles(cfg.turtles), [cfg.turtles]);
  const fgFish = useMemo(() => generateFish(cfg.fgFish, 'fg'), [cfg.fgFish]);
  const fgJellyfish = useMemo(() => generateJellyfish(cfg.fgJellyfish, 'fg'), [cfg.fgJellyfish]);
  const bubbles = useMemo(() => generateBubbles(cfg.bubbles), [cfg.bubbles]);
  const kelp = useMemo(() => generateKelp(cfg.kelpCount), [cfg.kelpCount]);
  const coral = useMemo(() => generateCoral(cfg.coralCount), [cfg.coralCount]);
  const starfish = useMemo(() => generateStarfish(cfg.starfishCount), [cfg.starfishCount]);
  const particles = useMemo(() => generateParticles(cfg.particles), [cfg.particles]);

  const isDeep = variant === 'deep';

  return (
    <div className={`${positioning} inset-0 overflow-hidden pointer-events-none`}>

      {/* ── Gradient Background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDeep
            ? `linear-gradient(180deg,
                rgba(135,206,235,0.50) 0%,
                rgba(46,139,139,0.45) 25%,
                rgba(30,58,95,0.55) 60%,
                rgba(15,35,60,0.65) 100%)`
            : `linear-gradient(180deg,
                rgba(230,243,248,0.95) 0%,
                rgba(181,216,232,0.85) 30%,
                rgba(135,206,235,0.90) 70%,
                rgba(46,139,139,0.55) 100%)`,
        }}
      />

      {/* ── God Rays ── */}
      <div className="absolute inset-0 overflow-hidden">
        {GOD_RAY_PRESETS.slice(0, cfg.godRays).map((ray, i) => {
          const opLow = isDeep ? 0.20 + i * 0.02 : 0.10 + i * 0.02;
          const opHigh = isDeep ? 0.40 + i * 0.02 : 0.22 + i * 0.02;
          return (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-0"
              style={{
                left: ray.left,
                width: ray.w,
                height: ray.h,
                background: `linear-gradient(180deg, rgba(135,206,235,${isDeep ? 0.5 : 0.35}) 0%, rgba(135,206,235,0.1) 60%, transparent 100%)`,
                transform: `rotate(${ray.angle}deg)`,
                transformOrigin: 'top center',
                filter: `blur(${ray.blur}px)`,
              }}
              animate={{ opacity: [opLow, opHigh, opLow] }}
              transition={{ duration: ray.dur, delay: ray.peakDelay, repeat: Infinity, ease: 'easeInOut' }}
            />
          );
        })}
      </div>

      {/* ── Water Surface Shimmer ── */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${isDeep ? 0.18 : 0.25}) 0%, rgba(135,206,235,0.12) 50%, transparent 100%)`,
        }}
      />

      {/* ══════════════════════════════════════════
          BACKGROUND LAYER (z-0) — distant, slow
         ══════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, willChange: 'transform' }}>
        {/* Fish Schools (each school = 1 animated wrapper with static child fish) */}
        {schools.map((s) => (
          <motion.div
            key={`school-${s.id}`}
            className="absolute"
            style={{
              top: s.top,
              ...(s.direction === 'right' ? { left: '-8%' } : { right: '-8%' }),
              opacity: s.opacity,
            }}
            animate={{
              x: s.direction === 'right' ? ['0vw', '116vw'] : ['0vw', '-116vw'],
              y: [0, Math.sin(s.id * 2) * 15, 0],
            }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: s.fishCount }, (_, j) => {
              const color = SCHOOL_COLORS[s.colorIndex] ?? SCHOOL_COLORS[0];
              return (
                <svg
                  key={j}
                  viewBox="0 0 24 12"
                  style={{
                    width: 18 + (j % 3) * 2,
                    height: 9 + (j % 3),
                    position: 'absolute' as const,
                    left: j * 14 + (j % 2) * 6,
                    top: (j % 3) * 10 - 5,
                    transform: s.direction === 'right' ? 'scaleX(-1)' : 'none',
                  }}
                >
                  <path fill={color} d="M2 6 C4 2,10 2,14 6 C10 10,4 10,2 6 M14 6 L20 2 L20 10 Z" />
                  <circle cx="6" cy="5.5" r="0.8" fill="white" opacity="0.7" />
                </svg>
              );
            })}
          </motion.div>
        ))}

        {/* Distant Jellyfish */}
        {bgJellyfish.map((j) => {
          const c = JELLY_PALETTES[j.colorIndex] ?? JELLY_PALETTES[0];
          return (
            <motion.div
              key={`bg-jelly-${j.id}`}
              className="absolute"
              style={{ left: j.left, bottom: '-12%', opacity: j.opacity }}
              animate={{
                y: [0, -1100],
                x: [0, Math.sin(j.id * 3) * 40, 0, Math.sin(j.id * 2) * -30, 0],
              }}
              transition={{ duration: j.duration, delay: j.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 40 60" style={{ width: j.width, height: j.height }}>
                <ellipse cx="20" cy="14" rx="16" ry="12" fill={c.dome} opacity="0.6" />
                <ellipse cx="20" cy="12" rx="10" ry="7" fill={c.inner} opacity="0.3" />
                <path d="M8 22 Q4 35 10 52" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M14 24 Q10 40 15 55" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M20 25 Q20 42 20 57" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M26 24 Q30 40 25 55" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M32 22 Q36 35 30 52" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          OCEAN FLOOR (z-1) — coral, kelp, starfish
         ══════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '280px', zIndex: 1 }}>
        {/* Ocean floor gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-full"
          style={{
            background: isDeep
              ? 'linear-gradient(0deg, rgba(15,35,60,0.6) 0%, rgba(30,58,95,0.3) 40%, transparent 100%)'
              : 'linear-gradient(0deg, rgba(30,58,95,0.3) 0%, rgba(46,139,139,0.15) 40%, transparent 100%)',
          }}
        />

        {/* Coral Reef */}
        {coral.map((c) => {
          const palette = CORAL_PALETTES[c.colorIndex] ?? CORAL_PALETTES[0];
          return (
            <motion.div
              key={`coral-${c.id}`}
              className="absolute bottom-0"
              style={{ left: c.left }}
              animate={{ skewX: [-c.swayAmount, c.swayAmount, -c.swayAmount] }}
              transition={{ duration: 6 + c.delay, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              {c.coralType === 'branch' && (
                <svg viewBox="0 0 60 80" style={{ width: 40, height: c.height }}>
                  <path d="M30 80 L30 40" stroke={palette.main} strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M30 55 L15 35" stroke={palette.main} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M30 55 L45 38" stroke={palette.main} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M30 42 L18 25" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
                  <path d="M30 42 L42 28" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 35 L8 20" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M45 38 L52 24" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="18" r="3" fill={palette.main} opacity="0.6" />
                  <circle cx="52" cy="22" r="3" fill={palette.main} opacity="0.6" />
                  <circle cx="18" cy="23" r="2.5" fill={palette.accent} opacity="0.5" />
                  <circle cx="42" cy="26" r="2.5" fill={palette.accent} opacity="0.5" />
                </svg>
              )}
              {c.coralType === 'fan' && (
                <svg viewBox="0 0 60 70" style={{ width: 38, height: c.height }}>
                  <path d="M30 70 L30 48" stroke={palette.main} strokeWidth="3" strokeLinecap="round" />
                  <path
                    d="M30 48 C12 43,5 22,15 12 C20 7,30 5,30 5 C30 5,40 7,45 12 C55 22,48 43,30 48"
                    fill={palette.main} opacity="0.55"
                  />
                  <path d="M30 48 L22 18 M30 48 L30 8 M30 48 L38 18" stroke={palette.accent} strokeWidth="1" opacity="0.4" fill="none" />
                  <path
                    d="M30 48 C18 44,12 28,18 18 C22 12,30 10,30 10 C30 10,38 12,42 18 C48 28,42 44,30 48"
                    fill={palette.accent} opacity="0.25"
                  />
                </svg>
              )}
              {c.coralType === 'brain' && (
                <svg viewBox="0 0 50 40" style={{ width: 36, height: Math.round(c.height * 0.6) }}>
                  <ellipse cx="25" cy="25" rx="22" ry="14" fill={palette.main} opacity="0.6" />
                  <path d="M10 20 Q14 18,18 20 Q22 22,26 20 Q30 18,34 20 Q38 22,42 20" stroke={palette.accent} strokeWidth="1.2" fill="none" opacity="0.5" />
                  <path d="M8 25 Q12 23,16 25 Q20 27,24 25 Q28 23,32 25 Q36 27,40 25" stroke={palette.accent} strokeWidth="1.2" fill="none" opacity="0.5" />
                  <path d="M12 30 Q16 28,20 30 Q24 32,28 30 Q32 28,36 30" stroke={palette.accent} strokeWidth="1" fill="none" opacity="0.4" />
                </svg>
              )}
            </motion.div>
          );
        })}

        {/* Kelp Strands */}
        {kelp.map((strand) => (
          <motion.div
            key={`kelp-${strand.id}`}
            className="absolute bottom-0"
            style={{ left: strand.left }}
            animate={{ skewX: [-strand.swayAmount, strand.swayAmount, -strand.swayAmount] }}
            transition={{ duration: 4 + strand.delay, delay: strand.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 100" style={{ width: 18, height: strand.height }}>
              <path
                d="M12 100 Q6 82,12 64 Q18 46,12 28 Q9 18,12 8 Q14 2,12 0"
                stroke="#2E8B57" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round"
              />
              <ellipse cx="7" cy="25" rx="6" ry="9" fill="#2E8B57" opacity="0.45" transform="rotate(-18 7 25)" />
              <ellipse cx="17" cy="45" rx="6" ry="9" fill="#3CB371" opacity="0.40" transform="rotate(18 17 45)" />
              <ellipse cx="8" cy="65" rx="5" ry="7" fill="#2E8B57" opacity="0.38" transform="rotate(-15 8 65)" />
              <ellipse cx="16" cy="82" rx="4" ry="6" fill="#3CB371" opacity="0.35" transform="rotate(12 16 82)" />
            </svg>
          </motion.div>
        ))}

        {/* Starfish */}
        {starfish.map((sf) => (
          <motion.div
            key={`star-${sf.id}`}
            className="absolute"
            style={{ left: sf.left, bottom: sf.bottom }}
            animate={{ rotate: [sf.rotation, sf.rotation + 15, sf.rotation] }}
            transition={{ duration: 30, delay: sf.id * 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 30 30" style={{ width: sf.size, height: sf.size }}>
              <path
                d="M15 2 L17.5 11 L27 11 L19.5 16.5 L22 26 L15 20.5 L8 26 L10.5 16.5 L3 11 L12.5 11 Z"
                fill={STARFISH_COLORS[sf.colorIndex] ?? STARFISH_COLORS[0]}
                opacity="0.55"
              />
              <circle cx="15" cy="14" r="3" fill={STARFISH_COLORS[sf.colorIndex] ?? STARFISH_COLORS[0]} opacity="0.3" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          MIDGROUND LAYER (z-2) — main creatures
         ══════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2, willChange: 'transform' }}>
        {/* Individual Fish (regular, clown, yellow variants) */}
        {midFish.map((f) => {
          const palette = FISH_PALETTES[f.paletteIndex] ?? FISH_PALETTES[0];
          return (
            <motion.div
              key={`mid-fish-${f.id}`}
              className="absolute"
              style={{
                top: f.top,
                ...(f.direction === 'right' ? { left: '-8%' } : { right: '-8%' }),
                opacity: f.opacity,
              }}
              animate={{
                x: f.direction === 'right' ? ['0vw', '116vw'] : ['0vw', '-116vw'],
                y: [0, Math.sin(f.id) * 25, 0, Math.sin(f.id + 1) * -20, 0],
              }}
              transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' }}
            >
              {f.fishType === 'clown' ? (
                <svg
                  viewBox="0 0 48 24"
                  style={{ width: f.size, height: f.size / 2, transform: f.direction === 'right' ? 'scaleX(-1)' : 'none' }}
                >
                  <path fill={CLOWN_PALETTE.body} d="M6 12 C10 5,24 4,30 12 C24 20,10 19,6 12" />
                  <path d="M14 5 Q14.5 12,14 19" stroke={CLOWN_PALETTE.stripe} strokeWidth="2.5" fill="none" opacity="0.85" />
                  <path d="M22 4.5 Q22.5 12,22 19.5" stroke={CLOWN_PALETTE.stripe} strokeWidth="2" fill="none" opacity="0.75" />
                  <path fill={CLOWN_PALETTE.fin} d="M30 12 L42 5 L40 12 L42 19 Z" opacity="0.85" />
                  <path fill={CLOWN_PALETTE.fin} d="M16 5 Q20 2,24 5 L20 9 Z" opacity="0.6" />
                  <circle cx="11" cy="11" r="2" fill="white" opacity="0.9" />
                  <circle cx="11.5" cy="11" r="0.9" fill={CLOWN_PALETTE.eye} />
                </svg>
              ) : f.fishType === 'yellow' ? (
                <svg
                  viewBox="0 0 48 24"
                  style={{ width: f.size, height: f.size / 2, transform: f.direction === 'right' ? 'scaleX(-1)' : 'none' }}
                >
                  <path fill={YELLOW_PALETTE.body} d="M6 12 C10 4,24 3,30 12 C24 21,10 20,6 12" />
                  <path fill={YELLOW_PALETTE.accent} d="M30 12 L42 4 L40 12 L42 20 Z" opacity="0.85" />
                  <path fill={YELLOW_PALETTE.body} d="M16 3 Q21 0,26 3 L21 8 Z" opacity="0.7" />
                  <path fill={YELLOW_PALETTE.accent} d="M16 21 Q21 24,26 21 L21 16 Z" opacity="0.5" />
                  <circle cx="12" cy="11" r="2" fill="white" opacity="0.85" />
                  <circle cx="12.5" cy="11" r="0.9" fill={YELLOW_PALETTE.eye} />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 48 24"
                  style={{ width: f.size, height: f.size / 2, transform: f.direction === 'right' ? 'scaleX(-1)' : 'none' }}
                >
                  <path fill={palette.body} d="M6 12 C10 4,24 3,30 12 C24 21,10 20,6 12" />
                  <path fill={palette.body} d="M30 12 L42 4 L40 12 L42 20 Z" opacity="0.85" />
                  <path fill={palette.accent} d="M16 4 Q21 1,26 4 L21 9 Z" opacity="0.7" />
                  <path fill={palette.accent} d="M14 14 Q16 18,20 16 L17 13 Z" opacity="0.5" />
                  <path d="M19 5 Q19.5 12,19 19" stroke={palette.accent} strokeWidth="1" fill="none" opacity="0.3" />
                  <circle cx="12" cy="11" r="2" fill="white" opacity="0.8" />
                  <circle cx="12.5" cy="11" r="0.9" fill={palette.eye} />
                </svg>
              )}
            </motion.div>
          );
        })}

        {/* Tropical / Angel Fish */}
        {tropical.map((t) => {
          const c = TROPICAL_PALETTES[t.colorIndex] ?? TROPICAL_PALETTES[0];
          return (
            <motion.div
              key={`tropical-${t.id}`}
              className="absolute"
              style={{
                top: t.top,
                ...(t.direction === 'right' ? { left: '-10%' } : { right: '-10%' }),
                opacity: t.opacity,
              }}
              animate={{
                x: t.direction === 'right' ? ['0vw', '120vw'] : ['0vw', '-120vw'],
                y: [0, -20, 0, 20, 0],
              }}
              transition={{ duration: t.duration, delay: t.delay, repeat: Infinity, ease: 'linear' }}
            >
              <svg
                viewBox="0 0 56 36"
                style={{ width: t.width, height: t.height, transform: t.direction === 'right' ? 'scaleX(-1)' : 'none' }}
              >
                <path fill={c.body} d="M8 18 C14 7,32 6,40 18 C32 30,14 29,8 18" />
                <path fill={c.body} d="M40 18 L52 8 L50 18 L52 28 Z" opacity="0.85" />
                <path fill={c.band} d="M20 7 Q21 18,20 29" stroke={c.band} strokeWidth="3" opacity="0.7" />
                <path fill={c.band} d="M28 6.5 Q29 18,28 29.5" stroke={c.band} strokeWidth="2.5" opacity="0.55" />
                <path fill={c.fin} d="M18 7 Q24 2,32 7 L25 13 Z" opacity="0.65" />
                <path fill={c.fin} d="M20 29 Q26 34,32 29 L26 23 Z" opacity="0.55" />
                <path fill={c.fin} d="M16 16 Q13 22,18 20" opacity="0.4" />
                <circle cx="14" cy="17" r="2.5" fill="white" opacity="0.7" />
                <circle cx="14.5" cy="17" r="1.2" fill={c.fin} opacity="0.8" />
              </svg>
            </motion.div>
          );
        })}

        {/* Seahorses */}
        {seahorses.map((sh) => (
          <motion.div
            key={`seahorse-${sh.id}`}
            className="absolute"
            style={{ left: sh.left, bottom: '-10%', opacity: sh.opacity }}
            animate={{
              y: [0, -800],
              x: [0, Math.sin(sh.id * 4) * 60, 0, Math.sin(sh.id * 3) * -45, 0],
            }}
            transition={{ duration: sh.duration, delay: sh.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 34 60" style={{ width: sh.size * 0.57, height: sh.size }}>
              {/* Filled body silhouette — S-curved with snout and curled tail */}
              <path
                d="M17 4 C22 4,24 8,23 13 C22 18,26 22,25 27 C24 32,20 36,20 40 C20 44,22 48,19 51 C17 53,13 53,11 50 C10 48,12 45,14 46 C14 43,13 39,14 35 C15 31,16 27,16 23 C16 19,14 15,14 11 C14 8,12 7,10 7 L5 6 C4 5,4 4,5 3.5 L12 4 C14 3,16 3,17 4 Z"
                fill={SEAHORSE_PALETTE.body}
              />
              {/* Belly highlight */}
              <path
                d="M16 14 C16 18,15 23,15 27 C15 31,14 35,15 39"
                stroke={SEAHORSE_PALETTE.belly} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"
              />
              {/* Crown spines */}
              <path d="M17 4 L16 1 M19 4.5 L20 1.5 M15 4.5 L13.5 1.5" stroke={SEAHORSE_PALETTE.crown} strokeWidth="1" strokeLinecap="round" />
              {/* Eye */}
              <circle cx="16" cy="8" r="2" fill="white" opacity="0.85" />
              <circle cx="16.4" cy="8" r="0.9" fill="#1a1a1a" />
              {/* Dorsal fin */}
              <path d="M24 19 C27 17,28 21,25 23" fill={SEAHORSE_PALETTE.body} opacity="0.5" />
              {/* Body ridges (segmented texture) */}
              <path d="M17 16 L23 15 M17 20 L25 19 M17 24 L24 24 M18 28 L22 28 M18 32 L21 32 M19 36 L22 36" stroke={SEAHORSE_PALETTE.crown} strokeWidth="0.5" opacity="0.2" fill="none" />
            </svg>
          </motion.div>
        ))}

        {/* Sea Turtles */}
        {turtles.map((t) => (
          <motion.div
            key={`turtle-${t.id}`}
            className="absolute"
            style={{
              top: t.top,
              ...(t.direction === 'right' ? { left: '-12%' } : { right: '-12%' }),
              opacity: t.opacity,
            }}
            animate={{
              x: t.direction === 'right' ? ['0vw', '124vw'] : ['0vw', '-124vw'],
              y: [0, -25, 0, 25, 0],
            }}
            transition={{ duration: t.duration, delay: t.delay, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              viewBox="0 0 80 50"
              style={{ width: t.size, height: t.size * 0.625, transform: t.direction === 'left' ? 'scaleX(-1)' : 'none' }}
            >
              <ellipse cx="36" cy="26" rx="24" ry="17" fill={TURTLE_PALETTE.shell} />
              <ellipse cx="36" cy="26" rx="16" ry="11" fill={TURTLE_PALETTE.shellInner} opacity="0.6" />
              <path d="M28 18 L36 15 L44 18 L44 26 L36 30 L28 26 Z" stroke={TURTLE_PALETTE.shell} strokeWidth="1" fill="none" opacity="0.4" />
              <ellipse cx="64" cy="24" rx="8" ry="5.5" fill={TURTLE_PALETTE.skin} />
              <circle cx="68" cy="23" r="1.2" fill="#1a1a1a" opacity="0.5" />
              <ellipse cx="20" cy="13" rx="11" ry="4.5" fill={TURTLE_PALETTE.skin} transform="rotate(-35 20 13)" />
              <ellipse cx="20" cy="39" rx="11" ry="4.5" fill={TURTLE_PALETTE.skin} transform="rotate(35 20 39)" />
              <ellipse cx="52" cy="15" rx="9" ry="3.5" fill={TURTLE_PALETTE.skin} transform="rotate(25 52 15)" />
              <ellipse cx="52" cy="37" rx="9" ry="3.5" fill={TURTLE_PALETTE.skin} transform="rotate(-25 52 37)" />
              <path d="M12 26 L5 26" stroke={TURTLE_PALETTE.skin} strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        ))}

        {/* Shark (deep variant only) */}
        {cfg.hasShark && (
          <motion.div
            className="absolute"
            style={{ top: '42%', left: '-15%', opacity: 0.42 }}
            animate={{
              x: ['0vw', '130vw'],
              y: [0, -20, 0, 20, 0],
            }}
            transition={{ duration: 45, delay: 15, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 150 60" style={{ width: 160, height: 65 }}>
              {/* Body — streamlined torpedo silhouette, head on right */}
              <path
                d="M138 28 C135 22,125 15,108 12 C88 9,65 11,45 16 C30 20,18 25,12 28 C18 31,30 37,45 41 C65 45,88 47,108 44 C125 41,135 34,138 28 Z"
                fill={SHARK_PALETTE.body}
              />
              {/* Counter-shading — lighter belly on lower half */}
              <path
                d="M136 30 C130 36,118 40,100 43 C80 46,55 44,35 40 C22 37,15 32,12 28 Z"
                fill={SHARK_PALETTE.belly}
              />
              {/* Dorsal fin — tall, triangular, slight backward lean */}
              <path
                d="M80 10 C78 4,74 0,72 0 C70 0,67 5,65 11"
                fill={SHARK_PALETTE.fin}
              />
              {/* Second dorsal fin — small, near tail */}
              <path
                d="M38 17 C37 13,35 11,34 11 C33 11,32 14,31 17"
                fill={SHARK_PALETTE.fin}
              />
              {/* Pectoral fin — angled back below head */}
              <path
                d="M100 35 C98 41,93 47,90 48 C89 46,90 40,94 35"
                fill={SHARK_PALETTE.fin}
              />
              {/* Anal fin — small, below body near tail */}
              <path d="M40 41 L38 46 L35 41" fill={SHARK_PALETTE.fin} />
              {/* Tail fin — animated crescent wag via d-path morphing */}
              <motion.path
                fill={SHARK_PALETTE.body}
                animate={{
                  d: [
                    "M12 28 C10 18,5 10,1 4 C4 10,9 20,12 26 L12 30 C9 32,5 38,1 44 C5 38,10 33,12 30 Z",
                    "M12 28 C10 21,5 14,1 8 C4 14,9 22,12 26 L12 30 C9 34,5 42,1 48 C5 42,10 35,12 30 Z",
                    "M12 28 C10 24,5 18,1 12 C4 18,9 24,12 26 L12 30 C9 36,5 46,1 52 C5 46,10 37,12 30 Z",
                    "M12 28 C10 21,5 14,1 8 C4 14,9 22,12 26 L12 30 C9 34,5 42,1 48 C5 42,10 35,12 30 Z",
                    "M12 28 C10 18,5 10,1 4 C4 10,9 20,12 26 L12 30 C9 32,5 38,1 44 C5 38,10 33,12 30 Z",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Eye */}
              <circle cx="128" cy="24" r="1.5" fill="white" opacity="0.45" />
              {/* Gill slits */}
              <path d="M112 29 L111 34 M109 29 L108 34 M106 29 L105 34" stroke="white" strokeWidth="0.7" opacity="0.2" fill="none" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          FOREGROUND LAYER (z-3) — close, fast
         ══════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3, willChange: 'transform' }}>
        {/* Close-up Fish */}
        {fgFish.map((f) => {
          const palette = FISH_PALETTES[f.paletteIndex] ?? FISH_PALETTES[0];
          return (
            <motion.div
              key={`fg-fish-${f.id}`}
              className="absolute"
              style={{
                top: f.top,
                ...(f.direction === 'right' ? { left: '-10%' } : { right: '-10%' }),
                opacity: f.opacity,
              }}
              animate={{
                x: f.direction === 'right' ? ['0vw', '120vw'] : ['0vw', '-120vw'],
                y: [0, Math.sin(f.id * 1.5) * 30, 0, Math.sin(f.id * 2) * -25, 0],
              }}
              transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' }}
            >
              {f.fishType === 'clown' ? (
                <svg
                  viewBox="0 0 48 24"
                  style={{ width: f.size, height: f.size / 2, transform: f.direction === 'right' ? 'scaleX(-1)' : 'none' }}
                >
                  <path fill={CLOWN_PALETTE.body} d="M6 12 C10 5,24 4,30 12 C24 20,10 19,6 12" />
                  <path d="M14 5 Q14.5 12,14 19" stroke={CLOWN_PALETTE.stripe} strokeWidth="2.5" fill="none" opacity="0.85" />
                  <path d="M22 4.5 Q22.5 12,22 19.5" stroke={CLOWN_PALETTE.stripe} strokeWidth="2" fill="none" opacity="0.75" />
                  <path fill={CLOWN_PALETTE.fin} d="M30 12 L42 5 L40 12 L42 19 Z" opacity="0.85" />
                  <circle cx="11" cy="11" r="2" fill="white" opacity="0.9" />
                  <circle cx="11.5" cy="11" r="0.9" fill={CLOWN_PALETTE.eye} />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 48 24"
                  style={{ width: f.size, height: f.size / 2, transform: f.direction === 'right' ? 'scaleX(-1)' : 'none' }}
                >
                  <path fill={palette.body} d="M6 12 C10 4,24 3,30 12 C24 21,10 20,6 12" />
                  <path fill={palette.body} d="M30 12 L42 4 L40 12 L42 20 Z" opacity="0.85" />
                  <path fill={palette.accent} d="M16 4 Q21 1,26 4 L21 9 Z" opacity="0.7" />
                  <path fill={palette.accent} d="M14 14 Q16 18,20 16 L17 13 Z" opacity="0.5" />
                  <circle cx="12" cy="11" r="2" fill="white" opacity="0.8" />
                  <circle cx="12.5" cy="11" r="0.9" fill={palette.eye} />
                </svg>
              )}
            </motion.div>
          );
        })}

        {/* Foreground Jellyfish */}
        {fgJellyfish.map((j) => {
          const c = JELLY_PALETTES[j.colorIndex] ?? JELLY_PALETTES[0];
          return (
            <motion.div
              key={`fg-jelly-${j.id}`}
              className="absolute"
              style={{ left: j.left, bottom: '-14%', opacity: j.opacity }}
              animate={{
                y: [0, -1200],
                x: [0, Math.sin(j.id * 3) * 55, 0, Math.sin(j.id * 2) * -40, 0],
              }}
              transition={{ duration: j.duration, delay: j.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 40 60" style={{ width: j.width, height: j.height }}>
                <ellipse cx="20" cy="14" rx="16" ry="12" fill={c.dome} opacity="0.7" />
                <ellipse cx="20" cy="12" rx="10" ry="7" fill={c.inner} opacity="0.4" />
                <ellipse cx="16" cy="14" rx="3" ry="5" fill="white" opacity="0.15" />
                <path d="M7 22 Q3 36,10 54" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
                <path d="M12 24 Q8 40,14 56" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
                <path d="M17 25 Q15 42,18 57" stroke={c.tentacle} strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
                <path d="M23 25 Q25 42,22 57" stroke={c.tentacle} strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
                <path d="M28 24 Q32 40,26 56" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
                <path d="M33 22 Q37 36,30 54" stroke={c.tentacle} strokeWidth="1.5" fill="none" opacity="0.55" strokeLinecap="round" />
              </svg>
            </motion.div>
          );
        })}

        {/* Bubbles */}
        {bubbles.map((b) => (
          <motion.div
            key={`bubble-${b.id}`}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              bottom: -20,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.35))',
              boxShadow: 'inset -1px -1px 3px rgba(255,255,255,0.5), 0 0 6px rgba(135,206,235,0.25)',
            }}
            animate={{
              y: [0, -1200],
              x: [0, Math.sin(b.id) * 35, 0],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* ── Floating Particles (all depths) ── */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 4 }}>
        {particles.map((p) => (
          <motion.div
            key={`particle-${p.id}`}
            className="absolute rounded-full bg-white/35"
            style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
            animate={{
              y: [0, -50, 0, 30, 0],
              x: [0, 20, 0, -15, 0],
              opacity: [0.25, 0.45, 0.35, 0.45, 0.25],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Water Caustics Overlay ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          zIndex: 5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
        }}
        animate={{ opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
