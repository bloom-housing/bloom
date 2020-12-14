import { UseFormMethods } from "react-hook-form"
import { stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"
import { t, GridSection, ViewItem, GridCell, Field, Select } from "@bloom-housing/ui-components"

type AddressType = "residence" | "residence-member" | "work" | "mailing"

export const ApplicationFormAddress = (
  subtitle: string,
  dataKey: string,
  type: AddressType,
  register: UseFormMethods["register"]
) => {
  return (
    <GridSection subtitle={subtitle}>
      <GridCell span={2}>
        <ViewItem label={t("application.contact.streetAddress")}>
          <Field
            id={`${dataKey}.street`}
            name={`${dataKey}.street`}
            label={t("application.contact.streetAddress")}
            placeholder={t("application.contact.streetAddress")}
            register={register}
            readerOnly
          />
        </ViewItem>
      </GridCell>
      <GridCell>
        <ViewItem label={t("application.contact.apt")}>
          <Field
            id={`${dataKey}.street2`}
            name={`${dataKey}.street2`}
            label={t("application.contact.apt")}
            placeholder={t("application.contact.apt")}
            register={register}
            readerOnly
          />
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.contact.city")}>
          <Field
            id={`${dataKey}.city`}
            name={`${dataKey}.city`}
            label={t("application.contact.cityName")}
            placeholder={t("application.contact.cityName")}
            register={register}
            readerOnly
          />
        </ViewItem>
      </GridCell>

      <GridCell className="md:grid md:grid-cols-2 md:gap-8" span={2}>
        <ViewItem label={t("application.contact.state")} className="mb-0">
          <Select
            id={`${dataKey}.state`}
            name={`${dataKey}.state`}
            label={t("application.contact.state")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={stateKeys}
            keyPrefix="states"
          />
        </ViewItem>

        <ViewItem label={t("application.contact.zip")}>
          <Field
            id={`${dataKey}.zipCode`}
            name={`${dataKey}.zipCode`}
            label={t("application.contact.zip")}
            placeholder={t("application.contact.zipCode")}
            register={register}
            readerOnly
          />
        </ViewItem>
      </GridCell>

      {type === "residence" && (
        <GridCell span={2}>
          <Field
            id="application.sendMailToMailingAddress"
            name="application.sendMailToMailingAddress"
            type="checkbox"
            label={t("application.contact.sendMailToMailingAddress")}
            register={register}
          />
        </GridCell>
      )}
    </GridSection>
  )
}
