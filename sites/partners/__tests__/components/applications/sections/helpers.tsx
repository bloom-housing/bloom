import { FormProvider, useForm } from "react-hook-form"
import React from "react"
import { formDefaults, FormListing } from "../../../../src/lib/listings/formTypes"

export const FormProviderWrapper = ({
  children,
  values,
}: React.PropsWithChildren<{ values?: Partial<FormListing> }>) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}
