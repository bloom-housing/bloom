import React, { useContext, useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  Field,
  Select,
  FieldGroup,
  ListingMap,
  LatitudeLongitude,
  GridCell,
} from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext, stateKeys } from "@bloom-housing/shared-helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import GeocodeService, {
  GeocodeService as GeocodeServiceType,
} from "@mapbox/mapbox-sdk/services/geocoding"
import {
  defaultFieldProps,
  fieldHasError,
  fieldIsRequired,
  fieldMessage,
  getAddressErrorMessage,
  getLabel,
} from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  RegionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { neighborhoodRegions } from "../../../../lib/listings/Neighborhoods"
import styles from "../ListingForm.module.scss"

interface MapBoxFeature {
  center: number[] // Index 0: longitude, Index 1: latitude
}

interface MapboxApiResponseBody {
  features: MapBoxFeature[]
}

interface MapboxApiResponse {
  body: MapboxApiResponseBody
}

type BuildingDetailsProps = {
  customMapPositionChosen?: boolean
  jurisdiction: string
  latLong?: LatitudeLongitude
  listing?: FormListing
  requiredFields: string[]
  setCustomMapPositionChosen?: (customMapPosition: boolean) => void
  setLatLong?: (latLong: LatitudeLongitude) => void
}

const BuildingDetails = ({
  customMapPositionChosen,
  jurisdiction,
  latLong,
  listing,
  requiredFields,
  setCustomMapPositionChosen,
  setLatLong,
}: BuildingDetailsProps) => {
  const formMethods = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, getValues, setValue, errors, clearErrors } = formMethods

  const [geocodingClient, setGeocodingClient] = useState<GeocodeServiceType>()

  interface BuildingAddress {
    city: string
    state: string
    street: string
    zipCode: string
  }

  const buildingAddress: BuildingAddress = useWatch({
    control,
    name: "listingsBuildingAddress",
  })

  const mapPinPosition = useWatch({
    control,
    name: "mapPinPosition",
  })

  const listingType = useWatch({
    control,
    name: "listingType",
  })

  const jurisdiction = watch("jurisdictions.id")

  const displayMapPreview = () => {
    return (
      buildingAddress?.city &&
      buildingAddress?.state &&
      buildingAddress?.street &&
      buildingAddress?.zipCode &&
      buildingAddress?.zipCode.length >= 5
    )
  }

  useEffect(() => {
    if (process.env.mapBoxToken || process.env.MAPBOX_TOKEN) {
      setGeocodingClient(
        GeocodeService({
          accessToken: process.env.mapBoxToken || process.env.MAPBOX_TOKEN,
        })
      )
    }
  }, [])

  const getNewLatLong = () => {
    if (
      buildingAddress?.city &&
      buildingAddress?.state &&
      buildingAddress?.street &&
      buildingAddress?.zipCode &&
      geocodingClient
    ) {
      geocodingClient
        .forwardGeocode({
          query: `${buildingAddress.street}, ${buildingAddress.city}, ${buildingAddress.state}, ${buildingAddress.zipCode}`,
          limit: 1,
        })
        .send()
        .then((response: MapboxApiResponse) => {
          setLatLong({
            latitude: response.body.features[0].center[1],
            longitude: response.body.features[0].center[0],
          })
        })
        .catch((err) => console.error(`Error calling Mapbox API: ${err}`))
    }
  }

  useEffect(() => {
    let timeout
    if (!customMapPositionChosen || mapPinPosition === "automatic") {
      timeout = setTimeout(() => {
        getNewLatLong()
      }, 1000)
    }
    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    buildingAddress?.city,
    buildingAddress?.state,
    buildingAddress?.street,
    buildingAddress?.zipCode,
  ])

  useEffect(() => {
    if (mapPinPosition === "automatic") {
      getNewLatLong()
      setCustomMapPositionChosen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapPinPosition])

  const { neighborhood, region } = watch(["neighborhood", "region"])

  const enableRegions = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableRegions,
    jurisdiction
  )

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    jurisdiction
  )

  useEffect(() => {
    const matchingConfig = neighborhoodRegions.find((entry) => entry.name == neighborhood)
    if (matchingConfig && matchingConfig.region !== region) {
      setValue("region", matchingConfig.region)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neighborhood, setValue])

  const getError = (subfield: string) => {
    return getAddressErrorMessage(
      `listingsBuildingAddress.${subfield}`,
      "listingsBuildingAddress",
      fieldMessage(
        errors?.listingsBuildingAddress ? errors?.listingsBuildingAddress[subfield] : null
      ),
      errors,
      getValues
    )
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.buildingDetailsTitle")}
        subheading={t("listings.sections.buildingDetailsSubtitle")}
      >
        <SectionWithGrid.HeadingRow>
          {t("listings.sections.buildingAddress")}
        </SectionWithGrid.HeadingRow>
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Field
              label={getLabel(
                "listingsBuildingAddress",
                requiredFields,
                t("application.contact.streetAddress")
              )}
              name={"listingsBuildingAddress.street"}
              id={"listingsBuildingAddress.street"}
              error={!!getError("street")}
              errorMessage={getError("street")}
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.listingsBuildingAddress?.street) &&
                  clearErrors("listingsBuildingAddress"),
                "aria-required": fieldIsRequired("listingsBuildingAddress", requiredFields),
              }}
              register={register}
            />
          </Grid.Cell>
          <GridCell>
            {enableRegions ? (
              <Select
                controlClassName="control"
                register={register}
                options={[
                  { value: "", label: t("listings.sections.neighborhoodPlaceholder") },
                  ...neighborhoodRegions.map((entry) => ({
                    value: entry.name,
                    label: entry.name,
                  })),
                ]}
                {...defaultFieldProps(
                  "neighborhood",
                  t("t.neighborhood"),
                  requiredFields,
                  errors,
                  clearErrors
                )}
              />
            ) : (
              <Field
                register={register}
                {...defaultFieldProps(
                  "neighborhood",
                  t("t.neighborhood"),
                  requiredFields,
                  errors,
                  clearErrors
                )}
              />
            )}
          </GridCell>
        </Grid.Row>
        <Grid.Row columns={6}>
          <Grid.Cell className={"seeds-grid-span-2"}>
            <Field
              label={getLabel(
                "listingsBuildingAddress",
                requiredFields,
                t("application.contact.city")
              )}
              name={"listingsBuildingAddress.city"}
              id={"listingsBuildingAddress.city"}
              error={!!getError("city")}
              errorMessage={getError("city")}
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.listingsBuildingAddress?.city) &&
                  clearErrors("listingsBuildingAddress"),
                "aria-required": fieldIsRequired("listingsBuildingAddress", requiredFields),
              }}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Select
              id={`listingsBuildingAddress.state`}
              name={`listingsBuildingAddress.state`}
              error={!!getError("state")}
              errorMessage={getError("state")}
              label={getLabel(
                "listingsBuildingAddress",
                requiredFields,
                t("application.contact.state")
              )}
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.listingsBuildingAddress?.state) &&
                  clearErrors("listingsBuildingAddress"),
                "aria-required": fieldIsRequired("listingsBuildingAddress", requiredFields),
              }}
            />
          </Grid.Cell>
          <Grid.Cell>
            <Field
              label={getLabel(
                "listingsBuildingAddress",
                requiredFields,
                t("application.contact.zip")
              )}
              name={"listingsBuildingAddress.zipCode"}
              id={"listingsBuildingAddress.zipCode"}
              error={!!getError("zipCode")}
              errorMessage={getError("zipCode")}
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.listingsBuildingAddress?.zipCode) &&
                  clearErrors("listingsBuildingAddress"),
                "aria-required": fieldIsRequired("listingsBuildingAddress", requiredFields),
              }}
              register={register}
            />
          </Grid.Cell>
          <Grid.Cell className="seeds-grid-span-2">
            {enableRegions ? (
              <Select
                register={register}
                controlClassName="control"
                options={[
                  { value: "", label: t("listings.sections.regionPlaceholder") },
                  ...Object.keys(RegionEnum).map((entry) => ({
                    value: entry,
                    label: entry.toString().replace("_", " "),
                  })),
                ]}
                {...defaultFieldProps("region", t("t.region"), requiredFields, errors, clearErrors)}
              />
            ) : (
              (listingType === EnumListingListingType.regulated || !enableNonRegulatedListings) && (
                <Field
                  type={"number"}
                  register={register}
                  {...defaultFieldProps(
                    "yearBuilt",
                    t("listings.yearBuilt"),
                    requiredFields,
                    errors,
                    clearErrors
                  )}
                />
              )
            )}
          </Grid.Cell>
        </Grid.Row>
        {enableRegions &&
          (listingType === EnumListingListingType.regulated || !enableNonRegulatedListings) && (
            <Grid.Row columns={3}>
              <Grid.Cell>
                <Field
                  type={"number"}
                  register={register}
                  {...defaultFieldProps(
                    "yearBuilt",
                    t("listings.yearBuilt"),
                    requiredFields,
                    errors,
                    clearErrors
                  )}
                />
              </Grid.Cell>
            </Grid.Row>
          )}
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <FieldValue label={t("listings.mapPreview")} className={styles["custom-label"]}>
              {displayMapPreview() ? (
                <ListingMap
                  listingName={listing?.name}
                  address={{
                    city: buildingAddress.city,
                    state: buildingAddress.state,
                    street: buildingAddress.street,
                    zipCode: buildingAddress.zipCode,
                    latitude: latLong.latitude,
                    longitude: latLong.longitude,
                  }}
                  enableCustomPinPositioning={getValues("mapPinPosition") === "custom"}
                  setCustomMapPositionChosen={setCustomMapPositionChosen}
                  setLatLong={setLatLong}
                />
              ) : (
                <div
                  className={"w-full bg-gray-400 p-3 flex items-center justify-center"}
                  style={{ height: "400px" }}
                >
                  {t("listings.mapPreviewNoAddress")}
                </div>
              )}
            </FieldValue>
          </Grid.Cell>
          <Grid.Cell>
            <FieldGroup
              name="mapPinPosition"
              type="radio"
              groupLabel={t("listings.mapPinPosition")}
              fieldLabelClassName={styles["label-option"]}
              fieldGroupClassName={"flex-col"}
              fieldClassName={"ml-0"}
              register={register}
              fields={[
                {
                  label: t("t.automatic"),
                  value: "automatic",
                  id: "automatic",
                  note: t("listings.mapPinAutomaticDescription"),
                  defaultChecked: !listing?.customMapPin,
                },
                {
                  label: t("t.custom"),
                  value: "custom",
                  id: "custom",
                  note: t("listings.mapPinCustomDescription"),
                  defaultChecked: listing?.customMapPin,
                },
              ]}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default BuildingDetails
