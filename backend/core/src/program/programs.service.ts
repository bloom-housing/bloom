import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { ProgramUpdateDto } from "./dto/program-update.dto"
import { ProgramCreateDto } from "./dto/program-create.dto"
import { Program } from "./entities/program.entity"

export class ProgramsService extends AbstractServiceFactory<
  Program,
  ProgramCreateDto,
  ProgramUpdateDto
>(Program) {}
