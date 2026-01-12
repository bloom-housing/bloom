import { OmitType } from '@nestjs/swagger';
import Property from './property.dto';
export class PropertyUpdate extends OmitType(Property, [
  'createdAt',
  'updatedAt',
]) {}
