import { OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
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
  @ApiPropertyOptional({ type: PaperApplicationCreate, isArray: true })
  paperApplications?: PaperApplicationCreate[];
}
