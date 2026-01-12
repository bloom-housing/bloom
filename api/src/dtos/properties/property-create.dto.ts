import { OmitType } from '@nestjs/swagger';
import { PropertyUpdate } from './property-update.dto';

export default class PropertyCreate extends OmitType(PropertyUpdate, ['id']) {}
