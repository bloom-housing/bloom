import React, { useState, useCallback } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  ViewItem,
  Select,
  stateKeys,
  Viewport,
  FieldGroup,
} from "@bloom-housing/ui-components"
import MapGL, { Marker } from "react-map-gl"

const BuildingDetails = () => {
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

  console.log(buildingAddress)

  const mapPinPosition = useWatch({
    control,
    name: "mapPinPosition",
  })

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    viewport.width = "100%"
    viewport.height = 400
    setViewport({ ...viewport })
  }

  const [viewport, setViewport] = useState({
    latitude: null,
    longitude: null,
    zoom: 13,
    width: "100%",
    height: 400,
  } as Viewport)

  const [marker, setMarker] = useState({
    latitude: null,
    longitude: null,
  })

  const [events, logEvents] = useState({})

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }))
  }, [])

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }))
  }, [])

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }))
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    })
  }, [])

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
      {buildingAddress.city &&
        buildingAddress.state &&
        buildingAddress.street &&
        buildingAddress.zipCode && (
          <GridSection columns={3}>
            <GridCell span={2}>
              <ViewItem label={"Map Preview"} />
              <MapGL
                mapboxApiAccessToken={process.env.mapBoxToken || process.env.MAPBOX_TOKEN}
                width="100%"
                height="100%"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                scrollZoom={false}
                onViewportChange={onViewportChange}
                {...viewport}
              >
                <Marker
                  latitude={marker.latitude}
                  longitude={marker.longitude}
                  offsetTop={-20}
                  draggable={mapPinPosition === "custom"}
                  onDragStart={onMarkerDragStart}
                  onDrag={onMarkerDrag}
                  onDragEnd={onMarkerDragEnd}
                >
                  <div className="pin"></div>
                </Marker>
              </MapGL>
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
                      // defaultChecked: !lotteryEvent,
                    },
                    {
                      label: "Custom",
                      value: "custom",
                      id: "custom",
                      note: "Drag the pin to update the marker location",
                      // defaultChecked: lotteryEvent !== null && lotteryEvent !== undefined,
                    },
                  ]}
                />
              </GridCell>
            </GridCell>
          </GridSection>
        )}
    </GridSection>
  )
}

export default BuildingDetails
