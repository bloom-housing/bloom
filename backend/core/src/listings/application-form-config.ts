import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, ValidateNested } from "class-validator"

export class StepConfig {
  @Expose()
  @IsString()
  name: string
}

export class ApplicationFormConfig {
  @Expose()
  @IsString({ each: true })
  sections: string[]

  @Expose()
  @IsString({ each: true })
  languages: string[]
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StepConfig)
  steps: StepConfig[]
}
