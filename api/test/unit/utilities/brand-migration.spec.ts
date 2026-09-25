import { BrandRadiusEnum } from '../../../src/enums/jurisdictions/brand-radius-enum';
import {
  declarationsByPath,
  parseBrandSources,
  UnreadableStylesheetError,
} from '../../../src/utilities/brand-migration';

/*
  The fixtures reproduce the shapes the three forks actually use. Every fork carries a .lakeview
  block copied from core, so each one is included: it is a case the parser has to skip.
*/
const LAKEVIEW = `
  // Used in core for theming testing purposes only
  .lakeview {
    --seeds-color-primary-darker: #4e2169;
    --seeds-color-primary-dark: #6e2598;
    --seeds-color-primary: #773e98;
    --seeds-color-primary-light: #f2daff;
    --seeds-color-primary-lighter: #f9f4fa;
    .seeds-button {
      --button-border-radius-sm: var(--seeds-rounded-3xl);
      --button-border-radius-md: var(--seeds-rounded-3xl);
    }
  }
`;

// Colours, fonts and a radius of its own, alongside the inherited lakeview block.
const DETROIT = `@import "../public/static/fonts/Montserrat.css";

:root {
  // Seeds token overrides
  --seeds-font-alt-sans: "Montserrat", "Open Sans", "Helvetica", "Arial", "sans-serif";
  --seeds-font-sans: "Montserrat", "Open Sans", "Helvetica", "Arial", "sans-serif";
  --seeds-font-serif: "Montserrat", "Droid Serif", "Georgia", "Times", "serif";
  --seeds-color-primary-darker: #133a35;
  --seeds-color-primary-dark: #1f6058;
  --seeds-color-primary: #297e73;
  --seeds-color-primary-light: #c5ece7;
  --seeds-color-primary-lighter: #ecf9f7;
  --seeds-bg-color-surface-primary: var(--seeds-color-primary-lighter);

  .seeds-button {
    --button-border-radius-sm: var(--seeds-rounded-3xl);
    --button-border-radius-md: var(--seeds-rounded-3xl);
  }
${LAKEVIEW}
}
`;

// Colours and fonts, but its only radius is the inherited one.
const LA = `:root {
  --seeds-font-sans: "Open Sans", "Helvetica", "Arial", "sans-serif";
  --seeds-color-primary-darker: #173b64;
  --seeds-color-primary-dark: #215792;
  --seeds-color-primary: #2a70bc;
  --seeds-color-primary-light: #c0d8f1;
  --seeds-color-primary-lighter: #eaf2fa;
${LAKEVIEW}
}
`;

// Nothing of its own: its seeds-button block sets something unrelated.
const HBA = `:root {
  .seeds-button {
    -webkit-font-smoothing: antialiased;
  }
${LAKEVIEW}
}
`;

describe('declarationsByPath', () => {
  it('keys declarations by the selector they sit under', () => {
    const byPath = declarationsByPath(DETROIT);

    expect(byPath.get(':root').get('--seeds-color-primary')).toEqual('#297e73');
    expect(
      byPath.get(':root > .seeds-button').get('--button-border-radius-md'),
    ).toEqual('var(--seeds-rounded-3xl)');
    expect(
      byPath.get(':root > .lakeview').get('--seeds-color-primary'),
    ).toEqual('#773e98');
  });

  it('ignores declarations inside comments', () => {
    const byPath = declarationsByPath(`:root {
      // --seeds-color-primary: #000000;
      /* --seeds-color-secondary: #111111; */
      --seeds-color-primary: #297e73;
    }`);

    expect(byPath.get(':root').size).toEqual(1);
  });

  it('returns nothing for a stylesheet with no rules', () => {
    expect(declarationsByPath('// just a comment\n').size).toEqual(0);
  });
});

describe('a stylesheet the scanner cannot read', () => {
  // Distinguishable from a fork that genuinely declares no branding, which is a real case.
  it.each(['', '// only a comment', '.some-class { color: red; }'])(
    'raises rather than reporting nothing for %s',
    (scss) => {
      expect(() => parseBrandSources(scss)).toThrow(UnreadableStylesheetError);
    },
  );

  it('accepts a :root block whose declarations are all nested', () => {
    expect(
      parseBrandSources(':root { .seeds-button { color: red; } }'),
    ).toEqual({});
  });
});

