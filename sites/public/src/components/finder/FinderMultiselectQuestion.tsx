import { useFormContext } from "react-hook-form"
import { Field } from "@bloom-housing/ui-components"
import styles from "./FinderMultiselectQuestion.module.scss"
import finderStyles from "./RentalsFinder.module.scss"
import { FilterField } from "../browse/FilterDrawerHelpers"

type FinderMultiselectQuestionProps = {
  legend: string
  fieldGroupName: string
  options: FilterField[]
}

export default function FinderMultiselectQuestion(props: FinderMultiselectQuestionProps) {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <fieldset className={styles["fieldset"]}>
      <legend className={styles["fieldset-legend"]}>{props.legend}</legend>
      {props.options.map((option) => (
        <Field
          name={option.key}
          id={option.key}
          key={option.key}
          label={option.label}
          register={register}
          type="checkbox"
          className={finderStyles["question-checkbox"]}
          labelClassName={finderStyles["question-label"]}
          bordered
        />
      ))}
    </fieldset>
  )
}
