import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Textarea, Field, PhoneField } from "@bloom-housing/ui-components"

const LeasingAgent = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control } = formMethods

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.leasingAgentTitle")}
        description={t("listings.sections.leasingAgentSubtitle")}
      >
        <GridSection columns={3}>
          <Field
            label={t("leasingAgent.name")}
            name={"leasingAgentName"}
            id={"leasingAgentName"}
            placeholder={t("leasingAgent.namePlaceholder")}
            register={register}
          />
          <Field
            label={t("t.email")}
            name={"leasingAgentEmail"}
            id={"leasingAgentEmail"}
            placeholder={t("t.emailAddressPlaceholder")}
            register={register}
          />
          <PhoneField
            label={t("t.phone")}
            name={"leasingAgentPhone"}
            id={"leasingAgentPhone"}
            placeholder={t("t.phoneNumberPlaceholder")}
            control={control}
            controlClassName={"control"}
          />
        </GridSection>
        <GridSection columns={2}>
          <Field
            label={t("leasingAgent.title")}
            name={"leasingAgentTitle"}
            id={"leasingAgentTitle"}
            placeholder={t("leasingAgent.title")}
            register={register}
          />
          <Textarea
            label={t("leasingAgent.officeHours")}
            name={"leasingAgentOfficeHours"}
            id={"leasingAgentOfficeHours"}
            fullWidth={true}
            placeholder={t("leasingAgent.officeHoursPlaceholder")}
            register={register}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default LeasingAgent
