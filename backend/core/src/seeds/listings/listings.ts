import { PropertyCreateDto } from "../../property/dto/property.dto"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { ApplicationMethodDto } from "../../listings/dto/application-method.dto"
import { ListingCreateDto } from "../../listings/dto/listing.dto"
import { PreferenceCreateDto } from "../../preferences/dto/preference.dto"
import { ListingEventDto } from "../../listings/dto/listing-event.dto"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { UserCreateDto } from "../../auth/dto/user.dto"
import { BaseEntity } from "typeorm"

export type PropertySeedType = Omit<
  PropertyCreateDto,
  | "propertyGroups"
  | "listings"
  | "units"
  | "unitsSummarized"
  | "householdSizeMin"
  | "householdSizeMax"
>

export type UnitSeedType = Omit<UnitCreateDto, "property">

export type ApplicationMethodSeedType = ApplicationMethodDto

export type ListingSeedType = Omit<
  ListingCreateDto,
  | keyof BaseEntity
  | "property"
  | "urlSlug"
  | "applicationMethods"
  | "events"
  | "assets"
  | "preferences"
  | "leasingAgents"
  | "showWaitlist"
  | "units"
  | "propertyGroups"
  | "accessibility"
  | "amenities"
  | "buildingAddress"
  | "buildingTotalUnits"
  | "developer"
  | "householdSizeMax"
  | "householdSizeMin"
  | "neighborhood"
  | "petPolicy"
  | "smokingPolicy"
  | "unitsAvailable"
  | "unitAmenities"
  | "servicesOffered"
  | "yearBuilt"
  | "unitsSummarized"
>

export type PreferenceSeedType = Omit<PreferenceCreateDto, "listing">

export type ListingEventDtoSeedType = Omit<ListingEventDto, "listing">

export type AssetDtoSeedType = Omit<AssetCreateDto, "listing">

// Properties that are ommited in DTOS derived types are relations and getters
export interface ListingSeed {
  amiChart: AmiChartCreateDto
  units: Array<UnitSeedType>
  applicationMethods: Array<ApplicationMethodSeedType>
  property: PropertySeedType
  preferences: Array<PreferenceSeedType>
  listingEvents: Array<ListingEventDtoSeedType>
  assets: Array<AssetDtoSeedType>
  listing: ListingSeedType
  leasingAgents: UserCreateDto[]
}
