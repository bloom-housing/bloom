import React, { useContext, useMemo, useState } from "react"

import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  Button,
  Drawer,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"
import { ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"

const DetailApplicationDates = () => {
  const listing = useContext(ListingContext)

  const [drawer, setDrawer] = useState<ListingEvent | null>(null)

  const openHouseHeaders = {
    date: t("t.date"),
    startTime: t("t.startTime"),
    endTime: t("t.endTime"),
    url: t("t.link"),
    view: "",
  }

  const openHouseEvents = useMemo(
    () =>
      listing.events
        .filter((item) => item.type === ListingEventType.openHouse)
        .map((event) => {
          const { startTime, endTime, url } = event

          return {
            date: startTime && getDetailFieldDate(startTime),
            startTime: startTime && getDetailFieldTime(startTime),
            endTime: endTime && getDetailFieldTime(endTime),
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
              {listing.applicationDueDate && getDetailFieldDate(listing.applicationDueDate)}
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("listings.applicationDueTime")}>
              {listing.applicationDueTime && getDetailFieldTime(listing.applicationDueTime)}
            </ViewItem>
          </GridCell>
        </GridSection>

        {!!openHouseEvents.length && (
          <GridSection columns={1}>
            <ViewItem label={t("listings.openHouseEvent.header")}>
              <div className="mt-5">
                <div className="mb-5">
                  <MinimalTable headers={openHouseHeaders} data={openHouseEvents} />
                </div>
              </div>
            </ViewItem>
          </GridSection>
        )}

        <Drawer
          open={!!drawer}
          title={t("listings.sections.openHouse")}
          ariaDescription={t("listings.unit.title")}
          onClose={() => setDrawer(null)}
        >
          <section className="border rounded-md p-8 bg-white mb-8">
            <GridSection tinted={true} inset={true} grid={false}>
              <GridSection grid columns={3}>
                <ViewItem label={t("t.date")}>
                  {drawer?.startTime && getDetailFieldDate(drawer.startTime)}
                </ViewItem>
                <ViewItem label={t("t.startTime")}>
                  {getDetailFieldTime(drawer?.startTime)}
                </ViewItem>
                <ViewItem label={t("t.endTime")}>
                  {drawer?.endTime && getDetailFieldTime(drawer?.endTime)}
                </ViewItem>
                <ViewItem label={t("t.url")}>{drawer?.url || t("n/a")}</ViewItem>
                <ViewItem label={t("listings.events.openHouseNotes")}>
                  {drawer?.note || t("n/a")}
                </ViewItem>
              </GridSection>
            </GridSection>
          </section>

          <Button styleType={AppearanceStyleType.primary} onClick={() => setDrawer(null)}>
            {t("t.done")}
          </Button>
        </Drawer>
      </GridSection>
    </>
  )
}

export default DetailApplicationDates
