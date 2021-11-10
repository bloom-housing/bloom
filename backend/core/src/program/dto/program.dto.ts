import { OmitType } from "@nestjs/swagger"
import { Program } from "../entities/program.entity"

export class ProgramDto extends OmitType(Program, ["listingPrograms", "jurisdictions"] as const) {}
