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
  SelectOption,
} from "@bloom-housing/ui-components"
import { stateKeys } from "@bloom-housing/shared-helpers"
import { FormListing } from "../formTypes"
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

const neighborhoodOptions: SelectOption[] = [
  { value: "", label: "" },
  { value: "Airport Sub", label: "Airport Sub" },
  { value: "Arden Park", label: "Arden Park" },
  { value: "Aviation Sub", label: "Aviation Sub" },
  { value: "Bagley", label: "Bagley" },
  { value: "Barton-McFarland", label: "Barton-McFarland" },
  { value: "Belle Isle", label: "Belle Isle" },
  { value: "Belmont", label: "Belmont" },
  { value: "Berg-Lahser", label: "Berg-Lahser" },
  { value: "Bethune Community", label: "Bethune Community" },
  { value: "Boston Edison", label: "Boston Edison" },
  { value: "Boynton", label: "Boynton" },
  { value: "Brewster Homes", label: "Brewster Homes" },
  { value: "Brightmoor", label: "Brightmoor" },
  { value: "Brush Park", label: "Brush Park" },
  { value: "Buffalo Charles", label: "Buffalo Charles" },
  { value: "Butler", label: "Butler" },
  { value: "Cadillac Community", label: "Cadillac Community" },
  { value: "Cadillac Heights", label: "Cadillac Heights" },
  { value: "Campau/Banglatown", label: "Campau/Banglatown" },
  { value: "Carbon Works", label: "Carbon Works" },
  { value: "Castle Rouge", label: "Castle Rouge" },
  { value: "Central Southwest", label: "Central Southwest" },
  { value: "Chadsey Condon", label: "Chadsey Condon" },
  { value: "Chalfonte", label: "Chalfonte" },
  { value: "Chandler Park-Chalmers Webpage", label: "Chandler Park-Chalmers Webpage" },
  { value: "Chandler Park", label: "Chandler Park" },
  { value: "Claytown", label: "Claytown" },
  { value: "College Park", label: "College Park" },
  { value: "Conant Gardens", label: "Conant Gardens" },
  { value: "Conner Creek", label: "Conner Creek" },
  { value: "Conner Creek Industrial", label: "Conner Creek Industrial" },
  { value: "Core City", label: "Core City" },
  { value: "Corktown", label: "Corktown" },
  { value: "Cornerstone Village", label: "Cornerstone Village" },
  { value: "Crary/St Marys", label: "Crary/St Marys" },
  { value: "Cultural Center", label: "Cultural Center" },
  { value: "Davison", label: "Davison" },
  { value: "Davison-Schoolcraft", label: "Davison-Schoolcraft" },
  { value: "Delray", label: "Delray" },
  { value: "Denby", label: "Denby" },
  { value: "Detroit Golf", label: "Detroit Golf" },
  { value: "Dexter-Fenkell", label: "Dexter-Fenkell" },
  { value: "Dexter-Linwood", label: "Dexter-Linwood" },
  { value: "Douglass", label: "Douglass" },
  { value: "Downtown", label: "Downtown" },
  { value: "East Canfield", label: "East Canfield" },
  { value: "East English Village", label: "East English Village" },
  { value: "East Village", label: "East Village" },
  { value: "Eastern Market", label: "Eastern Market" },
  { value: "Eden Garden", label: "Eden Garden" },
  { value: "Elijah McCoy", label: "Elijah McCoy" },
  { value: "Eliza Howell", label: "Eliza Howell" },
  { value: "Elmwood Park", label: "Elmwood Park" },
  { value: "Evergreen Lahser", label: "Evergreen Lahser" },
  { value: "Evergreen-Outer Drive", label: "Evergreen-Outer Drive" },
  { value: "Far West Detroit", label: "Far West Detroit" },
  { value: "Fiskhorn", label: "Fiskhorn" },
  { value: "Fitzgerald/Marygrove", label: "Fitzgerald/Marygrove" },
  { value: "Five Points", label: "Five Points" },
  { value: "Forest Park", label: "Forest Park" },
  { value: "Fox Creek", label: "Fox Creek" },
  { value: "Franklin", label: "Franklin" },
  { value: "Franklin Park", label: "Franklin Park" },
  { value: "Garden Homes", label: "Garden Homes" },
  { value: "Garden View", label: "Garden View" },
  { value: "Gateway Community", label: "Gateway Community" },
  { value: "Gold Coast", label: "Gold Coast" },
  { value: "Grand River-I96", label: "Grand River-I96" },
  { value: "Grand River-St Marys", label: "Grand River-St Marys" },
  { value: "Grandmont", label: "Grandmont" },
  { value: "Grandmont #1", label: "Grandmont #1" },
  { value: "Grant", label: "Grant" },
  { value: "Gratiot-Grand", label: "Gratiot-Grand" },
  { value: "Gratiot Town/Kettering", label: "Gratiot Town/Kettering" },
  { value: "Gratiot-Findlay Webpage", label: "Gratiot-Findlay Webpage" },
  { value: "Gratiot Woods", label: "Gratiot Woods" },
  { value: "Greektown", label: "Greektown" },
  { value: "Green Acres", label: "Green Acres" },
  { value: "Greenfield", label: "Greenfield" },
  { value: "Greenfield-Grand River", label: "Greenfield-Grand River" },
  { value: "Greenfield Park", label: "Greenfield Park" },
  { value: "Grixdale Farms", label: "Grixdale Farms" },
  { value: "Happy Homes", label: "Happy Homes" },
  { value: "Harmony Village", label: "Harmony Village" },
  { value: "Hawthorne Park", label: "Hawthorne Park" },
  { value: "Historic Atkinson", label: "Historic Atkinson" },
  { value: "Holcomb Community", label: "Holcomb Community" },
  { value: "Hubbard Farms", label: "Hubbard Farms" },
  { value: "Hubbard Richard", label: "Hubbard Richard" },
  { value: "Hubbell-Lyndon", label: "Hubbell-Lyndon" },
  { value: "Hubbell-Puritan", label: "Hubbell-Puritan" },
  { value: "Indian Village", label: "Indian Village" },
  { value: "Islandview", label: "Islandview" },
  { value: "Jamison", label: "Jamison" },
  { value: "Jefferson Chalmers", label: "Jefferson Chalmers" },
  { value: "Jeffries", label: "Jeffries" },
  { value: "Joseph Berry Sub", label: "Joseph Berry Sub" },
  { value: "Joy Community", label: "Joy Community" },
  { value: "Joy-Schaefer", label: "Joy-Schaefer" },
  { value: "LaSalle Gardens", label: "LaSalle Gardens" },
  { value: "LaSalle College Park", label: "LaSalle College Park" },
  { value: "Lafayette Park", label: "Lafayette Park" },
  { value: "Littlefield Community", label: "Littlefield Community" },
  { value: "Mapleridge", label: "Mapleridge" },
  { value: "Marina District", label: "Marina District" },
  { value: "Martin Park", label: "Martin Park" },
  { value: "McDougall-Hunt", label: "McDougall-Hunt" },
  { value: "McNichols Evergreen", label: "McNichols Evergreen" },
  { value: "Medbury Park", label: "Medbury Park" },
  { value: "Medical Center", label: "Medical Center" },
  { value: "Melvern Hill", label: "Melvern Hill" },
  { value: "Mexicantown", label: "Mexicantown" },
  { value: "Michigan-Martin", label: "Michigan-Martin" },
  { value: "Midtown", label: "Midtown" },
  { value: "Midwest", label: "Midwest" },
  { value: "Miller Grove", label: "Miller Grove" },
  { value: "Milwaukee Junction", label: "Milwaukee Junction" },
  { value: "Minock Park", label: "Minock Park" },
  { value: "Mohican Regent", label: "Mohican Regent" },
  { value: "Morningside", label: "Morningside" },
  { value: "Moross-Morang", label: "Moross-Morang" },
  { value: "Mount Olivet", label: "Mount Olivet" },
  { value: "NW Goldberg", label: "NW Goldberg" },
  { value: "Nardin Park", label: "Nardin Park" },
  { value: "New Center", label: "New Center" },
  { value: "New Center Commons", label: "New Center Commons" },
  { value: "Nolan", label: "Nolan" },
  { value: "North Campau", label: "North Campau" },
  { value: "North Corktown", label: "North Corktown" },
  { value: "North End", label: "North End" },
  { value: "North Rosedale Park", label: "North Rosedale Park" },
  { value: "Northeast Central District", label: "Northeast Central District" },
  { value: "Northwest Community Webpage", label: "Northwest Community Webpage" },
  { value: "Nortown", label: "Nortown" },
  { value: "Oak Grove", label: "Oak Grove" },
  { value: "Oakman Blvd Community", label: "Oakman Blvd Community" },
  { value: "Oakwood Heights", label: "Oakwood Heights" },
  { value: "O'Hair Park", label: "O'Hair Park" },
  { value: "Old Redford", label: "Old Redford" },
  { value: "Other", label: "Other" },
  { value: "Outer Drive-Hayes", label: "Outer Drive-Hayes" },
  { value: "Palmer Park", label: "Palmer Park" },
  { value: "Palmer Woods", label: "Palmer Woods" },
  { value: "Paveway", label: "Paveway" },
  { value: "Penrose", label: "Penrose" },
  { value: "Pershing", label: "Pershing" },
  { value: "Petsokey-Otsego", label: "Petsokey-Otsego" },
  { value: "Piety Hill", label: "Piety Hill" },
  { value: "Pilgrim Village", label: "Pilgrim Village" },
  { value: "Pingree Park", label: "Pinegree Park" },
  { value: "Plymouth-Hubbell", label: "Plymouth-Hubbell" },
  { value: "Plymouth-I96", label: "Plymouth-I96" },
  { value: "Poletown East", label: "Poletown East" },
  { value: "Pride Area Community Webpage", label: "Pride Area Community Webpage" },
  { value: "Pulaski", label: "Pulaski" },
  { value: "Ravendale", label: "Ravendale" },
  { value: "Regent Park", label: "Regent Park" },
  { value: "Riverbend", label: "Riverbend" },
  { value: "Riverdale", label: "Riverdale" },
  { value: "Rivertown", label: "Rivertown" },
  { value: "Rosedale Park", label: "Rosedale Park" },
  { value: "Rouge Park", label: "Rouge Park" },
  { value: "Russell Industrial", label: "Russell Industrial" },
  { value: "Russell Woods", label: "Russell Woods" },
  { value: "San Bernardo", label: "San Bernardo" },
  { value: "Schaefer 7/8 Lodge", label: "Schaefer 7/8 Lodge" },
  { value: "Schoolcraft Southfield", label: "Schoolcraft Southfield" },
  { value: "Seven Mile-Rouge", label: "Seven Mile-Rouge" },
  { value: "Seven Mile Lodge", label: "Seven Mile Lodge" },
  { value: "Sherwood", label: "Sherwood" },
  { value: "Sherwood Forest", label: "Sherwood Forest" },
  { value: "South of Six", label: "South of Six" },
  { value: "Southfield Plymouth", label: "Southfield Plymouth" },
  { value: "Springwells", label: "Springwells" },
  { value: "State Fair", label: "State Fair" },
  { value: "Tech Town", label: "Tech Town" },
  { value: "The Eye", label: "The Eye" },
  { value: "Tri-Point", label: "Tri-Point" },
  { value: "University District", label: "University District" },
  { value: "Virginia Park", label: "Virginia Park" },
  { value: "Virginia Park Community", label: "Virginia Park Community" },
  { value: "Von Steuben", label: "Von Steuben" },
  { value: "Wade", label: "Wade" },
  { value: "Warren Ave Community", label: "Warren Ave Community" },
  { value: "Warrendale", label: "Warrendale" },
  { value: "Waterworks Park", label: "Waterworks Park" },
  { value: "Wayne State", label: "Wayne State" },
  { value: "We Care Community", label: "We Care Community" },
  { value: "Weatherby", label: "Weatherby" },
  { value: "West End", label: "West End" },
  { value: "West Outer Drive", label: "West Outer Drive" },
  { value: "West Side Industrial", label: "West Side Industrial" },
  { value: "West Village", label: "West Village" },
  { value: "Westwood Park", label: "Westwood Park" },
  { value: "Wildemere Park", label: "Wildemere Park" },
  { value: "Winship", label: "Winship" },
  { value: "Woodbridge", label: "Woodbridge" },
  { value: "Yorkshire Woods", label: "Yorkshire Woods" },
]

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
            error={fieldHasError(errors?.buildingAddress?.street)}
            errorMessage={fieldMessage(errors?.buildingAddress?.street)}
            placeholder={t("application.contact.streetAddress")}
            inputProps={{
              onChange: () => clearErrors("buildingAddress.street"),
            }}
            register={register}
            validation={{ required: true }}
          />
        </GridCell>
        <ViewItem label={t("t.neighborhood")} className={"mb-0"}>
          <Select
            id="neighborhood"
            name="neighborhood"
            label={t("t.neighborhood")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={neighborhoodOptions}
            keyPrefix="t"
            errorMessage={fieldMessage(errors?.neighborhood)}
            inputProps={{
              onChange: () => clearErrors("neighborhood"),
            }}
          />
        </ViewItem>
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <Field
            label={t("application.contact.city")}
            name={"buildingAddress.city"}
            id={"buildingAddress.city"}
            error={fieldHasError(errors?.buildingAddress?.city)}
            errorMessage={fieldMessage(errors?.buildingAddress?.city)}
            placeholder={t("application.contact.city")}
            inputProps={{
              onChange: () => clearErrors("buildingAddress.city"),
            }}
            register={register}
            validation={{ required: true }}
          />
          <p className="field-sub-note">{t("listings.requiredToPublish")}</p>
        </GridCell>
        <ViewItem
          label={t("application.contact.state")}
          className={"mb-0"}
          error={fieldHasError(errors?.buildingAddress?.state)}
        >
          <Select
            id={`buildingAddress.state`}
            name={`buildingAddress.state`}
            error={fieldHasError(errors?.buildingAddress?.state)}
            label={t("application.contact.state")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={stateKeys}
            keyPrefix="states"
            errorMessage={fieldMessage(errors?.buildingAddress?.state)}
            inputProps={{
              onChange: () => clearErrors("buildingAddress.state"),
            }}
          />
        </ViewItem>
        <Field
          label={t("application.contact.zip")}
          name={"buildingAddress.zipCode"}
          error={fieldHasError(errors?.buildingAddress?.zipCode)}
          id={"buildingAddress.zipCode"}
          placeholder={t("application.contact.zip")}
          errorMessage={fieldMessage(errors?.buildingAddress?.zipCode)}
          inputProps={{
            onChange: () => clearErrors("buildingAddress.zipCode"),
          }}
          register={register}
          validation={{ required: true }}
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
