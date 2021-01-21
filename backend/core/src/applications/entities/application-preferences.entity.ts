import { Expose, Type } from "class-transformer"
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"
import { Column, Entity, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Application } from "./application.entity"
import { Preference } from "../../preferences/entities/preference.entity"
import { AddressCreateDto } from "../../shared/dto/address.dto"
import { PreferenceType } from "../../shared/preference-type"

export class BasePreference {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(PreferenceType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: PreferenceType, enumName: "PreferenceType" })
  type: PreferenceType
}

export class LiveOrWorkPreference extends BasePreference {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  liveIn: boolean

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  workIn: boolean
}

export class DisplacedPreference extends BasePreference {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  address: AddressCreateDto
}

@Entity()
export class ApplicationPreference extends AbstractEntity {
  @ManyToOne(() => Application, (application) => application.householdMembers)
  application: Application

  @ManyToOne(() => Preference, (preference) => preference.applicationPreferences, { eager: true })
  preference: Preference

  @Column("jsonb", { nullable: false })
  @Expose()
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(LiveOrWorkPreference) },
      { $ref: getSchemaPath(DisplacedPreference) },
    ],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default]})
  @Type(() => BasePreference, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: LiveOrWorkPreference, name: PreferenceType.liveOrWork },
        { value: DisplacedPreference, name: PreferenceType.displaced },
      ],
    },
  })
  data: LiveOrWorkPreference | DisplacedPreference | null
}
