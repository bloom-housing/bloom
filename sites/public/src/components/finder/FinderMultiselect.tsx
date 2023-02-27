import { Field } from "../../../../../detroit-ui-components/src/forms/Field"
import { UseFormMethods } from "react-hook-form"
import { FinderQuestion } from "../../pages/finder"

const FinderMultiselect = (props: {
  activeQuestion: FinderQuestion
  register: UseFormMethods["register"]
}) => {
  return (
    <fieldset className="finder-grid finder-grid__multiselect">
      <legend className="sr-only">{props.activeQuestion.legendText}</legend>
      {props.activeQuestion?.fields?.map((field) => (
        <div className="finder-grid__field" key={field.label}>
          <Field
            name={props.activeQuestion.fieldGroupName}
            register={props.register}
            id={field.label}
            label={field.translation ?? field.label}
            key={field.label}
            type="checkbox"
            inputProps={{
              value: field.label,
              defaultChecked: field.value,
            }}
            bordered
          />
        </div>
      ))}
    </fieldset>
  )
}

export default FinderMultiselect
