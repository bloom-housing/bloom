import React from "react"
import { useForm } from "react-hook-form"
import { FieldGroup } from "./FieldGroup"

export default {
  title: "Forms/FieldGroup",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FieldGroupDefault = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"checkbox"}
      fields={[
        { id: "1234", label: "Input 1" },
        { id: "5678", label: "Input 2" },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      fieldLabelClassName={"text-primary"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
    />
  )
}
