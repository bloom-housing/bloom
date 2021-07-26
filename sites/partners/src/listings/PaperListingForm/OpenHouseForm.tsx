import React from "react"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import {
  Button,
  AppearanceStyleType,
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  Textarea,
  Form,
  DateField,
  DateFieldValues,
  TimeField,
  TimeFieldValues,
  formatDateToTimeField,
} from "@bloom-housing/ui-components"

import { TempEvent } from "./index"
import { createDate, createTime } from "../../../lib/helpers"
import moment from "moment"

type OpenHouseFormProps = {
  onSubmit: (data: TempEvent) => void
  currentEvent?: TempEvent
}

export type OpenHouseFormValues = {
  date: DateFieldValues
  startTime: TimeFieldValues
  endTime: TimeFieldValues
  url?: string
  note?: string
}

const OpenHouseForm = ({ onSubmit, currentEvent }: OpenHouseFormProps) => {
  const defaultValues = (() => {
    if (!currentEvent) return null

    const { startTime, endTime, url, note } = currentEvent || {}
    const values = {}

    url && Object.assign(values, { url })
    note && Object.assign(values, { note })
    startTime && Object.assign(values, { startTime: formatDateToTimeField(startTime) })
    endTime && Object.assign(values, { endTime: formatDateToTimeField(endTime) })

    if (startTime) {
      const dateObj = moment(startTime)

      const date = {
        day: dateObj.format("DD"),
        month: dateObj.format("MM"),
        year: dateObj.format("YYYY"),
      }

      Object.assign(values, { date })
    }

    return values as OpenHouseFormValues
  })()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, trigger, getValues, errors } = useForm<OpenHouseFormValues>({
    defaultValues,
  })

  const handleSubmit = async () => {
    const validation = await trigger()

    if (validation) {
      const data = getValues()

      const event = {
        tempId: nanoid(),
        ...currentEvent,
        startTime: createTime(createDate(data.date), data.startTime),
        endTime: createTime(createDate(data.date), data.endTime),
        url: data.url,
        note: data.note,
      }

      onSubmit(event)
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
                defaultDate={defaultValues?.date}
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
                error={!!errors?.startTime}
                required
                defaultValues={defaultValues?.startTime}
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
                error={!!errors?.startTime}
                required
                defaultValues={defaultValues?.endTime}
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
          <GridCell>
            <ViewItem label={t("listings.events.openHouseNotes")}>
              <Textarea
                id="note"
                name="note"
                label={t("listings.events.openHouseNotes")}
                placeholder={t("t.notes")}
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
