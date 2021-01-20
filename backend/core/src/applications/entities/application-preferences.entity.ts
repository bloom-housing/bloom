import { Expose, Type } from "class-transformer"
import { IsEnum, IsString, ValidateNested } from "class-validator"
import { Column, Entity, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Application } from "./application.entity"
import { Preference } from "../../preferences/entities/preference.entity"

export enum PreferenceType {
  base = "base",
  note = "note",
}

export class BasePreference {
  @Expose()
  @IsEnum(PreferenceType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: PreferenceType, enumName: "PreferenceType" })
  type: PreferenceType
}

export class NotePreference extends BasePreference {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  note: string
}

@Entity()
export class ApplicationPreference extends AbstractEntity {
  @ManyToOne(() => Application, (application) => application.householdMembers)
  application: Application

  @ManyToOne(() => Preference, (preference) => preference.applicationPreferences, { eager: true })
  preference: Preference

  @Column("jsonb", { nullable: true })
  @Expose()
  @ValidateNested()
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(BasePreference) }, { $ref: getSchemaPath(NotePreference) }],
  })
  @Type(() => BasePreference, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: BasePreference, name: PreferenceType.base },
        { value: NotePreference, name: PreferenceType.note },
      ],
    },
  })
  data?: BasePreference | NotePreference | null
}
