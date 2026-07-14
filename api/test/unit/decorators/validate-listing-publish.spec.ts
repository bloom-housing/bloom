import { ListingsStatusEnum } from '@prisma/client';
import { validateSync } from 'class-validator';
import { ValidateListingPublish } from '../../../src/decorators/validate-listing-publish.decorator';

class ListingPublishValidationTestDto {
  status?: ListingsStatusEnum;
  requiredFields?: string[];

  @ValidateListingPublish('units')
  units?: unknown[];
}

describe('ValidateListingPublish', () => {
  it('should require fields for scheduled status the same as publish', () => {
    const dto = new ListingPublishValidationTestDto();
    dto.status = ListingsStatusEnum.scheduled;
    dto.requiredFields = ['units'];
    dto.units = undefined;

    const errors = validateSync(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('units');
  });

  it('should pass for scheduled status when required field is present', () => {
    const dto = new ListingPublishValidationTestDto();
    dto.status = ListingsStatusEnum.scheduled;
    dto.requiredFields = ['units'];
    dto.units = [{ id: 'unit-1' }];

    const errors = validateSync(dto);

    expect(errors).toHaveLength(0);
  });

  it('should not require field when not included in requiredFields', () => {
    const dto = new ListingPublishValidationTestDto();
    dto.status = ListingsStatusEnum.scheduled;
    dto.requiredFields = ['buildingAddress'];
    dto.units = undefined;

    const errors = validateSync(dto);

    expect(errors).toHaveLength(0);
  });
});
