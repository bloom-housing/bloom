import { useFormContext } from "react-hook-form"
import { Field } from "@bloom-housing/ui-components"
import styles from "./FinderMultiselectQuestion.module.scss"
import finderStyles from "./RentalsFinder.module.scss"

export type FinderQuestion = {
  label: string
  value: string | boolean
}

type FinderMultiselectQuestionProps = {
  legend: string
  fieldGroupName: string
  options: FinderQuestion[]
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
          type="checkbox"
          name={props.fieldGroupName}
          id={option.label}
          key={option.label}
          label={option.label}
          register={register}
          className={finderStyles["question-checkbox"]}
          labelClassName={finderStyles["question-label"]}
          inputProps={{
            value: option.value,
          }}
          bordered
        />
      ))}
    </fieldset>
  )
}
