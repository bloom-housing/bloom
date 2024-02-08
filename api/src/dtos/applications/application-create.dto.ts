import { OmitType } from '@nestjs/swagger';
import { ApplicationUpdate } from './application-update.dto';

export class ApplicationCreate extends OmitType(ApplicationUpdate, ['id']) {}
