import React, { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  ViewItem,
  Select,
  FieldGroup,
  ListingMap,
  LatitudeLongitude,
} from "@bloom-housing/ui-components"
import { stateKeys } from "@bloom-housing/shared-helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import GeocodeService, {
  GeocodeService as GeocodeServiceType,
} from "@mapbox/mapbox-sdk/services/geocoding"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"

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
  listing?: FormListing
  latLong?: LatitudeLongitude
  setLatLong?: (latLong: LatitudeLongitude) => void
  customMapPositionChosen?: boolean
  setCustomMapPositionChosen?: (customMapPosition: boolean) => void
}

const BuildingDetails = ({
  listing,
  setLatLong,
  latLong,
  customMapPositionChosen,
  setCustomMapPositionChosen,
}: BuildingDetailsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, getValues, errors, clearErrors } = formMethods

  const [geocodingClient, setGeocodingClient] = useState<GeocodeServiceType>()

  interface BuildingAddress {
    city: string
    state: string
    street: string
    zipCode: string
  }

  const buildingAddress: BuildingAddress = useWatch({
    control,
    name: "buildingAddress",
  })

  const mapPinPosition = useWatch({
    control,
    name: "mapPinPosition",
  })

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

  const getAddressErrorMessage = (fieldKey: string, defaultMessage: string) => {
    return errors?.buildingAddress && !getValues("buildingAddress.street")
      ? t("errors.partialAddress")
      : defaultMessage
  }

  return (
    <GridSection
      grid={false}
      columns={3}
      separator
      title={t("listings.sections.buildingDetailsTitle")}
      description={t("listings.sections.buildingDetailsSubtitle")}
    >
      <GridSection columns={3} subtitle={t("listings.sections.buildingAddress")}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.streetAddress")}
            name={"buildingAddress.street"}
            id={"buildingAddress.street"}
            error={
              !!getAddressErrorMessage(
                "buildingAddress.street",
                fieldMessage(errors?.buildingAddress?.street)
              )
            }
            errorMessage={getAddressErrorMessage(
              "buildingAddress.street",
              fieldMessage(errors?.buildingAddress?.street)
            )}
            placeholder={t("application.contact.streetAddress")}
            inputProps={{
              onChange: () =>
                fieldHasError(errors?.buildingAddress?.street) && clearErrors("buildingAddress"),
            }}
            register={register}
          />
        </GridCell>
        <Field
          label={t("t.neighborhood")}
          name={"neighborhood"}
          id={"neighborhood"}
          placeholder={t("t.neighborhood")}
          register={register}
        />
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.city")}
            name={"buildingAddress.city"}
            id={"buildingAddress.city"}
            error={
              !!getAddressErrorMessage(
                "buildingAddress.city",
                fieldMessage(errors?.buildingAddress?.city)
              )
            }
            errorMessage={getAddressErrorMessage(
              "buildingAddress.city",
              fieldMessage(errors?.buildingAddress?.city)
            )}
            placeholder={t("application.contact.city")}
            inputProps={{
              onChange: () =>
                fieldHasError(errors?.buildingAddress?.city) && clearErrors("buildingAddress"),
            }}
            register={register}
          />
          <p className="field-sub-note">{t("listings.requiredToPublish")}</p>
        </GridCell>
        <GridCell>
          <ViewItem
            label={t("application.contact.state")}
            className={"mb-0"}
            error={fieldHasError(errors?.buildingAddress?.state)}
          >
            <Select
              id={`buildingAddress.state`}
              name={`buildingAddress.state`}
              error={
                !!getAddressErrorMessage(
                  "buildingAddress.state",
                  fieldMessage(errors?.buildingAddress?.state)
                )
              }
              errorMessage={getAddressErrorMessage(
                "buildingAddress.state",
                fieldMessage(errors?.buildingAddress?.state)
              )}
              label={t("application.contact.state")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              inputProps={{
                onChange: () =>
                  fieldHasError(errors?.buildingAddress?.state) && clearErrors("buildingAddress"),
              }}
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <Field
            label={t("application.contact.zip")}
            name={"buildingAddress.zipCode"}
            id={"buildingAddress.zipCode"}
            placeholder={t("application.contact.zip")}
            error={
              !!getAddressErrorMessage(
                "buildingAddress.zipCode",
                fieldMessage(errors?.buildingAddress?.zipCode)
              )
            }
            errorMessage={getAddressErrorMessage(
              "buildingAddress.zipCode",
              fieldMessage(errors?.buildingAddress?.zipCode)
            )}
            inputProps={{
              onChange: () =>
                fieldHasError(errors?.buildingAddress?.zipCode) && clearErrors("buildingAddress"),
            }}
            register={register}
          />
        </GridCell>
        <GridCell span={2}>
          <Field
            label={t("listings.yearBuilt")}
            name={"yearBuilt"}
            id={"yearBuilt"}
            placeholder={t("listings.yearBuilt")}
            type={"number"}
            register={register}
          />
        </GridCell>
      </GridSection>
      <GridSection columns={3}>
        <GridCell span={2}>
          <ViewItem label={t("listings.mapPreview")} />
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
        </GridCell>
        <GridCell>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.mapPinPosition")}</p>
            <FieldGroup
              name="mapPinPosition"
              type="radio"
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
          </GridCell>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default BuildingDetails
