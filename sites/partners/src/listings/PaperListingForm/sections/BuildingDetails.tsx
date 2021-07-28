import React, { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  ViewItem,
  Select,
  stateKeys,
  FieldGroup,
  ListingMap,
  LatitudeLongitude,
} from "@bloom-housing/ui-components"
import { FormListing } from "../index"
import { useEffect } from "react"
const GeocodeService = require("@mapbox/mapbox-sdk/services/geocoding")

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
}

const BuildingDetails = ({ listing, setLatLong, latLong }: BuildingDetailsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control } = formMethods

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
      buildingAddress.city &&
      buildingAddress.state &&
      buildingAddress.street &&
      buildingAddress.zipCode &&
      buildingAddress.zipCode.length === 5
    )
  }

  const geocodingClient = GeocodeService({
    accessToken: process.env.mapBoxToken || process.env.MAPBOX_TOKEN,
  })

  const getNewLatLong = () => {
    if (
      buildingAddress.city &&
      buildingAddress.state &&
      buildingAddress.street &&
      buildingAddress.zipCode &&
      geocodingClient
    ) {
      geocodingClient
        .forwardGeocode({
          query: `${buildingAddress.street}, ${buildingAddress.city}, ${buildingAddress.state}, ${buildingAddress.zipCode}`,
          limit: 1,
        })
        .send()
        .then((response: MapboxApiResponse) => {
          console.log("SETTING LAT LONG FROM USE EFFECT")
          setLatLong({
            latitude: response.body.features[0].center[1],
            longitude: response.body.features[0].center[0],
          })
        })
    }
  }
  useEffect(() => {
    getNewLatLong()
  }, [buildingAddress.city, buildingAddress.state, buildingAddress.street, buildingAddress.zipCode])

  //TODO: On switch to automatic, change lat/long back to address default

  return (
    <GridSection
      grid={false}
      columns={3}
      separator
      title={t("listings.sections.buildingDetailsTitle")}
      description={t("listings.sections.buildingDetailsSubtitle")}
    >
      <GridSection columns={3}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.streetAddress")}
            name={"buildingAddress.street"}
            id={"buildingAddress.street"}
            placeholder={t("application.contact.streetAddress")}
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
            placeholder={t("application.contact.city")}
            register={register}
          />
        </GridCell>
        <ViewItem label={t("application.contact.state")} className="mb-0">
          <Select
            id={`buildingAddress.state`}
            name={`buildingAddress.state`}
            label={t("application.contact.state")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={stateKeys}
            keyPrefix="states"
            errorMessage={t("errors.stateError")}
          />
        </ViewItem>
        <Field
          label={t("application.contact.zip")}
          name={"buildingAddress.zipCode"}
          id={"buildingAddress.zipCode"}
          placeholder={t("application.contact.zip")}
          errorMessage={t("errors.zipCodeError")}
          register={register}
        />
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
          <ViewItem label={"Map Preview"} />
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
              customPinPositioning={mapPinPosition === "custom"}
              setLatLong={setLatLong}
            />
          ) : (
            <div className={"w-full h-64 bg-gray-400 p-3 flex items-center justify-center"}>
              Enter an address to preview the map
            </div>
          )}
        </GridCell>
        <GridCell>
          <GridCell>
            <p className="field-label m-4 ml-0">{"Map Pin Position"}</p>
            <FieldGroup
              name="mapPinPosition"
              type="radio"
              fieldGroupClassName={"flex-col"}
              fieldClassName={"ml-0"}
              register={register}
              fields={[
                {
                  label: "Automatic",
                  value: "automatic",
                  id: "automatic",
                  note: "Map pin position is based on the address provided",
                  defaultChecked: !listing?.buildingAddress, // update me based on new backend field
                },
                {
                  label: "Custom",
                  value: "custom",
                  id: "custom",
                  note: "Drag the pin to update the marker location",
                  defaultChecked: listing && listing.buildingAddress !== undefined, // update me based on new backend field
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
