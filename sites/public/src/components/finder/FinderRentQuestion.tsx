import { Field, t } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import finderStyles from "./RentalsFinder.module.scss"
import styles from "./FinderRentQuestion.module.scss"

//TODO: Update component when new designs are available

export default function FinderRentQuestion() {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      <div className={styles["rent-input-wrapper"]}>
        <Field
          register={register}
          type="currency"
          name="minRent"
          label={t("finder.rent.minRent")}
          placeholder={t("finder.rent.noMinRent")}
          prepend={"$"}
        />
        <Field
          register={register}
          type="currency"
          name="maxRent"
          label={t("finder.rent.maxRent")}
          placeholder={t("finder.rent.noMaxRent")}
          prepend={"$"}
        />
      </div>
      <Field
        register={register}
        type="checkbox"
        bordered
        name="includeSection8"
        label={t("finder.rent.section8")}
        className={finderStyles["question-checkbox"]}
        labelClassName={finderStyles["question-label"]}
      />
    </>
  )
}
