import { BrandRadiusEnum } from '../enums/jurisdictions/brand-radius-enum';
import { BrandRamp, HEX_COLOR } from './brand-ramp';
import { FONT_FAMILY } from '../dtos/jurisdictions/brand.dto';

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

const normalize = (selector: string): string =>
  selector
    .replace(/\s*([>+~])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim();

export const declarationsByPath = (
  scss: string,
): Map<string, Map<string, string>> => {
  const byPath = new Map<string, Map<string, string>>();
  const path: string[] = [];
  let buffer = '';

  const record = () => {
    const declaration = buffer;
    buffer = '';

    const separator = declaration.indexOf(':');
    if (separator <= 0 || !path.length) return;

    const key = path.map(normalize).join(' > ');
    if (!byPath.has(key)) byPath.set(key, new Map());
    byPath
      .get(key)
      .set(
        declaration.slice(0, separator).trim(),
        declaration.slice(separator + 1).trim(),
      );
  };

  let index = 0;
  while (index < scss.length) {
    const character = scss[index];
    const next = scss[index + 1];

    if (character === '/' && next === '*') {
      const close = scss.indexOf('*/', index + 2);
      index = close === -1 ? scss.length : close + 2;
      continue;
    }

    if (character === '/' && next === '/' && !buffer.trim()) {
      const newline = scss.indexOf('\n', index);
      index = newline === -1 ? scss.length : newline + 1;
      continue;
    }

    if (character === '"' || character === "'") {
      const close = scss.indexOf(character, index + 1);
      const literal =
        close === -1 ? scss.slice(index) : scss.slice(index, close + 1);
      buffer += literal;
      index += literal.length;
      continue;
    }

    if (character === '{') {
      path.push(buffer.trim());
      buffer = '';
      const key = path.map(normalize).join(' > ');
      if (!byPath.has(key)) byPath.set(key, new Map());
    } else if (character === '}') {
      record();
      path.pop();
      buffer = '';
    } else if (character === ';') {
      record();
    } else {
      buffer += character;
    }

    index += 1;
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

  return first &&
    !GENERIC_FAMILIES.has(first.toLowerCase()) &&
    FONT_FAMILY.test(first)
    ? first
    : undefined;
};

export class UnreadableStylesheetError extends Error {}

export const parseBrandSources = (scss: string): ParsedBrand => {
  const byPath = declarationsByPath(scss);
  if (!byPath.has(ROOT)) {
    throw new UnreadableStylesheetError(
      'no :root block was found, so this is not a stylesheet the migration can read',
    );
  }

  const root = byPath.get(ROOT);

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

export type BrandChange = {
  field: string;
  from?: string;
  to: string;
};

const describe = (value: unknown): string =>
  value && typeof value === 'object'
    ? Object.entries(value as Record<string, string>)
        .map(([key, entry]) => `${key} ${entry}`)
        .join(' ')
    : String(value);

const stable = (value: unknown): string =>
  JSON.stringify(value, (_key, entry: unknown) =>
    entry && typeof entry === 'object' && !Array.isArray(entry)
      ? Object.fromEntries(
          Object.entries(entry as Record<string, unknown>).sort(([a], [b]) =>
            a.localeCompare(b),
          ),
        )
      : entry,
  );

export const diffBrand = (
  stored: Record<string, unknown> | null | undefined,
  desired: Record<string, unknown>,
): BrandChange[] =>
  Object.entries(desired)
    .filter(([field, value]) => stable(stored?.[field]) !== stable(value))
    .map(([field, value]) => ({
      field,
      from: stored?.[field] === undefined ? undefined : describe(stored[field]),
      to: describe(value),
    }));

export const formatBrandReport = ({
  jurisdictionName,
  repositoryUrl,
  gitRef,
  commit,
  parsed,
  changes,
  assets,
  notes,
}: {
  jurisdictionName: string;
  repositoryUrl: string;
  gitRef: string;
  commit: boolean;
  parsed: ParsedBrand;
  changes: BrandChange[];
  assets: string[];
  notes: string[];
}): string => {
  const lines = [
    commit ? 'Writing changes.' : 'Dry run. Re-run with commit: true to write.',
    `Source: ${repositoryUrl} at ${gitRef}`,
    `Jurisdiction: ${jurisdictionName}`,
    '',
    `Parsed from the stylesheet: ${
      Object.keys(parsed).length
        ? Object.keys(parsed).sort().join(', ')
        : 'nothing'
    }`,
    '',
  ];

  notes.forEach((note) => lines.push(note));
  if (notes.length) lines.push('');

  lines.push(
    changes.length
      ? `${changes.length} field(s) to write:`
      : 'Nothing to write.',
  );
  changes.forEach(({ field, from, to }) =>
    lines.push(`  ${field}: ${from === undefined ? to : `${from} -> ${to}`}`),
  );

  assets.forEach((asset) => lines.push(`  ${asset}`));

  return lines.join('\n');
};
