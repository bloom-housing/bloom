import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Application } from './application.dto';
import Listing from '../listings/listing.dto';

export class PublicAppsFiltered extends OmitType(Application, ['listings']) {
  @Expose()
  @Type(() => Application)
  @ApiProperty({ type: Listing })
  listings: Listing;
}
