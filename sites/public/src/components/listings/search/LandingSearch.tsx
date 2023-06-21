import React, { useEffect, useState } from "react"
import { ListingSearchParams, buildSearchString } from "../../../lib/listings/search"
import {
  Modal,
  ButtonGroup,
  FieldGroup,
  FieldSingle,
  Card,
  Button,
  ButtonGroupSpacing,
  Field,
  AppearanceSizeType,
} from "@bloom-housing/doorway-ui-components"
import { useForm } from "react-hook-form"
import { LinkButton, t } from "@bloom-housing/ui-components"
import styles from "./LandingSearch.module.scss"
import { FormOption } from "./ListingsSearchModal"

type LandingSearchProps = {
  bedrooms: FormOption[]
  counties: FormOption[]
}

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
    minRent: "",
    monthlyRent: "",
    counties: countyLabels,
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

  const mkCountyFields = (counties: FormOption[]): FieldSingle[] => {
    const countyFields: FieldSingle[] = [] as FieldSingle[]

    const selected = {}

    formValues.counties.forEach((label) => {
      selected[label] = true
    })
    let check = false
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
        note: county.labelNoteHTML || "",
      } as FieldSingle)
    })
    return countyFields
  }
  const countyFields = mkCountyFields(props.counties)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm()
  return (
    <Card className="bg-accent-cool-light">
      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.bedrooms")}</div>
        <ButtonGroup
          name="bedrooms"
          options={props.bedrooms}
          onChange={updateValue}
          value={formValues.bedrooms}
          className="bg-accent-cool-light py-0 px-0 md:pl-12 landing-search-button-group"
          spacing={ButtonGroupSpacing.left}
        />
      </div>

      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.maxMonthlyRent")}</div>
        <Field
          type="text"
          name="monthlyRent"
          defaultValue={formValues.monthlyRent}
          placeholder="$"
          className="doorway-field p-0 md:pl-6"
          inputClassName="rent-input"
          labelClassName="input-label"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            updateValue("monthlyRent", e.currentTarget.value)
          }}
        />
      </div>

      <div className={styles["input-section"]}>
        <div className={styles["input-section_title"]}>{t("t.counties")}</div>
        <FieldGroup
          name="counties"
          fields={countyFields}
          onChange={updateValueMulti}
          register={register}
          fieldGroupClassName="county-checkbox-group grid grid-cols-2 md:pl-16 "
          fieldLabelClassName="text-primary-dark font-medium tracking-wider text-2xs uppercase"
        />
      </div>

      <div className="flex justify-start p-2">
        <LinkButton
          href={createListingsUrl(formValues)}
          className="is-primary is-borderless bg-primary-dark text-3xs md:text-xs text-white mr-8"
          size={AppearanceSizeType.small}
        >
          {t("nav.viewListings")}
        </LinkButton>

        <Button
          className="is-borderless is-inline is-unstyled underline text-primary-lighter uppercase tracking-widest text-3xs md:text-xs"
          size={AppearanceSizeType.small}
          onClick={() => {
            setOpenCountyMapModal(!openCountyMapModal)
          }}
        >
          {t("welcome.viewCountyMap")}
        </Button>
      </div>

      <Modal
        open={openCountyMapModal}
        title={t("welcome.bayAreaCountyMap")}
        headerClassNames="text-primary-dark text-2xl font-medium"
        ariaDescription={t("welcome.bayAreaCountyMap")}
        onClose={() => setOpenCountyMapModal(!openCountyMapModal)}
      >
        <img src={"images/county-map.png"} alt={t("welcome.bayAreaCountyMap")} />
      </Modal>
    </Card>
  )
}
