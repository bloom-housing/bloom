import { Module } from '@nestjs/common';
import { PropertyController } from 'src/controllers/property.controller';
import { PropertyService } from 'src/services/property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
