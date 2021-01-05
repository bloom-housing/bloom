import type { UseFormMethods } from "react-hook-form"

export type FormMethods = {
  register: UseFormMethods["register"]
  watch: UseFormMethods["watch"]
  errors: Record<string, any>
  control: UseFormMethods["control"]
  setValue: UseFormMethods["setValue"]
  clearErrors: UseFormMethods["clearErrors"]
}
