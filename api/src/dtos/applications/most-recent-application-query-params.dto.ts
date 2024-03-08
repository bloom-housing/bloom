import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
export class MostRecentApplicationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId: string;
}
