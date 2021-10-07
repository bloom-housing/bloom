import { AbstractServiceFactory } from "../../shared/services/abstract-service"
import { Jurisdiction } from "../entities/jurisdiction.entity"
import { JurisdictionCreateDto } from "../dto/jurisdiction-create.dto"
import { JurisdictionUpdateDto } from "../dto/jurisdiction-update.dto"

export class JurisdictionsService extends AbstractServiceFactory<
  Jurisdiction,
  JurisdictionCreateDto,
  JurisdictionUpdateDto
>(Jurisdiction) {}
