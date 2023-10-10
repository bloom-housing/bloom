import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationFactory } from '../shared/pagination.dto';
import { ApplicationFlaggedSetPaginationMeta } from './afs-pagination-meta.dto';
import { ApplicationFlaggedSet } from './application-flagged-set.dto';

export class PaginatedAfsDto extends PaginationFactory<ApplicationFlaggedSet>(
  ApplicationFlaggedSet,
) {
  @Expose()
  @ApiProperty({ type: ApplicationFlaggedSetPaginationMeta })
  meta: ApplicationFlaggedSetPaginationMeta;
}
