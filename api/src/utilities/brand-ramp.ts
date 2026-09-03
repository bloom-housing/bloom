// Derives the missing shade-ramp values from a ramp's base color. The proportional lightness
// deltas match the spacing of the existing ui-seeds jurisdiction ramps.

type Hsl = { h: number; s: number; l: number };

export type BrandRamp = {
  base: string;
  dark?: string;
  darker?: string;
  light?: string;
  lighter?: string;
};

export const hexToHsl = (hex: string): Hsl => {
  const value = hex.replace('#', '');
  const expanded =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  const r = parseInt(expanded.slice(0, 2), 16) / 255;
  const g = parseInt(expanded.slice(2, 4), 16) / 255;
  const b = parseInt(expanded.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToHex = ({ h, s, l }: Hsl): string => {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) =>
    lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const channel = (n: number) =>
    Math.round(f(n) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
};

const shifted = (base: Hsl, l: number): string =>
  hslToHex({ ...base, l: Math.min(100, Math.max(0, l)) });

export const completeRamp = (ramp: BrandRamp): Required<BrandRamp> => {
  const base = hexToHsl(ramp.base);
  const { l } = base;

  return {
    base: ramp.base.toUpperCase(),
    darker: ramp.darker?.toUpperCase() ?? shifted(base, l * 0.64),
    dark: ramp.dark?.toUpperCase() ?? shifted(base, l * 0.88),
    light: ramp.light?.toUpperCase() ?? shifted(base, l + (100 - l) * 0.88),
    lighter: ramp.lighter?.toUpperCase() ?? shifted(base, l + (100 - l) * 0.95),
  };
};
