import { Expose } from "class-transformer"
import { IsString } from "class-validator"

export class PreferenceLink {
  @Expose()
  @IsString()
  title: string
  @Expose()
  @IsString()
  url: string
}
