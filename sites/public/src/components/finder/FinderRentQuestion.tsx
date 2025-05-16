import { Field, t } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import styles from "./FinderRentQuestion.module.scss"

//TODO: Update component when new designs are available

export default function FinderRentQuestion() {
  const { register } = useFormContext()

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
        labelClassName={styles["checkbox-label"]}
      />
    </>
  )
}
