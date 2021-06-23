import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Jurisdiction } from "./entities/jurisdiction.entity"
import { JurisdictionCreateDto, JurisdictionUpdateDto } from "./dto/jurisdiction.dto"

export class JurisdictionsService extends AbstractServiceFactory<
  Jurisdiction,
  JurisdictionCreateDto,
  JurisdictionUpdateDto
>(Jurisdiction) {}
