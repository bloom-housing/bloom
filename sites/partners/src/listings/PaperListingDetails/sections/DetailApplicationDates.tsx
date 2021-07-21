import React, { useContext, useMemo, useState, useCallback } from "react"
import moment from "moment"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  Button,
  Drawer,
  AppearanceStyleType,
  formatDateToTimeField,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"
import { ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"

const DetailApplicationDates = () => {
  const openHouseHeaders = {
    date: t("t.date"),
    startTime: t("t.startTime"),
    endTime: t("t.endTime"),
    url: t("t.link"),
    view: "",
  }

  const listing = useContext(ListingContext)

  const [drawer, setDrawer] = useState<ListingEvent | null>(null)

  const openHouseEvents = useMemo(
    () =>
      listing.events
        .filter((item) => item.type === ListingEventType.openHouse)
        .map((event) => {
          const { startTime, endTime, url } = event

          const startTimeDate = moment(startTime)
          const endTimeDate = moment(endTime)

          return {
            date: startTimeDate.format("MM/DD/YYYY"),
            startTime: startTimeDate.format("hh:mm:ss A"),
            endTime: endTimeDate.format("hh:mm:ss A"),
            url: url ? url : "",
            view: (
              <div className="flex">
                <Button
                  type="button"
                  className="front-semibold uppercase"
                  onClick={() => setDrawer(event)}
                  unstyled
                >
                  {t("t.view")}
                </Button>
              </div>
            ),
          }
        }),
    [listing]
  )

  const createTimeLabel = useCallback((date: Date) => {
    if (!date) return ""

    const { hours, minutes, seconds, period } = formatDateToTimeField(date)

    return `${hours}:${minutes}:${seconds} ${period.toUpperCase()}`
  }, [])

  const createDateLabel = useCallback((date: Date) => {
    if (!date) return ""

    const dateObject = moment(date).utc()

    return `${dateObject.format("MM")}/${dateObject.format("DD")}/${dateObject.format("YYYY")}`
  }, [])

  return (
    <>
      <GridSection
        className="bg-primary-lighter"
        title={t("listings.sections.applicationDatesTitle")}
        grid={false}
        inset
      >
        <GridSection columns={3}>
          <GridCell>
            <ViewItem label={t("listings.applicationDeadline")}>
              {getDetailFieldDate(listing.applicationDueDate)}
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.applicationDueTime")}>
              {getDetailFieldTime(listing.applicationDueTime)}
            </ViewItem>
          </GridCell>
        </GridSection>
        <GridSection columns={1}>
          <ViewItem label={t("listings.openHouseEvent.header")}>
            <div className="mt-5">
              <div className="mb-5">
                <MinimalTable headers={openHouseHeaders} data={openHouseEvents} />
              </div>
            </div>
          </ViewItem>
        </GridSection>
      </GridSection>

      <Drawer
        open={!!drawer}
        title={t("listings.sections.openHouse")}
        ariaDescription={t("listings.unit.title")}
        onClose={() => setDrawer(null)}
      >
        <section className="border rounded-md p-8 bg-white mb-8">
          <GridSection tinted={true} inset={true} grid={false}>
            <GridSection grid columns={3}>
              <ViewItem label={t("t.date")}>{createDateLabel(drawer?.startTime)}</ViewItem>
              <ViewItem label={t("t.startTime")}>{createTimeLabel(drawer?.startTime)}</ViewItem>
              <ViewItem label={t("t.endTime")}>{createTimeLabel(drawer?.endTime)}</ViewItem>
              <ViewItem label={t("t.url")}>{drawer?.url}</ViewItem>
            </GridSection>
          </GridSection>
        </section>

        <Button styleType={AppearanceStyleType.primary} onClick={() => setDrawer(null)}>
          {t("t.done")}
        </Button>
      </Drawer>
    </>
  )
}

export default DetailApplicationDates
