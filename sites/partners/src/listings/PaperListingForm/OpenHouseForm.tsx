import React from "react"
import { useForm } from "react-hook-form"

import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  Form,
  DateField,
  TimeField,
} from "@bloom-housing/ui-components"

const OpenHouseForm = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.sections.openHouse")} columns={3}>
          <GridCell>
            <ViewItem label={t("t.date")}>
              <DateField
                label={t("t.date")}
                name="openHouseDate"
                id="openHouseDate"
                register={register}
                watch={watch}
                readerOnly
                // defaultDate={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.startTime")}>
              <TimeField
                label={t("t.startTime")}
                name="openHouseTimeStart"
                id="openHouseTimeStart"
                register={register}
                watch={watch}
                readerOnly
                // defaultValues={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.end")}>
              <TimeField
                label={t("t.end")}
                name="openHouseTimeEnd"
                id="openHouseTimeEnd"
                register={register}
                watch={watch}
                readerOnly
                // defaultValues={}
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("t.url")}>
              <Field
                id="url"
                name="url"
                label={t("t.url")}
                placeholder={t("t.url")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
        </GridSection>
      </div>
    </Form>
  )
}

export { OpenHouseForm as default, OpenHouseForm }
