import { Column, Entity, JoinTable, ManyToMany } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Program } from "../../program/entities/program.entity"
import {
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Language } from "../../shared/types/language-enum"
import { Expose, Type } from "class-transformer"
import { Preference } from "../../preferences/entities/preference.entity"

@Entity({ name: "jurisdictions" })
export class Jurisdiction extends AbstractEntity {
  @Column({ type: "text", unique: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  notificationsSignUpURL?: string | null

  @ManyToMany(() => Program, (program) => program.jurisdictions, { cascade: true })
  @JoinTable()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Program)
  programs: Program[]

  @Column({ type: "enum", enum: Language, array: true, default: [Language.en] })
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default], each: true })
  languages: Language[]

  @ManyToMany(() => Preference, (preference) => preference.jurisdictions, { cascade: true })
  @JoinTable()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Preference)
  preferences: Preference[]
}
