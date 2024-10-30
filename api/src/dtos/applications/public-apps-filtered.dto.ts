import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Application } from './application.dto';
import Listing from '../listings/listing.dto';

export class PublicAppsFiltered extends OmitType(Application, ['listings']) {
  @Expose()
  @Type(() => Listing)
  @ApiProperty({ type: Listing })
  listings: Listing;
}
