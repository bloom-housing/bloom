import { ApplicationMethod } from './application-method.dto';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { PaperApplicationUpdate } from '../paper-applications/paper-application-update.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationMethodUpdate extends OmitType(ApplicationMethod, [
  'createdAt',
  'id',
  'paperApplications',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationUpdate)
  @ApiPropertyOptional({ type: PaperApplicationUpdate, isArray: true })
  paperApplications?: PaperApplicationUpdate[];
}
