import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LotteryStatusEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingLotteryStatus {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @IsEnum(LotteryStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: LotteryStatusEnum,
    enumName: 'LotteryStatusEnum',
  })
  lotteryStatus: LotteryStatusEnum;
}
