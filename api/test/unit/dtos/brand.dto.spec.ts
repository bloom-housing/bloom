import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BrandDTO } from '../../../src/dtos/jurisdictions/brand.dto';
import { BrandRadiusEnum } from '../../../src/enums/jurisdictions/brand-radius-enum';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { defaultValidationPipeOptions } from '../../../src/utilities/default-validation-pipe-options';

const toBrand = (input: unknown): BrandDTO =>
  plainToClass(BrandDTO, input, { excludeExtraneousValues: true });

// Mirrors the pipe: skipMissingProperties changes which decorators run on an absent value.
const errorsOf = async (input: unknown) =>
  validate(toBrand(input), {
    groups: [ValidationsGroupsEnum.default],
    skipMissingProperties: defaultValidationPipeOptions.skipMissingProperties,
    forbidUnknownValues: defaultValidationPipeOptions.forbidUnknownValues,
  });

describe('BrandDTO', () => {
  it('accepts a base-only brand', async () => {
    expect(await errorsOf({ primary: { base: '#773E98' } })).toHaveLength(0);
  });

  it('accepts a full explicit brand', async () => {
    const errors = await errorsOf({
      primary: {
        base: '#773E98',
        dark: '#693786',
        darker: '#4C2861',
        light: '#EFE6F5',
        lighter: '#F8F4FB',
      },
      secondary: { base: '#0077DA' },
      fontFamily: 'Inter',
      fontUrl: 'https://fonts.googleapis.com/css2?family=Inter',
    });

    expect(errors).toHaveLength(0);
  });

  it('normalizes hex values to uppercase on transform', () => {
    const brand = toBrand({
      primary: { base: '#77aa33', dark: '#5588cc' },
    });

    expect(brand.primary.base).toEqual('#77AA33');
    expect(brand.primary.dark).toEqual('#5588CC');
  });

  it('rejects a brand with no primary ramp', async () => {
    expect(await errorsOf({})).not.toHaveLength(0);
    expect(await errorsOf({ secondary: { base: '#0077DA' } })).not.toHaveLength(
      0,
    );
  });

  it('rejects a ramp with no base color', async () => {
    expect(await errorsOf({ primary: {} })).not.toHaveLength(0);
    expect(
      await errorsOf({ primary: { base: '#773E98' }, secondary: {} }),
    ).not.toHaveLength(0);
  });

  it('rejects a value that is not a hex color', async () => {
    expect(
      await errorsOf({ primary: { base: 'rebeccapurple' } }),
    ).not.toHaveLength(0);
    expect(
      await errorsOf({ primary: { base: '#773E98', dark: 'url(x)' } }),
    ).not.toHaveLength(0);
  });

  // The derivation and the CSS variables handle only these two forms, so the looser shapes the
  // generic hex-color check would pass are refused.
  it('accepts only 3- or 6-digit hex with a leading hash', async () => {
    expect(await errorsOf({ primary: { base: '#FFF' } })).toHaveLength(0);

    expect(await errorsOf({ primary: { base: '773E98' } })).not.toHaveLength(0);
    expect(await errorsOf({ primary: { base: '#F0F8' } })).not.toHaveLength(0);
    expect(await errorsOf({ primary: { base: '#AABBCCDD' } })).not.toHaveLength(
      0,
    );
  });

  it('rejects a font url that is not a google fonts host', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.example.com/css2?family=Inter',
      }),
    ).not.toHaveLength(0);
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        fontUrl: 'http://fonts.googleapis.com/css2?family=Inter',
      }),
    ).not.toHaveLength(0);
  });

  it('defaults a font url to display=swap', async () => {
    expect(
      toBrand({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter',
      }).fontUrl,
    ).toEqual('https://fonts.googleapis.com/css2?family=Inter&display=swap');
  });

  it('puts display in the query even when the url has a fragment', async () => {
    // Appended to the whole url it would land inside the fragment and never reach google.
    expect(
      toBrand({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter#section',
      }).fontUrl,
    ).toEqual(
      'https://fonts.googleapis.com/css2?family=Inter&display=swap#section',
    );
  });

  it('keeps a multi word family readable rather than re-encoding it', async () => {
    expect(
      toBrand({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif',
      }).fontUrl,
    ).toEqual(
      'https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap',
    );
  });

  it('leaves a value that is not a url for IsUrl to reject', async () => {
    expect(
      toBrand({ primary: { base: '#773E98' }, fontUrl: 'not a url' }).fontUrl,
    ).toEqual('not a url');
  });

  it('leaves an explicit display value alone', async () => {
    expect(
      toBrand({
        primary: { base: '#773E98' },
        fontUrl:
          'https://fonts.googleapis.com/css2?family=Inter&display=optional',
      }).fontUrl,
    ).toEqual(
      'https://fonts.googleapis.com/css2?family=Inter&display=optional',
    );
  });

  it('rejects a font url carrying credentials', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        fontUrl: 'https://user:pass@fonts.googleapis.com/css2?family=Inter',
      }),
    ).not.toHaveLength(0);
  });

  it('accepts a google fonts stylesheet over https', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
      }),
    ).toHaveLength(0);
  });

  it('rejects gstatic, which serves font files rather than stylesheets', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        fontUrl: 'https://fonts.gstatic.com/s/inter/v20/font.woff2',
      }),
    ).not.toHaveLength(0);
  });

  it('accepts a serif family and a button radius', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        serifFontFamily: 'Noto Serif',
        buttonRadius: BrandRadiusEnum.xl3,
      }),
    ).toHaveLength(0);
  });

  it.each([
    ['a trailing space', 'Noto Serif '],
    ['a leading hyphen', '-Noto'],
    ['a non-ascii character', 'Söhne'],
    ['css that closes the declaration', 'Noto"; } body { display: none } .x {'],
  ])('rejects a serif family with %s', async (_label, serifFontFamily) => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, serifFontFamily }),
    ).not.toHaveLength(0);
  });

  // All three reach the same interpolation in the style block, so all three take the same rule.
  it.each(['fontFamily', 'headingFontFamily', 'serifFontFamily'])(
    'holds %s to the family pattern',
    async (field) => {
      expect(
        await errorsOf({
          primary: { base: '#773E98' },
          [field]: 'Inter"; } body { display: none } .x {',
        }),
      ).not.toHaveLength(0);

      expect(
        await errorsOf({ primary: { base: '#773E98' }, [field]: 'Inter' }),
      ).toHaveLength(0);
    },
  );

  it.each([
    ['a number', 123],
    ['a boolean', true],
    ['an array', ['Noto Serif']],
    ['an object', { toString: 1 }],
  ])('rejects %s as a serif family', async (_label, serifFontFamily) => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, serifFontFamily }),
    ).not.toHaveLength(0);
  });

  // Submitted as literals so a change to an enum member's value shows up here.
  it.each(['sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', 'full'])(
    'accepts %s as a button radius',
    async (buttonRadius) => {
      expect(
        await errorsOf({ primary: { base: '#773E98' }, buttonRadius }),
      ).toHaveLength(0);
    },
  );

  it('holds the serif family to the 64 character limit', async () => {
    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        serifFontFamily: 'A'.repeat(64),
      }),
    ).toHaveLength(0);

    expect(
      await errorsOf({
        primary: { base: '#773E98' },
        serifFontFamily: 'A'.repeat(65),
      }),
    ).not.toHaveLength(0);
  });

  it('rejects an empty serif family, which IsOptional does not skip', async () => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, serifFontFamily: '' }),
    ).not.toHaveLength(0);
  });

  it('rejects a button radius outside the seeds scale', async () => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, buttonRadius: 'pill' }),
    ).not.toHaveLength(0);
  });

  it('rejects a font url that is not a url', async () => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, fontUrl: 'not a url' }),
    ).not.toHaveLength(0);
  });
});
