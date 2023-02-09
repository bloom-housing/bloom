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

export const FieldGroupDescriptions = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"radio"}
      fields={[
        {
          id: "1234",
          label: "Input 1",
          description: (
            <span>
              This is an <em>HTML</em> description
            </span>
          ),
        },
        { id: "5678", label: "Input 2", description: "This is a text description" },
        { id: "9765", label: "Input 3" },
        { id: "4321", label: "Input 4" },
      ]}
      fieldGroupClassName="grid grid-cols-1"
      fieldClassName="ml-0"
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
    />
  )
}

export const FieldGroupError = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      error={true}
      register={register}
      name={"testInput"}
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
