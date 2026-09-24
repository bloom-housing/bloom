import {
  completeRamp,
  hexToHsl,
  hslToHex,
} from '../../../src/utilities/brand-ramp';

describe('completeRamp', () => {
  // Expected values computed independently (python colorsys) from the documented deltas:
  // darker = L*0.64, dark = L*0.88, light = L+(100-L)*0.88, lighter = L+(100-L)*0.95.
  it.each([
    [
      '#773E98',
      {
        base: '#773E98',
        darker: '#4C2861',
        dark: '#693786',
        light: '#EFE6F5',
        lighter: '#F8F4FB',
      },
    ],
    [
      '#0077DA',
      {
        base: '#0077DA',
        darker: '#004C8C',
        dark: '#0069C0',
        light: '#DCEFFF',
        lighter: '#F0F8FF',
      },
    ],
    [
      '#222222',
      {
        base: '#222222',
        darker: '#161616',
        dark: '#1E1E1E',
        light: '#E4E4E4',
        lighter: '#F4F4F4',
      },
    ],
    [
      '#EEDD00',
      {
        base: '#EEDD00',
        darker: '#988D00',
        dark: '#D1C200',
        light: '#FFFDDE',
        lighter: '#FFFEF1',
      },
    ],
  ])('derives the four values from %s', (base, expected) => {
    expect(completeRamp({ base })).toEqual(expected);
  });

  it('leaves explicit values alone and derives only the absent ones', () => {
    const ramp = completeRamp({
      base: '#773E98',
      dark: '#6E2598',
      lighter: '#F9F4FA',
    });

    expect(ramp.dark).toEqual('#6E2598');
    expect(ramp.lighter).toEqual('#F9F4FA');
    expect(ramp.darker).toEqual('#4C2861');
    expect(ramp.light).toEqual('#EFE6F5');
  });

  it('normalizes every returned value to uppercase', () => {
    const ramp = completeRamp({ base: '#77aa33', dark: '#5588cc' });

    expect(ramp.base).toEqual('#77AA33');
    expect(ramp.dark).toEqual('#5588CC');
  });

  it('handles a three-digit base', () => {
    expect(completeRamp({ base: '#FFF' }).base).toEqual('#FFF');
    expect(completeRamp({ base: '#FFF' }).darker).toEqual('#A3A3A3');
  });
});

describe('hex and HSL conversions', () => {
  it.each(['#773E98', '#0077DA', '#000000', '#FFFFFF', '#808080'])(
    'round-trips %s',
    (hex) => {
      expect(hslToHex(hexToHsl(hex))).toEqual(hex);
    },
  );
});
