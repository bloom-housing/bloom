import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { JurisdictionBrandingMigrationDTO } from '../../../src/dtos/script-runner/jurisdiction-branding-migration.dto';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { defaultValidationPipeOptions } from '../../../src/utilities/default-validation-pipe-options';

// Mirrors the pipe: skipMissingProperties changes which decorators run on an absent value.
const errorsOf = async (input: unknown) =>
  validate(
    plainToClass(JurisdictionBrandingMigrationDTO, input, {
      excludeExtraneousValues: true,
    }),
    {
      groups: [ValidationsGroupsEnum.default],
      skipMissingProperties: defaultValidationPipeOptions.skipMissingProperties,
      forbidUnknownValues: defaultValidationPipeOptions.forbidUnknownValues,
    },
  );

const propertiesInError = async (input: unknown) =>
  (await errorsOf(input)).map((error) => error.property);

const valid = { jurisdictionName: 'Bloomington', commit: false };

describe('JurisdictionBrandingMigrationDTO', () => {
  it('accepts a jurisdiction name and a commit flag on their own', async () => {
    expect(await errorsOf(valid)).toHaveLength(0);
  });

  it.each(['jurisdictionName', 'commit'])('requires %s', async (field) => {
    const withoutField = Object.fromEntries(
      Object.entries(valid).filter(([key]) => key !== field),
    );

    expect(await propertiesInError(withoutField)).toContain(field);
  });

  it('refuses a blank jurisdiction name', async () => {
    expect(
      await propertiesInError({ ...valid, jurisdictionName: '' }),
    ).toContain('jurisdictionName');
  });

  describe('where it reads from', () => {
    it('accepts a raw github url', async () => {
      expect(
        await errorsOf({
          ...valid,
          repositoryUrl:
            'https://raw.githubusercontent.com/CityOfDetroit/bloom',
          gitRef: 'a1b2c3d',
          overridesPath: 'sites/public/styles/overrides.scss',
        }),
      ).toHaveLength(0);
    });

    it.each([
      'https://example.test/bloom',
      'http://raw.githubusercontent.com/bloom-housing/bloom',
      'https://user:pass@raw.githubusercontent.com/bloom-housing/bloom',
    ])('refuses %s', async (repositoryUrl) => {
      expect(await propertiesInError({ ...valid, repositoryUrl })).toContain(
        'repositoryUrl',
      );
    });

    // A path is interpolated into the source url, so it cannot climb out of the repository.
    it.each(['logoPath', 'faviconPath', 'overridesPath', 'gitRef'])(
      'refuses a %s that traverses upwards',
      async (field) => {
        expect(
          await propertiesInError({ ...valid, [field]: '../../etc/passwd' }),
        ).toContain(field);
      },
    );
  });

  describe('the brand overrides', () => {
    it('accepts a ramp and a radius', async () => {
      expect(
        await errorsOf({
          ...valid,
          brand: { primary: { base: '#297E73' }, buttonRadius: '3xl' },
        }),
      ).toHaveLength(0);
    });

    // The nested validation is BrandDTO's own, so the migration cannot write a brand the endpoint
    // would reject.
    it('refuses a base that is not a hex colour', async () => {
      expect(
        await propertiesInError({
          ...valid,
          brand: { primary: { base: 'rebeccapurple' } },
        }),
      ).toContain('brand');
    });

    it('refuses a font url that is not google fonts', async () => {
      expect(
        await propertiesInError({
          ...valid,
          brand: { fontUrl: 'https://fonts.example.test/css2?family=Inter' },
        }),
      ).toContain('brand');
    });

    it('refuses a radius the scale does not define', async () => {
      expect(
        await propertiesInError({ ...valid, brand: { buttonRadius: 'pill' } }),
      ).toContain('brand');
    });
  });
});
