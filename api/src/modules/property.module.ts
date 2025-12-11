import { Module } from '@nestjs/common';
import { PropertyController } from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
