import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';

export class ListingUtilities extends AbstractDTO {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  water?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  gas?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  trash?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  sewer?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  electricity?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  cable?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  phone?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  internet?: boolean | null;
}
