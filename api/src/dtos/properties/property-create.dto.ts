import { OmitType } from '@nestjs/swagger';
import Property from './property.dto';

export default class PropertyCreate extends OmitType(Property, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
