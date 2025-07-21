import { Field, t } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import finderStyles from "./RentalsFinder.module.scss"
import styles from "./FinderRentQuestion.module.scss"
import { ListingFilterKeys } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { validateRentValues } from "../browse/FilterDrawerHelpers"

//TODO: Update component when new designs are available

export default function FinderRentQuestion() {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue, clearErrors, setError, errors } = formMethods
  return (
    <>
      <div className={styles["rent-input-wrapper"]}>
        <Field
          id={`${ListingFilterKeys.monthlyRent}.minRent`}
          name={`${ListingFilterKeys.monthlyRent}.minRent`}
          register={register}
          getValues={getValues}
          setValue={setValue}
          type="currency"
          label={t("finder.rent.minRent")}
          placeholder={t("finder.rent.noMinRent")}
          prepend={"$"}
          error={!!errors[ListingFilterKeys.monthlyRent]?.minRent}
          errorMessage={errors[ListingFilterKeys.monthlyRent]?.minRent?.message}
          inputProps={{
            onBlur: () => {
              validateRentValues(getValues, clearErrors, setError)
            },
          }}
        />
        <Field
          id={`${ListingFilterKeys.monthlyRent}.maxRent`}
          name={`${ListingFilterKeys.monthlyRent}.maxRent`}
          register={register}
          getValues={getValues}
          setValue={setValue}
          type="currency"
          label={t("finder.rent.maxRent")}
          placeholder={t("finder.rent.noMaxRent")}
          prepend={"$"}
          error={!!errors[ListingFilterKeys.monthlyRent]?.maxRent}
          errorMessage={errors[ListingFilterKeys.monthlyRent]?.maxRent?.message}
          inputProps={{
            onBlur: () => validateRentValues(getValues, clearErrors, setError),
          }}
        />
      </div>
      <Field
        id={ListingFilterKeys.section8Acceptance}
        name={ListingFilterKeys.section8Acceptance}
        register={register}
        type="checkbox"
        bordered
        label={t("finder.rent.section8")}
        className={finderStyles["question-checkbox"]}
        labelClassName={finderStyles["question-label"]}
      />
    </>
  )
}
