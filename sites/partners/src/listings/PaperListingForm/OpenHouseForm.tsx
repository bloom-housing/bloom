import React from "react"
import { useForm } from "react-hook-form"

import {
  Button,
  AppearanceStyleType,
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  Form,
  DateField,
  TimeField,
} from "@bloom-housing/ui-components"

type OpenHouseFormProps = {
  onSubmit: (data) => void
}

const OpenHouseForm = ({ onSubmit }: OpenHouseFormProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, trigger, getValues, errors } = useForm()

  const handleSubmit = async () => {
    const validation = await trigger()

    if (validation) {
      const data = getValues()
      onSubmit(data)
    }
  }

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.sections.openHouse")} columns={3}>
          <GridCell>
            <ViewItem label={t("t.date")}>
              <DateField
                label={t("t.date")}
                name="date"
                id="date"
                register={register}
                watch={watch}
                readerOnly
                error={errors?.date}
                errorMessage={t("errors.requiredFieldError")}
                required
                // defaultDate={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.startTime")}>
              <TimeField
                label={t("t.startTime")}
                name="startTime"
                id="startTime"
                register={register}
                watch={watch}
                readerOnly
                error={errors?.startTime}
                required
                // defaultValues={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.end")}>
              <TimeField
                label={t("t.end")}
                name="endTime"
                id="endTime"
                register={register}
                watch={watch}
                readerOnly
                error={errors?.startTime}
                required
                // defaultValues={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.url")}>
              <Field
                id="link"
                name="link"
                label={t("t.url")}
                placeholder={t("t.url")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
        </GridSection>
      </div>

      <Button
        type="button"
        onClick={() => handleSubmit()}
        styleType={AppearanceStyleType.primary}
        className="mr-4 mt-5"
      >
        {t("t.save")}
      </Button>
    </Form>
  )
}

export { OpenHouseForm as default, OpenHouseForm }
