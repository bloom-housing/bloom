import React, { useEffect, useState } from "react"
import { FieldGroup, t } from "@bloom-housing/ui-components"
import { Map, LatitudeLongitude } from "@bloom-housing/shared-helpers"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext, useWatch } from "react-hook-form"
import { GeocodeService as GeocodeServiceType } from "@mapbox/mapbox-sdk/services/geocoding"

interface MapBoxFeature {
  center: number[] // Index 0: longitude, Index 1: latitude
}

interface MapboxApiResponseBody {
  features: MapBoxFeature[]
}

interface MapboxApiResponse {
  body: MapboxApiResponseBody
}

interface BuildingAddress {
  city: string
  state: string
  street: string
  zipCode: string
  longitude?: number
  latitude?: number
}

type MultiselectQuestionsMapProps = {
  geocodingClient: GeocodeServiceType
  dataKey: string
}

const MultiselectQuestionsMap = ({ geocodingClient, dataKey }: MultiselectQuestionsMapProps) => {
  const [customMapPositionChosen, setCustomMapPositionChosen] = useState(true)
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, getValues, setValue, watch } = formMethods

  const buildingAddress: BuildingAddress = useWatch({
    control,
    name: `${dataKey}-address`,
  })
  const mapPinPosition = useWatch({
    control,
    name: `${dataKey}-mapPinPosition`,
  })

  const [latLong, setLatLong] = useState<LatitudeLongitude>({
    latitude: buildingAddress?.latitude ?? null,
    longitude: buildingAddress?.longitude ?? null,
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

  if (
    getValues(`${dataKey}-address.latitude`) !== latLong.latitude ||
    getValues(`${dataKey}-address.longitude`) !== latLong.longitude
  ) {
    setValue(`${dataKey}-address.latitude`, latLong.latitude)
    setValue(`${dataKey}-address.longitude`, latLong.longitude)
  }

  useEffect(() => {
    if (watch(dataKey)) {
      register(`${dataKey}-address.longitude`)
      register(`${dataKey}-address.latitude`)
    }
  }, [dataKey, register, setValue, watch])

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

  return (
    <>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("listings.mapPreview")}>
            {displayMapPreview() ? (
              <Map
                address={{
                  city: buildingAddress.city,
                  state: buildingAddress.state,
                  street: buildingAddress.street,
                  zipCode: buildingAddress.zipCode,
                  latitude: buildingAddress.latitude,
                  longitude: buildingAddress.longitude,
                }}
                enableCustomPinPositioning={mapPinPosition === "custom"}
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
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <p className="field-label m-4 ml-0">{t("listings.mapPinPosition")}</p>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldGroup
            name={`${dataKey}-mapPinPosition`}
            type="radio"
            fieldGroupClassName={"flex-col"}
            fieldClassName={"ml-0"}
            register={register}
            fields={[
              {
                label: t("t.automatic"),
                value: "automatic",
                id: `${dataKey}-mapPinPosition-automatic`,
                note: t("listings.mapPinAutomaticDescription"),
                defaultChecked: mapPinPosition === "automatic" || mapPinPosition === undefined,
              },
              {
                label: t("t.custom"),
                value: "custom",
                id: `${dataKey}-mapPinPosition-custom`,
                note: t("listings.mapPinCustomDescription"),
                defaultChecked: mapPinPosition === "custom",
              },
            ]}
          />
        </Grid.Cell>
      </Grid.Row>
    </>
  )
}

export default MultiselectQuestionsMap
