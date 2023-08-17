import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { PaperApplicationCreate } from '../paper-applications/paper-application-create.dto';
import { ApplicationMethod } from './application-method.dto';

export class ApplicationMethodCreate extends OmitType(ApplicationMethod, [
  'id',
  'createdAt',
  'updatedAt',
  'paperApplications',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationCreate)
  @ApiProperty({ type: PaperApplicationCreate, required: false, isArray: true })
  paperApplications?: PaperApplicationCreate[];
}
