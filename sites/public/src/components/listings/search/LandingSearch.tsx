import React, { useState, useEffect, ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { FilterAvailabilityEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  ButtonGroup,
  FieldGroup,
  FieldSingle,
  ButtonGroupSpacing,
  Field,
} from "@bloom-housing/doorway-ui-components"
import { t, Card } from "@bloom-housing/ui-components"
import { numericSearchFieldGenerator } from "./helpers"
import styles from "./LandingSearch.module.scss"
import { FormOption } from "./ListingsSearchModal"
import { ListingSearchParams, buildSearchString } from "../../../lib/listings/search"

type LandingSearchProps = {
  bedrooms: FormOption[]
  counties: FormOption[]
}
// TODO: Refactor LandingSearch to utilize react-hook-form. It is currently using a custom form object and custom valueSetters
// which is mostly functional but fails to leverage UI-C's formatting, accessibility and any other future improvements to the
// package. To expedite development and avoid excessive workarounds (ie. line 121), a full form refactor should be completed.
export function LandingSearch(props: LandingSearchProps) {
  // We hold a map of county label to county FormOption
  const countyLabelMap = {}
  const countyLabels = []
  props.counties.forEach((county) => {
    countyLabelMap[county.label] = county
    countyLabels.push(county.label)
  })

  const nullState: ListingSearchParams = {
    bedrooms: null,
    bathrooms: null,
    availability: null,
    minRent: "",
    monthlyRent: "",
    propertyName: "",
    counties: countyLabels,
    ids: null,
  }
  const initialState = nullState
  const [formValues, setFormValues] = useState(initialState)
  const [openCountyMapModal, setOpenCountyMapModal] = useState(false)

  const createListingsUrl = (formValues: ListingSearchParams) => {
    const searchUrl = buildSearchString(formValues)
    return "/listings?search=" + searchUrl
  }

  const updateValue = (name: string, value: string) => {
    // Create a copy of the current value to ensure re-render
    const newValues = {} as ListingSearchParams
    Object.assign(newValues, formValues)
    newValues[name] = value
    setFormValues(newValues)
    // console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  const updateValueMulti = (name: string, labels: string[]) => {
    const newValues = { ...formValues } as ListingSearchParams
    newValues[name] = labels
    setFormValues(newValues)
    // console.log(`${name} has been set to ${value}`) // uncomment to debug
  }

  const translatedBedroomOptions: FormOption[] = [
    {
      label: t("listings.unitTypes.any"),
      value: null,
    },
    {
      label: t("listings.unitTypes.studio"),
      value: "0",
    },
  ]
  const bedroomOptions: FormOption[] = [
    ...translatedBedroomOptions,
    ...numericSearchFieldGenerator(1, 3),
  ]

  const mkCountyFields = (counties: FormOption[]): FieldSingle[] => {
    const countyFields: FieldSingle[] = [] as FieldSingle[]

    const selected = {}

    formValues.counties.forEach((label) => {
      selected[label] = true
    })
    let check = false
    const dahliaNote = `(${t(
      "filter.goToDahlia"
    )} <a class="lined" href="https://housing.sfgov.org/" target="_blank">DAHLIA</a>)`

    counties.forEach((county, idx) => {
      // FieldGroup uses the label attribute to check for selected inputs.
      check = selected[county.label] !== undefined
      if (county.isDisabled) {
        check = false
      }
      countyFields.push({
        id: `county-item-${idx}`,
        index: idx,
        label: county.label,
        value: county.value,
        defaultChecked: check,
        disabled: county.isDisabled || false,
        doubleColumn: county.doubleColumn || false,
        note: county.label === "San Francisco" ? dahliaNote : county.labelNoteHTML || "",
      } as FieldSingle)
    })
    return countyFields
  }
  const countyFields = mkCountyFields(props.counties)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue, watch } = useForm()

  const validateSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    // handle semicolon by searching text before since removing could lead to missing exact match
    const searchableValue = e.target.value.split(";")[0]
    updateValue("propertyName", searchableValue)
  }

  // workaround to leverage UI-C's currency formatting without full refactor
  const monthlyRentFormatted = watch("monthlyRent")
  useEffect(() => {
    if (monthlyRentFormatted) {
      const currencyFormatting = /,|\.\d{2}/g
      const monthlyRentRaw = monthlyRentFormatted.replaceAll(currencyFormatting, "")
      updateValue("monthlyRent", monthlyRentRaw)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyRentFormatted])

  return (
    <Card className="bg-accent-cool-light">
      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.opportunityType")}</div>
        <ButtonGroup
          name="availability"
          options={[
            { label: t("listings.waitlist.open"), value: FilterAvailabilityEnum.waitlistOpen },
            { label: t("listings.availableUnits"), value: FilterAvailabilityEnum.unitsAvailable },
          ]}
          onChange={updateValue}
          value={formValues.availability}
          className="bg-accent-cool-light pt-2 md:py-0 md:px-0 landing-search-button-group w-full"
          spacing={ButtonGroupSpacing.left}
        />
      </div>
      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.bedrooms")}</div>
        <ButtonGroup
          name="bedrooms"
          options={bedroomOptions}
          onChange={updateValue}
          value={formValues.bedrooms}
          className="bg-accent-cool-light pt-2 md:py-0 md:px-0 landing-search-button-group"
          spacing={ButtonGroupSpacing.left}
        />
      </div>

      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.maxMonthlyRent")}</div>
        <Field
          type="currency"
          id="monthlyRent"
          name="monthlyRent"
          register={register}
          setValue={setValue}
          getValues={getValues}
          defaultValue={formValues.monthlyRent}
          placeholder="$"
          className="doorway-field md:-mt-1"
          inputClassName="typed-input"
          labelClassName="input-label"
        />
      </div>
      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("listings.propertyName")}</div>
        <Field
          type="text"
          id="propertyName"
          name="propertyName"
          subNote={t("listings.propertyName.helper")}
          register={register}
          onChange={validateSearchInput}
          defaultValue={formValues.propertyName}
          className="doorway-field md:-mt-1"
          inputClassName="typed-input"
          labelClassName="input-label"
        />
      </div>

      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.counties")}</div>
        <FieldGroup
          name="counties"
          fields={countyFields}
          onChange={updateValueMulti}
          register={register}
          fieldGroupClassName="county-checkbox-group doorway-field-group grid grid-cols-2 pt-2 md:py-0"
          fieldLabelClassName="text-primary-dark font-medium tracking-wider text-2xs uppercase"
        />
      </div>

      <div className="flex justify-start p-2">
        <Button href={createListingsUrl(formValues)} className="mr-8">
          {t("nav.viewListings")}
        </Button>

        <Button
          className="uppercase tracking-widest text-3xs md:text-xs mt-3"
          onClick={() => {
            setOpenCountyMapModal(!openCountyMapModal)
          }}
          variant={"text"}
        >
          {t("welcome.viewCountyMap")}
        </Button>
      </div>

      <Dialog
        className="listings-search-dialog"
        isOpen={openCountyMapModal}
        onClose={() => setOpenCountyMapModal(!openCountyMapModal)}
        ariaLabelledBy="welcome-bay-area-county-map-header"
      >
        <Dialog.Header id="welcome-bay-area-county-map-header">
          {t("welcome.bayAreaCountyMap")}
        </Dialog.Header>
        <Dialog.Content>
          <img src={"/images/county-map.png"} alt={t("welcome.bayAreaCountyMap")} />
        </Dialog.Content>
      </Dialog>
    </Card>
  )
}
