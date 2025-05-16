import { Field } from "@bloom-housing/ui-components"
import styles from "./FinderMultiselectQuestion.module.scss"
import { useFormContext } from "react-hook-form"

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
  const { register } = useFormContext()

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
          className={styles["question-checkbox"]}
          labelClassName={styles["question-label"]}
          inputProps={{
            value: option.value,
          }}
          bordered
        />
      ))}
    </fieldset>
  )
}
