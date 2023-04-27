import { UnitsSummarized } from "../../units/types/units-summarized"
import { PrimaryColumn, ViewColumn, ViewEntity } from "typeorm"
import { ListingFeatures } from "../entities/listing-features.entity"
import { ListingUtilities } from "../entities/listing-utilities.entity"
import { Address } from "../../shared/entities/address.entity"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { ReservedCommunityType } from "../../reserved-community-type/entities/reserved-community-type.entity"
import { ListingMultiselectQuestion } from "../../multiselect-question/entities/listing-multiselect-question.entity"
import { ListingImage } from "../entities/listing-image.entity"
import { User } from "../../auth/entities/user.entity"
import { Unit } from "../../units/entities/unit.entity"
import { ListingReviewOrder, ListingStatus } from "../../../types"
import { AssetCreateDto } from "../../assets/dto/asset.dto"

const localSelect = `SELECT
l.id,
l.assets,
l.household_size_min,
l.household_size_max,
l.units_available,
l.application_due_date,
l.application_open_date,
l.name,
l.waitlist_current_size,
l.waitlist_max_size,
l.is_waitlist_open,
CAST(l.status AS text),
CAST(l.review_order_type AS text),
l.published_at,
l.closed_at,
l.updated_at,
l.last_application_update_at,

-- filter/sort criteria
addr.county,
addr.city,
l.neighborhood,
rct.name as "reserved_community_type_name",

null as "url_slug", -- url_slug, intentionally null
null as "units_summarized", -- units_summarized, intentionally null
imgs.json AS "images",
msq.json AS "multiselect_questions",

-- jurisdiction
jsonb_build_object(
  'id', j.id,
  'name', j.name
) AS "jurisdiction",

-- reserved_community_type; may not exist
CASE
  WHEN rct.id IS NOT NULL THEN 
    jsonb_build_object(
      'name', rct.name,
      'id', rct.id
    )
  ELSE NULL
END AS "reserved_community_type",

-- units
units.json AS "units",

-- building address
jsonb_build_object(
  'city', addr.city,
  'state', addr.state,
  'street', addr.street,
  'street2', addr.street2,
  'zipCode', addr.zip_code,
  'latitude', addr.latitude,
  'longitude', addr.longitude
) AS "building_address",

-- features; may not exist
CASE
  WHEN feat.id IS NOT NULL THEN 
    jsonb_build_object(
      'elevator', feat.elevator,
      'wheelchairRamp', feat.wheelchair_ramp,
      'serviceAnimalsAllowed', feat.service_animals_allowed,
      'accessibleParking', feat.accessible_parking,
      'parkingOnSite', feat.parking_on_site,
      'inUnitWasherDryer', feat.in_unit_washer_dryer,
      'laundryInBuilding', feat.laundry_in_building,
      'barrierFreeEntrance', feat.barrier_free_entrance,
      'rollInShower', feat.roll_in_shower,
      'grabBars', feat.grab_bars,
      'heatingInUnit', feat.heating_in_unit,
      'acInUnit', feat.ac_in_unit
    )
  ELSE NULL
END AS "features",

-- utilities; may not exist
CASE
  WHEN util.id IS NOT NULL THEN 
    jsonb_build_object(
      'water', util.water,
      'gas', util.gas,
      'trash', util.trash,
      'sewer', util.sewer,
      'electricity', util.electricity,
      'cable', util.cable,
      'phone', util.phone,
      'internet', util.internet
    )
  ELSE NULL
END AS "utilities",

agents.json as "leasing_agents",

false as "is_external"

FROM listings l

-- jurisdiction
INNER JOIN jurisdictions j
ON l.jurisdiction_id = j.id

-- features
LEFT JOIN listing_features feat
ON l.features_id = feat.id

-- reserved community type
LEFT JOIN reserved_community_types rct
ON l.reserved_community_type_id = rct.id

-- utilities
LEFT JOIN listing_utilities util
ON l.utilities_id = util.id

-- address
LEFT JOIN "address" addr
ON l.building_address_id = addr.id

-- units
LEFT JOIN (
SELECT 
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'annualIncomeMin', u.annual_income_min,
      'annualIncomeMax', u.annual_income_max,
      'monthlyIncomeMin', u.monthly_income_min,
      'monthlyRent', u.monthly_rent,
      'monthlyRentAsPercentOfIncome', CAST(u.monthly_rent_as_percent_of_income as text),
      'amiPercentage', u.ami_percentage,
      'floor', u.floor,
      'maxOccupancy', u.max_occupancy,
      'minOccupancy', u.min_occupancy,
      'sqFeet', CAST(u.sq_feet as text),
      'numBedrooms', u.num_bedrooms,
      'numBathrooms', u.num_bathrooms,
      'unitType', json_build_object(
        'id', u.unit_type_id,
        'name', t.name
      ),
      'amiChartOverride', 
      CASE
        WHEN ami.id IS NOT NULL THEN json_build_object(
          'id', u.ami_chart_override_id,
          'items', ami.items
        )
        ELSE NULL
      END
    )
  ) as "json"
  FROM units u
  INNER JOIN unit_types t
  ON u.unit_type_id = t.id
  LEFT JOIN unit_ami_chart_overrides ami
  ON u.ami_chart_override_id = ami.id
  GROUP BY u.listing_id
) AS units
ON l.id = units.listing_id

-- multiselect questions
LEFT JOIN (
SELECT
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'ordinal', ordinal,
      'multiselectQuestion', json_build_object(
        'id', msq.id
      )
    )
  ) AS "json"
FROM listing_multiselect_questions lmsq
INNER JOIN multiselect_questions msq
ON lmsq.multiselect_question_id = msq.id
GROUP BY listing_id
) as msq
ON l.id = msq.listing_id

-- images
LEFT JOIN (
SELECT
  listing_id,
  jsonb_agg(
    jsonb_build_object(
      'ordinal', ordinal,
      'image', json_build_object(
        'fileId', assets.file_id,
        'label', assets.label,
        'id', assets.id
      )
    )
  ) AS "json"
FROM listing_images img
INNER JOIN assets
ON img.image_id = assets.id
GROUP BY listing_id
) as imgs
ON l.id = imgs.listing_id

-- leasing agents
LEFT JOIN (
SELECT
  la.listings_id,
  jsonb_agg(
    jsonb_build_object(
      'id', la.user_accounts_id
    )
  ) AS "json"
FROM listings_leasing_agents_user_accounts la
GROUP BY la.listings_id
) as agents
ON l.id = agents.listings_id`

