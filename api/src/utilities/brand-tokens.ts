/*
  The curated set of component tokens a jurisdiction may override, with the grammar each value
  must match. Values are interpolated into a style block, so the grammar is what keeps a stored
  token from carrying arbitrary css: anything outside it is refused on write and dropped at
  render.

  --button-border-radius-sm   a length (0, px, rem, em, %) or a var(--seeds-*) reference
  --button-border-radius-md   same
  --button-border-radius-lg   same
  --seeds-font-serif          a family name, emitted with the serif fallback stack
*/

const LENGTH_OR_SEEDS_VAR =
  /^(0|[0-9]+(\.[0-9]+)?(px|rem|em|%)|var\(--seeds-[a-z0-9-]+\))$/;

// Matches the family rule the public site applies to the sans and heading fonts.
const FONT_FAMILY = /^[A-Za-z0-9](?:[A-Za-z0-9 -]{0,62}[A-Za-z0-9])?$/;

export const TOKEN_GRAMMARS: Record<string, RegExp> = {
  '--button-border-radius-sm': LENGTH_OR_SEEDS_VAR,
  '--button-border-radius-md': LENGTH_OR_SEEDS_VAR,
  '--button-border-radius-lg': LENGTH_OR_SEEDS_VAR,
  '--seeds-font-serif': FONT_FAMILY,
};

export const unusableTokens = (
  tokens?: Record<string, string> | null,
): string[] =>
  Object.entries(tokens ?? {})
    .filter(([name, value]) => {
      const grammar = TOKEN_GRAMMARS[name];
      return !grammar || typeof value !== 'string' || !grammar.test(value);
    })
    .map(([name]) => name);
