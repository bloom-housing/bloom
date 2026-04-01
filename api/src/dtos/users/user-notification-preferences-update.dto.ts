import { Expose } from 'class-transformer';
import { IsDefined, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserNotificationPreferences } from './user-notification-preferences.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserNotificationPreferencesUpdate extends UserNotificationPreferences {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;
}