const externalSelect = `SELECT 
"id",
"assets", 
"household_size_min",
"household_size_max",
"units_available", 
"application_due_date", 
"application_open_date", 
"name", 
"waitlist_current_size", 
"waitlist_max_size", 
"is_waitlist_open",
"status", 
"review_order_type", 
"published_at", 
"closed_at", 
"updated_at",
"last_application_update_at", 
"county",
"city",
"neighborhood", 
"reserved_community_type_name",
"url_slug",
"units_summarized",
"images",
"multiselect_questions",
"jurisdiction",
"reserved_community_type",
"units",
"building_address",
"features",
"utilities",
null, -- leasing_agents; not available in base view and probably not useful anyway
true
FROM "external_listings"`

const viewQuery = `(
  ${localSelect}
) UNION (
  ${externalSelect}
)`

/**
 * This entity is only used to generate the combined_listings view
 * REMOVE_WHEN_EXTERNAL_NOT_NEEDED
 */
@ViewEntity({ name: "combined_listings", expression: viewQuery })
export class CombinedListing {
  @ViewColumn()
  @PrimaryColumn()
  id: string

  @ViewColumn()
  assets: AssetCreateDto[]

  @ViewColumn({ name: "household_size_min" })
  houseHoldSizeMin: number

  @ViewColumn({ name: "household_size_max" })
  houseHoldSizeMax: number

  @ViewColumn({ name: "units_available" })
  unitsAvailable: number

  @ViewColumn({ name: "application_due_date" })
  applicationDueDate: Date

  @ViewColumn({ name: "application_open_date" })
  applicationOpenDate: Date

  @ViewColumn()
  name: string

  @ViewColumn({ name: "waitlist_current_size" })
  waitlistCurrentSize: number

  @ViewColumn({ name: "waitlist_max_size" })
  waitlistMaxSize: number

  @ViewColumn({ name: "is_waitlist_open" })
  isWaitlistOpen: boolean

  @ViewColumn()
  status: ListingStatus

  @ViewColumn({ name: "review_order_type" })
  reviewOrderType: ListingReviewOrder

  @ViewColumn({ name: "published_at" })
  publishedAt: Date

  @ViewColumn({ name: "closed_at" })
  closedAt: Date

  @ViewColumn({ name: "updated_at" })
  updatedAt: Date

  @ViewColumn({ name: "last_application_update_at" })
  lastApplicationUpdateAt: Date

  @ViewColumn()
  county: string

  @ViewColumn()
  city: string

  @ViewColumn()
  neighborhood: string

  @ViewColumn({ name: "reserved_community_type_name" })
  reservedCommunityTypeName: string

  @ViewColumn({ name: "url_slug" })
  urlSlug: string

  @ViewColumn({ name: "units_summarized" })
  units?: Unit[]

  @ViewColumn({ name: "units_summarized" })
  unitsSummarized?: UnitsSummarized

  @ViewColumn()
  images?: ListingImage[] | null

  @ViewColumn({ name: "multiselect_questions" })
  multiselectQuestions?: ListingMultiselectQuestion[]

  @ViewColumn()
  jurisdiction: Jurisdiction

  @ViewColumn({ name: "reserved_community_type" })
  reservedCommunityType?: ReservedCommunityType

  @ViewColumn({ name: "building_address" })
  buildingAddress: Address

  @ViewColumn()
  features?: ListingFeatures

  @ViewColumn()
  utilities?: ListingUtilities

  @ViewColumn({ name: "leasing_agents" })
  leasingAgents: User[]

  @ViewColumn({ name: "is_external" })
  isExternal: boolean
}
