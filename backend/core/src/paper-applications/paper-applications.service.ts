import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import { PaperApplicationCreateDto, PaperApplicationUpdateDto } from "./dto/paper-application.dto"
import { PaperApplication } from "./entities/paper-application.entity"

@Injectable()
export class PaperApplicationsService extends AbstractServiceFactory<
  PaperApplication,
  PaperApplicationCreateDto,
  PaperApplicationUpdateDto
>(PaperApplication) {}
