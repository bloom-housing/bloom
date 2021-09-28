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
  const communityTypeOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "all", label: t("listingFilters.communityTypeOptions.all") },
    { value: "senior", label: t("listingFilters.communityTypeOptions.senior") },
    {
      value: "specialNeedsAndDisability",
      label: t("listingFilters.communityTypeOptions.specialNeeds"),
    },
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

  const { handleSubmit, register, errors } = useForm()
  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <div className="form-card__group">
        <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
        <Select
          id={"availability"}
          name={FrontendListingFilterStateKeys.availability}
          label={t("listingFilters.availability")}
          register={register}
          controlClassName="control"
          options={availabilityOptions}
          defaultValue={props.filterState?.availability}
        />
        <Select
          id="unitOptions"
          name={FrontendListingFilterStateKeys.bedrooms}
          label={t("listingFilters.bedrooms")}
          register={register}
          controlClassName="control"
          options={preferredUnitOptions}
          defaultValue={props.filterState?.bedrooms?.toString()}
        />
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
        />
        <label className="field-label">Rent Range</label>
        <div className="flex flex-row">
          <Field
            id="minRent"
            name={FrontendListingFilterStateKeys.minRent}
            register={register}
            type="number"
            placeholder={t("t.min")}
            prepend="$"
            defaultValue={props.filterState?.minRent}
          />
          <div className="flex items-center p-3">{t("t.to")}</div>
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
        />
        <Select
          id="seniorHousing"
          name={FrontendListingFilterStateKeys.seniorHousing}
          label={t("listingFilters.senior")}
          register={register}
          controlClassName="control"
          options={seniorHousingOptions}
          defaultValue={props.filterState?.seniorHousing?.toString()}
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
      <div className="text-center mt-6">
        <Button type="submit" styleType={AppearanceStyleType.primary}>
          {t("listingFilters.applyFilters")}
        </Button>
      </div>
    </Form>
  )
}

export default FilterForm
