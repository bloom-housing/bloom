import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationStringConfig {
  @Expose()
  @Type(() => Object)
  @ApiPropertyOptional()
  strings?: Record<string, any>;
}
