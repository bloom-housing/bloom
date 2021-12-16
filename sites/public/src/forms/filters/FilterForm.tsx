import { AvailabilityFilterEnum } from "@bloom-housing/backend-core/types"
import {
  t,
  SelectOption,
  Form,
  Select,
  Field,
  Button,
  AppearanceStyleType,
  FrontendListingFilterStateKeys,
  ListingFilterState,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"

const isValidZipCodeOrEmpty = (value: string) => {
  // Empty strings or whitespace are valid and will reset the filter.
  if (!value.trim()) {
    return true
  }
  let returnValue = true
  value.split(",").forEach((element) => {
    if (!/^[0-9]{5}$/.test(element.trim())) {
      returnValue = false
    }
  })
  return returnValue
}

interface FilterFormProps {
  onSubmit: (data: ListingFilterState) => void
  filterState?: ListingFilterState
}

const FilterForm = (props: FilterFormProps) => {
  // TODO: Select options should come from the database (#252)
  const EMPTY_OPTION = { value: "", label: "" }
  const preferredUnitOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "0", label: t("listingFilters.bedroomsOptions.studioPlus") },
    { value: "1", label: t("listingFilters.bedroomsOptions.onePlus") },
    { value: "2", label: t("listingFilters.bedroomsOptions.twoPlus") },
    { value: "3", label: t("listingFilters.bedroomsOptions.threePlus") },
    { value: "4", label: t("listingFilters.bedroomsOptions.fourPlus") },
  ]
  const adaCompliantOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "y", label: t("t.yes") },
    { value: "n", label: t("t.no") },
  ]

  const availabilityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: AvailabilityFilterEnum.hasAvailability, label: t("listingFilters.hasAvailability") },
    { value: AvailabilityFilterEnum.noAvailability, label: t("listingFilters.noAvailability") },
    { value: AvailabilityFilterEnum.waitlist, label: t("listingFilters.waitlist") },
  ]

  const seniorHousingOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "true", label: t("t.yes") },
    { value: "false", label: t("t.no") },
  ]

  const amiOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "20", label: t("listingFilters.minAmiPercentageOptions.amiOption20") },
    { value: "25", label: t("listingFilters.minAmiPercentageOptions.amiOption25") },
    { value: "30", label: t("listingFilters.minAmiPercentageOptions.amiOption30") },
    { value: "35", label: t("listingFilters.minAmiPercentageOptions.amiOption35") },
    { value: "40", label: t("listingFilters.minAmiPercentageOptions.amiOption40") },
    { value: "45", label: t("listingFilters.minAmiPercentageOptions.amiOption45") },
    { value: "50", label: t("listingFilters.minAmiPercentageOptions.amiOption50") },
    { value: "55", label: t("listingFilters.minAmiPercentageOptions.amiOption55") },
    { value: "60", label: t("listingFilters.minAmiPercentageOptions.amiOption60") },
    { value: "70", label: t("listingFilters.minAmiPercentageOptions.amiOption70") },
    { value: "80", label: t("listingFilters.minAmiPercentageOptions.amiOption80") },
    { value: "100", label: t("listingFilters.minAmiPercentageOptions.amiOption100") },
    { value: "120", label: t("listingFilters.minAmiPercentageOptions.amiOption120") },
    { value: "125", label: t("listingFilters.minAmiPercentageOptions.amiOption125") },
    { value: "140", label: t("listingFilters.minAmiPercentageOptions.amiOption140") },
    { value: "150", label: t("listingFilters.minAmiPercentageOptions.amiOption150") },
  ]

  // This is causing a linting issue with unbound-method, see issue:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <div className="form-card__group">
        <Select
          id={"availability"}
          name={FrontendListingFilterStateKeys.availability}
          label={t("listingFilters.availability")}
          register={register}
          controlClassName="control"
          options={availabilityOptions}
          defaultValue={props.filterState?.availability}
          labelClassName="filter-header"
        />
        <label className="field-label filter-header">{t("listingFilters.bedrooms")}</label>
        <div className="flex flex-col bedroom-selector">
          <Field
            id="studio"
            name={FrontendListingFilterStateKeys.studio}
            type="checkbox"
            label={t("listingFilters.bedroomsOptions.studioPlus")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.studio),
            }}
          />
          <Field
            id="oneBdrm"
            name={FrontendListingFilterStateKeys.oneBdrm}
            type="checkbox"
            label={t("listingFilters.bedroomsOptions.onePlus")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.oneBdrm),
            }}
          />
          <Field
            id="twoBdrm"
            name={FrontendListingFilterStateKeys.twoBdrm}
            type="checkbox"
            label={t("listingFilters.bedroomsOptions.twoPlus")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.twoBdrm),
            }}
          />
          <Field
            id="threeBdrm"
            name={FrontendListingFilterStateKeys.threeBdrm}
            type="checkbox"
            label={t("listingFilters.bedroomsOptions.threePlus")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.threeBdrm),
            }}
          />
          <Field
            id="fourPlusBdrm"
            name={FrontendListingFilterStateKeys.fourPlusBdrm}
            type="checkbox"
            label={t("listingFilters.bedroomsOptions.fourPlus")}
            register={register}
            inputProps={{
              defaultChecked: Boolean(props.filterState?.fourPlusBdrm),
            }}
          />
        </div>
        <Field
          id="zipCodeField"
          name={FrontendListingFilterStateKeys.zipcode}
          label={t("listingFilters.zipCode")}
          register={register}
          controlClassName="control"
          placeholder={t("listingFilters.zipCodeDescription")}
          validation={{
            validate: (value) => isValidZipCodeOrEmpty(value),
          }}
          error={errors?.[FrontendListingFilterStateKeys.zipcode]}
          errorMessage={t("errors.multipleZipCodeError")}
          defaultValue={props.filterState?.zipcode}
          className="filter-section"
        />
        <label className="field-label filter-header">{t("listingFilters.rentRange")}</label>
        <div className="flex flex-row rent-range">
          <Field
            id="minRent"
            name={FrontendListingFilterStateKeys.minRent}
            register={register}
            type="number"
            placeholder={t("t.min")}
            prepend="$"
            defaultValue={props.filterState?.minRent}
          />
          <div className="flex items-center px-9">{t("t.to")}</div>
          <Field
            id="maxRent"
            name={FrontendListingFilterStateKeys.maxRent}
            register={register}
            type="number"
            placeholder={t("t.max")}
            prepend="$"
            defaultValue={props.filterState?.maxRent}
          />
        </div>
        <Select
          id="adaCompliant"
          name="adaCompliant"
          label={t("listingFilters.adaCompliant")}
          register={register}
          controlClassName="control"
          options={adaCompliantOptions}
          labelClassName="filter-header"
        />
        <Select
          id="seniorHousing"
          name={FrontendListingFilterStateKeys.seniorHousing}
          label={t("listingFilters.senior")}
          register={register}
          controlClassName="control"
          options={seniorHousingOptions}
          defaultValue={props.filterState?.seniorHousing?.toString()}
          labelClassName="filter-header"
        />
        {/* TODO(#515): Add more explanation and an ami percentage
        calculator to this filter */}
        <Select
          id="amiSelect"
          name={FrontendListingFilterStateKeys.minAmiPercentage}
          label={t("listingFilters.minAmiPercentageLabel")}
          register={register}
          controlClassName="control"
          options={amiOptions}
          defaultValue={props.filterState?.minAmiPercentage?.toString()}
          labelClassName="filter-header"
        />
        <Field
          id="includeNulls"
          name={FrontendListingFilterStateKeys.includeNulls}
          type="checkbox"
          label={t("listingFilters.includeUnknowns")}
          register={register}
          inputProps={{
            defaultChecked: Boolean(props.filterState?.includeNulls),
          }}
        />
      </div>
      <div className="text-center mt-8 mb-5">
        <Button type="submit" styleType={AppearanceStyleType.primary}>
          {t("listingFilters.applyFilter")}
        </Button>
      </div>
    </Form>
  )
}

export default FilterForm
