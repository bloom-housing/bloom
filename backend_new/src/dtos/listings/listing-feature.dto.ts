import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';

export class ListingFeatures extends AbstractDTO {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  elevator?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  wheelchairRamp?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  serviceAnimalsAllowed?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  accessibleParking?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  parkingOnSite?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  inUnitWasherDryer?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  laundryInBuilding?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  barrierFreeEntrance?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  rollInShower?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  grabBars?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  heatingInUnit?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acInUnit?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  hearing?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  visual?: boolean | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  mobility?: boolean | null;
}
