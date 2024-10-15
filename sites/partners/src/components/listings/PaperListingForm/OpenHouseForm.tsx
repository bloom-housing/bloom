import React from "react"
import { useForm } from "react-hook-form"
import { nanoid } from "nanoid"
import {
  t,
  Field,
  Textarea,
  Form,
  DateField,
  DateFieldValues,
  TimeField,
  TimeFieldValues,
  formatDateToTimeField,
} from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { TempEvent } from "../../../lib/listings/formTypes"
import { createDate, createTime } from "../../../lib/helpers"
import dayjs from "dayjs"
import SectionWithGrid from "../../shared/SectionWithGrid"

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
  const { register, setValue, watch, trigger, getValues, errors } = useForm<OpenHouseFormValues>({
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
    <>
      <Drawer.Content>
        <Form onSubmit={() => false}>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("listings.sections.openHouse")}>
                <Grid.Row columns={3}>
                  <Grid.Cell>
                    <DateField
                      label={t("t.date")}
                      name="date"
                      id="date"
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      error={errors?.date}
                      errorMessage={t("errors.requiredFieldError")}
                      required
                      defaultDate={defaultValues?.date}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <TimeField
                      label={t("t.startTime")}
                      name="startTime"
                      id="startTime"
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      error={!!errors?.startTime}
                      required
                      defaultValues={defaultValues?.startTime}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <TimeField
                      label={t("t.end")}
                      name="endTime"
                      id="endTime"
                      register={register}
                      setValue={setValue}
                      watch={watch}
                      error={!!errors?.endTime}
                      required
                      defaultValues={defaultValues?.endTime}
                    />
                  </Grid.Cell>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Cell>
                    <Field
                      id="label"
                      name="label"
                      label={t("t.label")}
                      placeholder={t("t.label")}
                      register={register}
                    />
                  </Grid.Cell>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Cell>
                    <Field
                      type="url"
                      id="url"
                      name="url"
                      label={t("t.url")}
                      placeholder={"https://"}
                      register={register}
                      error={!!errors?.url}
                      errorMessage={
                        errors?.url?.type === "https"
                          ? t("errors.urlHttpsError")
                          : t("errors.urlError")
                      }
                    />
                  </Grid.Cell>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Cell>
                    <Textarea
                      id="note"
                      name="note"
                      label={t("listings.events.openHouseNotes")}
                      placeholder={t("t.notes")}
                      register={register}
                      note={t("t.optional")}
                      rows={5}
                    />
                  </Grid.Cell>
                </Grid.Row>
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Form>
      </Drawer.Content>
      <Drawer.Footer>
        <Button
          id="saveOpenHouseFormButton"
          type="button"
          onClick={() => handleSubmit()}
          variant="primary"
        >
          {t("t.save")}
        </Button>
      </Drawer.Footer>
    </>
  )
}

export { OpenHouseForm as default, OpenHouseForm }
