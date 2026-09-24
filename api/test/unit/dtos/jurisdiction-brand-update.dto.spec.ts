import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { JurisdictionBrandUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-brand-update.dto';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { defaultValidationPipeOptions } from '../../../src/utilities/default-validation-pipe-options';

// Mirrors the pipe: skipMissingProperties changes which decorators run on an absent value.
const errorsOf = async (input: unknown) =>
  validate(
    plainToClass(JurisdictionBrandUpdate, input, {
      excludeExtraneousValues: true,
    }),
    {
      groups: [ValidationsGroupsEnum.default],
      skipMissingProperties: defaultValidationPipeOptions.skipMissingProperties,
      forbidUnknownValues: defaultValidationPipeOptions.forbidUnknownValues,
    },
  );

describe('JurisdictionBrandUpdate', () => {
  it('accepts a brand on its own', async () => {
    expect(
      await errorsOf({ brand: { primary: { base: '#773E98' } } }),
    ).toHaveLength(0);
  });

  it('accepts a file id on its own, since a logo needs no colors', async () => {
    expect(await errorsOf({ logoFileId: 'dev/bloom_logo.png' })).toHaveLength(
      0,
    );
  });

  it('accepts nulls, which clear the brand and disconnect the assets', async () => {
    expect(
      await errorsOf({ brand: null, logoFileId: null, faviconFileId: null }),
    ).toHaveLength(0);
  });

  it('accepts an empty body, which changes nothing', async () => {
    expect(await errorsOf({})).toHaveLength(0);
  });

  it('rejects a malformed brand', async () => {
    expect(await errorsOf({ brand: { primary: {} } })).not.toHaveLength(0);
    expect(
      await errorsOf({ brand: { primary: { base: 'rebeccapurple' } } }),
    ).not.toHaveLength(0);
  });

  it.each(['logoFileId', 'faviconFileId'])(
    'rejects a non-string %s',
    async (field) => {
      expect(await errorsOf({ [field]: 12 })).not.toHaveLength(0);
    },
  );
});
