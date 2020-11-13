import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Application } from "../entities/application.entity"
import { Exclude, Expose, Transform, Type } from "class-transformer"
import { IdDto } from "../../lib/id.dto"
import { PaginationFactory, PaginationQueryParams } from "../../utils/pagination.dto"
import { ListingDto } from "../../listings/listing.dto"
import { Applicant } from "../entities/applicant.entity"
import { ApplicationData } from "../entities/application-data.entity"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { AlternateContact } from "../entities/alternate-contact.entity"
import { Accessibility } from "../entities/accessibility.entity"
import { Demographics } from "../entities/demographics.entity"

export class ApplicationsListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "search",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string
}

export class ApplicationsCsvListQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeHeaders?: boolean
}

export class ApplicationDto extends OmitType(Application, ["listing", "user"] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ListingDto)
  listing: ListingDto

  @Exclude()
  @ApiHideProperty()
  user
}

export class PaginatedApplicationDto extends PaginationFactory<ApplicationDto>(ApplicationDto) {}

export class ApplicantUpdateDto extends OmitType(Applicant, [
  "id",
  "createdAt",
  "updatedAt",
  "address",
  "workAddress",
] as const) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date

  @Expose()
  @IsDefined()
  @ValidateNested()
  address: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  workAddress: AddressUpdateDto
}

export class AlternateContactUpdateDto extends OmitType(AlternateContact, [
  "id",
  "createdAt",
  "updatedAt",
  "mailingAddress",
]) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date

  @Expose()
  @IsDefined()
  @ValidateNested()
  mailingAddress: AddressUpdateDto
}

export class AccessbilityUpdateDto extends OmitType(Accessibility, [
  "id",
  "createdAt",
  "updatedAt",
]) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date
}

export class DemographicsUpdateDto extends OmitType(Demographics, [
  "id",
  "createdAt",
  "updatedAt",
]) {
  @Expose()
  @IsOptional()
  @IsUUID()
  id?: string

  @Expose()
  @IsOptional()
  @IsUUID()
  createdAt?: Date

  @Expose()
  @IsOptional()
  @IsUUID()
  updatedAt?: Date
}

export class ApplicationDataCreateDto extends OmitType(ApplicationData, [
  "id",
  "createdAt",
  "updatedAt",
  "applicant",
  "mailingAddress",
  "alternateAddress",
  "alternateContact",
  "accessibility",
  "demographics"
]) {
  @Expose()
  @ValidateNested()
  applicant: ApplicantUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  mailingAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateAddress: AddressUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateContact: AlternateContactUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  accessibility: AccessbilityUpdateDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  demographics: DemographicsUpdateDto
}

export class ApplicationCreateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "listing",
  "application",
] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  listing: IdDto

  @Expose()
  @IsDefined()
  @ValidateNested()
  application: ApplicationDataCreateDto
}

export class ApplicationUpdateDto extends ApplicationCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
