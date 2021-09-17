import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  placeName?: string

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  city: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  county?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  state: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  street: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  street2?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  zipCode: string | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => Number)
  latitude?: number | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => Number)
  longitude?: number | null
}
