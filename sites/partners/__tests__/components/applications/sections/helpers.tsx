import { FormProvider, useForm } from "react-hook-form"
import { FormTypes } from "../../../../src/lib/applications/FormTypes"
import React from "react"

export const FormProviderWrapper = ({ children }: React.PropsWithChildren) => {
  const formMethods = useForm<FormTypes>({})
  return <FormProvider {...formMethods}>{children}</FormProvider>
}
