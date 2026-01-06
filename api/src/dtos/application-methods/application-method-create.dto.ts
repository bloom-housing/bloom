import { ApplicationMethodUpdate } from './application-method-update.dto';
import { Expose, Type } from 'class-transformer';
import { OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { PaperApplicationCreate } from '../paper-applications/paper-application-create.dto';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationMethodCreate extends OmitType(ApplicationMethodUpdate, [
  'id',
  'paperApplications',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationCreate)
  @ApiPropertyOptional({ type: PaperApplicationCreate, isArray: true })
  paperApplications?: PaperApplicationCreate[];
}
