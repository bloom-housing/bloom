import { Field } from "@bloom-housing/ui-components"
import { UseFormMethods } from "react-hook-form"
import { FinderQuestion } from "../../../pages/finder"

const FinderMultiselect = (props: {
  activeQuestion: FinderQuestion
  register: UseFormMethods["register"]
}) => {
  return (
    <div className="finder-grid finder-grid__multiselect">
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
    </div>
  )
}

export default FinderMultiselect
