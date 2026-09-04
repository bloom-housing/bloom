import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BrandDTO } from '../../../src/dtos/jurisdictions/brand.dto';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';

const toBrand = (input: unknown): BrandDTO =>
  plainToClass(BrandDTO, input, { excludeExtraneousValues: true });

const errorsOf = async (input: unknown) =>
  validate(toBrand(input), { groups: [ValidationsGroupsEnum.default] });

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

  it('rejects a font url that is not a url', async () => {
    expect(
      await errorsOf({ primary: { base: '#773E98' }, fontUrl: 'not a url' }),
    ).not.toHaveLength(0);
  });
});
