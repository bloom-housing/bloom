import React from "react"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import {
  Button,
  AppearanceStyleType,
  t,
  GridSection,
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
import { FieldValue } from "@bloom-housing/ui-seeds"
import { TempEvent } from "../../../lib/listings/formTypes"
import { createDate, createTime } from "../../../lib/helpers"
import dayjs from "dayjs"

type OpenHouseFormProps = {
  onSubmit: (data: TempEvent) => void
  currentEvent?: TempEvent
}

export type OpenHouseFormValues = {
  date: DateFieldValues
  startTime: TimeFieldValues
  endTime: TimeFieldValues
  label?: string
  url?: string
  note?: string
}

const OpenHouseForm = ({ onSubmit, currentEvent }: OpenHouseFormProps) => {
  const defaultValues = (() => {
    if (!currentEvent) return null

    const { startTime, endTime, label, url, note } = currentEvent || {}
    const values = {}

    label && Object.assign(values, { label })
    url && Object.assign(values, { url })
    note && Object.assign(values, { note })
    startTime && Object.assign(values, { startTime: formatDateToTimeField(startTime) })
    endTime && Object.assign(values, { endTime: formatDateToTimeField(endTime) })

    if (startTime) {
      const dateObj = dayjs(startTime)

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
        ...currentEvent,
        startTime: createTime(createDate(data.date), data.startTime),
        startDate: createTime(createDate(data.date), {
          hours: "12",
          minutes: "00",
          period: "pm",
        }),
        endTime: createTime(createDate(data.date), data.endTime),
        label: data.label,
        url: data.url,
        note: data.note,
      }

      if (!currentEvent.id && !currentEvent.tempId) {
        event.tempId = nanoid()
      }

      onSubmit(event)
    }
  }

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("listings.sections.openHouse")} columns={3}>
          <GridCell>
            <FieldValue label={t("t.date")}>
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
            </FieldValue>
          </GridCell>
          <GridCell>
            <FieldValue label={t("t.startTime")}>
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
            </FieldValue>
          </GridCell>
          <GridCell>
            <FieldValue label={t("t.end")}>
              <TimeField
                label={t("t.end")}
                name="endTime"
                id="endTime"
                register={register}
                watch={watch}
                readerOnly
                error={!!errors?.endTime}
                required
                defaultValues={defaultValues?.endTime}
              />
            </FieldValue>
          </GridCell>
          <GridCell>
            <GridSection columns={1}>
              <GridCell>
                <FieldValue label={t("t.label")}>
                  <Field
                    id="label"
                    name="label"
                    label={t("t.label")}
                    placeholder={t("t.label")}
                    register={register}
                    readerOnly
                  />
                </FieldValue>
              </GridCell>
              <GridCell>
                <FieldValue label={t("t.url")}>
                  <Field
                    type="url"
                    id="url"
                    name="url"
                    label={t("t.url")}
                    placeholder={"https://"}
                    register={register}
                    readerOnly
                    error={!!errors?.url}
                    errorMessage={
                      errors?.url?.type === "https"
                        ? t("errors.urlHttpsError")
                        : t("errors.urlError")
                    }
                  />
                </FieldValue>
              </GridCell>
            </GridSection>
          </GridCell>

          <GridCell>
            <FieldValue label={t("listings.events.openHouseNotes")}>
              <Textarea
                id="note"
                name="note"
                label={t("listings.events.openHouseNotes")}
                placeholder={t("t.notes")}
                register={register}
                readerOnly
                note={t("t.optional")}
                rows={5}
              />
            </FieldValue>
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
