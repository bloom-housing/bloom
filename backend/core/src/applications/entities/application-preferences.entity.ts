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

export class FormMetadataExtraData {
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

export class BooleanInput extends FormMetadataExtraData {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  value: boolean
}

export class TextInput extends FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  value: string
}

export class AddressInput extends FormMetadataExtraData {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  value: AddressCreateDto
}

export class FormMetadataOptions {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  extraData: FormMetadataExtraData[]
}

export class FormMetadata {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  options: FormMetadataOptions[]
}

// TODO
// @Entity()
// export class ApplicationPreference extends AbstractEntity {
//   @ManyToOne(() => Application, (application) => application.householdMembers)
//   application: Application
//
//   @ManyToOne(() => Preference, (preference) => preference.applicationPreferences, { eager: true })
//   preference: Preference
//
//   @Column("jsonb", { nullable: false })
//   @Expose()
//   @ApiProperty({
//     type: "array",
//     items: {
//       oneOf: [
//         { $ref: getSchemaPath(BooleanInput) },
//         { $ref: getSchemaPath(TextInput) },
//         { $ref: getSchemaPath(AddressInput) },
//       ],
//     },
//   })
//   @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
//   @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
//   @Type(() => FormMetadataExtraData, {
//     keepDiscriminatorProperty: true,
//     discriminator: {
//       property: "type",
//       subTypes: [
//         { value: BooleanInput, name: InputType.boolean },
//         { value: TextInput, name: InputType.text },
//         { value: AddressInput, name: InputType.address },
//       ],
//     },
//   })
//   data: Array<BooleanInput | TextInput | AddressInput>
// }

export const applicationPreferenceExtraModels = [BooleanInput, TextInput, AddressInput]
