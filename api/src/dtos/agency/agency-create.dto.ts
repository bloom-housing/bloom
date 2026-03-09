import { OmitType } from '@nestjs/swagger';
import { AgencyUpdate } from './agency-update.dto';

export default class AgencyCreate extends OmitType(AgencyUpdate, ['id']) {}
