import { BrandRadiusEnum } from '../enums/jurisdictions/brand-radius-enum';
import { BrandRamp, HEX_COLOR } from './brand-ramp';

const ROOT = ':root';
const BUTTON = ':root > .seeds-button';

const SHADE_SUFFIX = {
  dark: '-dark',
  darker: '-darker',
  light: '-light',
  lighter: '-lighter',
} as const;

const FONT_SLOTS = {
  fontFamily: 'sans',
  headingFontFamily: 'alt-sans',
  serifFontFamily: 'serif',
} as const;

export type RampShade = keyof typeof SHADE_SUFFIX;
export type FontSlot = keyof typeof FONT_SLOTS;

export type ParsedBrand = {
  primary?: BrandRamp;
  secondary?: BrandRamp;
  buttonRadius?: BrandRadiusEnum;
  fontFamily?: string;
  headingFontFamily?: string;
  serifFontFamily?: string;
};

export const declarationsByPath = (
  scss: string,
): Map<string, Map<string, string>> => {
  const byPath = new Map<string, Map<string, string>>();
  // Strips /* ... */ and // ... so commented out declarations are skipped
  const source = scss
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  const path: string[] = [];
  let buffer = '';

  const record = (declaration: string) => {
    const separator = declaration.indexOf(':');
    if (separator <= 0 || !path.length) return;

    const key = path.join(' > ');
    if (!byPath.has(key)) byPath.set(key, new Map());
    byPath
      .get(key)
      .set(
        declaration.slice(0, separator).trim(),
        declaration.slice(separator + 1).trim(),
      );
  };

  for (const character of source) {
    if (character === '{') {
      path.push(buffer.trim().replace(/\s+/g, ' '));
      buffer = '';
    } else if (character === '}') {
      path.pop();
      buffer = '';
    } else if (character === ';') {
      record(buffer);
      buffer = '';
    } else {
      buffer += character;
    }
  }

  return byPath;
};

const rampFrom = (
  root: Map<string, string>,
  name: 'primary' | 'secondary',
): BrandRamp | undefined => {
  const hex = (suffix: string) => {
    const value = root.get(`--seeds-color-${name}${suffix}`)?.trim();
    return value && HEX_COLOR.test(value) ? value.toUpperCase() : undefined;
  };

  const base = hex('');
  if (!base) return undefined;

  const ramp: BrandRamp = { base };
  (Object.keys(SHADE_SUFFIX) as RampShade[]).forEach((shade) => {
    const value = hex(SHADE_SUFFIX[shade]);
    if (value) ramp[shade] = value;
  });

  return ramp;
};

const radiusFrom = (
  button: Map<string, string> | undefined,
): BrandRadiusEnum | undefined => {
  const value =
    button?.get('--button-border-radius-md') ??
    button?.get('--button-border-radius-sm') ??
    button?.get('--button-border-radius-lg');
  if (!value) return undefined;

  const match = /^var\(\s*--seeds-rounded(?:-([a-z0-9]+))?\s*\)$/.exec(
    value.trim(),
  );
  if (!match) return undefined;

  const step = match[1] ?? BrandRadiusEnum.base;
  return Object.values(BrandRadiusEnum).includes(step as BrandRadiusEnum)
    ? (step as BrandRadiusEnum)
    : undefined;
};

const GENERIC_FAMILIES = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'inherit',
  'initial',
  'unset',
]);

const familyFrom = (
  root: Map<string, string>,
  slot: FontSlot,
): string | undefined => {
  const value = root.get(`--seeds-font-${FONT_SLOTS[slot]}`);
  if (!value) return undefined;

  const first = value
    .split(',')[0]
    .trim()
    .replace(/^["']|["']$/g, '');
  return first && !GENERIC_FAMILIES.has(first.toLowerCase())
    ? first
    : undefined;
};

export const parseBrandSources = (scss: string): ParsedBrand => {
  const byPath = declarationsByPath(scss);
  const root = byPath.get(ROOT) ?? new Map<string, string>();

  const parsed: ParsedBrand = {};

  const primary = rampFrom(root, 'primary');
  if (primary) parsed.primary = primary;
  const secondary = rampFrom(root, 'secondary');
  if (secondary) parsed.secondary = secondary;

  const radius = radiusFrom(byPath.get(BUTTON));
  if (radius) parsed.buttonRadius = radius;

  (Object.keys(FONT_SLOTS) as FontSlot[]).forEach((slot) => {
    const family = familyFrom(root, slot);
    if (family) parsed[slot] = family;
  });

  return parsed;
};
