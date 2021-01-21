import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { Column, Entity, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Application } from "./application.entity"
import { Preference } from "../../preferences/entities/preference.entity"
import { InputType } from "../../shared/input-type"
import { AddressCreateDto } from "../../shared/dto/address.dto"

export class BaseInput {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(InputType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: InputType, enumName: "InputType" })
  type: InputType

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string
}

export class BaseInputMetadata extends BaseInput {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  label: string
}

export class BooleanInput extends BaseInput {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  value: boolean
}

export class TextInput extends BaseInput {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  value: string
}

export class AddressInput extends BaseInput {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  value: AddressCreateDto
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
    type: "array",
    items: {
      oneOf: [
        { $ref: getSchemaPath(BooleanInput) },
        { $ref: getSchemaPath(TextInput) },
        { $ref: getSchemaPath(AddressInput) },
      ],
    },
  })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => BaseInput, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: BooleanInput, name: InputType.boolean },
        { value: TextInput, name: InputType.text },
        { value: AddressInput, name: InputType.address },
      ],
    },
  })
  data: Array<BooleanInput | TextInput | AddressInput>
}

export const applicationPreferenceExtraModels = [BooleanInput, TextInput, AddressInput]
