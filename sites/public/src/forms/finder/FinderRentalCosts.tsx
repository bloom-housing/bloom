import { FrontendListingFilterStateKeys } from "@bloom-housing/shared-helpers"
import { Field, t } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { UseFormMethods } from "react-hook-form"
import { FinderQuestion } from "../../../pages/finder"

const FinderRentalCosts = (props: {
  activeQuestion: FinderQuestion
  register: UseFormMethods["register"]
  errors: UseFormMethods["errors"]
  trigger: UseFormMethods["trigger"]
  minRent: number
  maxRent: number
}) => {
  const dollarSign = useRouter().locale !== "ar"
  const numericFields = props.activeQuestion?.fields.filter((field) => field.type === "number")
  const section8Field = props.activeQuestion?.fields.find((field) => field.type === "checkbox")
  return (
    <fieldset className="finder-grid finder-grid__rental_costs">
      <legend className="sr-only">{props.activeQuestion.legendText}</legend>
      {numericFields.map((field) => {
        const isMin = field.label === "minRent"
        return (
          <div className="finder-grid__field" key={field.label}>
            <Field
              id={field.label}
              name={FrontendListingFilterStateKeys[field.label]}
              type="number"
              placeholder={t(`finder.rentalCosts.${isMin ? "min" : "max"}Placeholder`)}
              label={field.translation}
              register={props.register}
              prepend={dollarSign && "$"}
              defaultValue={typeof field?.value != "boolean" && field?.value}
              error={
                isMin ? props.errors?.minRent !== undefined : props.errors?.maxRent !== undefined
              }
              errorMessage={
                isMin
                  ? props.errors?.minRent?.type === "min"
                    ? t("errors.negativeMinRent")
                    : t("errors.minGreaterThanMaxRentError")
                  : t("errors.maxLessThanMinRentError")
              }
              validation={
                isMin ? { max: props.maxRent || props.minRent, min: 0 } : { min: props.minRent }
              }
              inputProps={{
                onBlur: () => {
                  void props.trigger("minRent")
                  void props.trigger("maxRent")
                },
                min: 0,
              }}
            />
          </div>
        )
      })}
      {section8Field && (
        <Field
          id={section8Field.label}
          name={FrontendListingFilterStateKeys[section8Field.label]}
          type="checkbox"
          label={section8Field.translation}
          className={"finder-grid__row"}
          register={props.register}
          inputProps={{
            defaultChecked: section8Field.value,
          }}
          bordered
        />
      )}
    </fieldset>
  )
}

export default FinderRentalCosts