describe('values the scanner reads that a strip-first parser would miss', () => {
  const parseRoot = (body: string) => parseBrandSources(`:root {${body}}`);

  // The // in a url is not a line comment, and stripping it would swallow the rest of the line.
  it('keeps a declaration that follows a url', () => {
    const parsed = parseRoot(`
      --seeds-color-primary: #297e73;
      background: url(https://example.test/hero.png);
      --seeds-color-primary-dark: #1f6058;
    `);

    expect(parsed.primary).toEqual({ base: '#297E73', dark: '#1F6058' });
  });

  it('reads a stylesheet with an @import above the block', () => {
    const parsed = parseBrandSources(
      '@import url("https://fonts.googleapis.com/css2?family=X");\n' +
        ':root { --seeds-color-primary: #297e73; }',
    );

    expect(parsed.primary.base).toEqual('#297E73');
  });

  it('records the last declaration when it has no semicolon', () => {
    expect(parseRoot('--seeds-color-primary: #297e73').primary).toEqual({
      base: '#297E73',
    });
  });

  it.each(['{', '// not a comment', '}'])(
    'is not confused by %s inside a quoted value',
    (content) => {
      const parsed = parseRoot(
        `content: "${content}"; --seeds-color-primary: #297e73;`,
      );

      expect(parsed.primary.base).toEqual('#297E73');
    },
  );

  it('still ignores a genuinely commented out declaration', () => {
    const parsed = parseRoot(`
      // --seeds-color-primary: #000000;
      /* --seeds-color-secondary: #111111; */
      --seeds-color-primary: #297e73;
    `);

    expect(parsed.primary.base).toEqual('#297E73');
    expect(parsed.secondary).toBeUndefined();
  });

  it.each([':root>.seeds-button', ':root   >   .seeds-button'])(
    'matches the button block written as %s',
    (selector) => {
      const parsed = parseBrandSources(
        `:root { --seeds-color-primary: #297e73; } ${selector} { --button-border-radius-md: var(--seeds-rounded-full); }`,
      );

      expect(parsed.buttonRadius).toEqual(BrandRadiusEnum.full);
    },
  );
});

describe('parseBrandSources', () => {
  describe('a fork that sets colours, fonts and a radius', () => {
    const parsed = parseBrandSources(DETROIT);

    // Stored in full rather than deriving from the base: the read path's derivation produces
    // #1A514A for this base, not the #133A35 the fork authored.
    it('takes every shade the fork declared, uppercased', () => {
      expect(parsed.primary).toEqual({
        base: '#297E73',
        darker: '#133A35',
        dark: '#1F6058',
        light: '#C5ECE7',
        lighter: '#ECF9F7',
      });
    });

    it('takes the radius from the fork own button block', () => {
      expect(parsed.buttonRadius).toEqual(BrandRadiusEnum.xl3);
    });

    it('takes the first family from each stack, since a brand family allows no commas', () => {
      expect(parsed.fontFamily).toEqual('Montserrat');
      expect(parsed.headingFontFamily).toEqual('Montserrat');
      expect(parsed.serifFontFamily).toEqual('Montserrat');
    });

    it('sets no secondary, because the fork declares none', () => {
      expect(parsed.secondary).toBeUndefined();
    });
  });

  describe('a fork whose only radius is the inherited lakeview one', () => {
    const parsed = parseBrandSources(LA);

    it('takes its colours', () => {
      expect(parsed.primary.base).toEqual('#2A70BC');
    });

    it('takes no radius', () => {
      expect(parsed.buttonRadius).toBeUndefined();
    });
  });

  describe('a fork with no brand of its own', () => {
    const parsed = parseBrandSources(HBA);

    // The lakeview palette is core's theming test data. Migrating it would repaint the site with a
    // colour the fork never chose.
    it('takes nothing at all', () => {
      expect(parsed).toEqual({});
    });
  });

  describe('values it refuses', () => {
    const parseRoot = (body: string) => parseBrandSources(`:root {${body}}`);

    it('ignores a base that is not a hex colour', () => {
      expect(
        parseRoot('--seeds-color-primary: rebeccapurple;').primary,
      ).toBeUndefined();
    });

    it('drops a single unusable shade but keeps the rest', () => {
      const parsed = parseRoot(`
        --seeds-color-primary: #297e73;
        --seeds-color-primary-dark: var(--something-else);
        --seeds-color-primary-light: #c5ece7;
      `);

      expect(parsed.primary).toEqual({ base: '#297E73', light: '#C5ECE7' });
    });

    it('ignores a stack naming only a generic family', () => {
      expect(
        parseRoot('--seeds-font-sans: sans-serif;').fontFamily,
      ).toBeUndefined();
    });

    it.each(['var(--seeds-rounded-pill)', '4px', 'var(--something-else)'])(
      'ignores a radius of %s',
      (value) => {
        const parsed = parseBrandSources(
          `:root { .seeds-button { --button-border-radius-md: ${value}; } }`,
        );

        expect(parsed.buttonRadius).toBeUndefined();
      },
    );

    it('reads the unsuffixed variable as the base step', () => {
      const parsed = parseBrandSources(
        ':root { .seeds-button { --button-border-radius-md: var(--seeds-rounded); } }',
      );

      expect(parsed.buttonRadius).toEqual(BrandRadiusEnum.base);
    });
  });
});
