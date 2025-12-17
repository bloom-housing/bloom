import React, { useContext, useMemo, useState } from "react"
import dayjs from "dayjs"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, FieldValue, Grid, Link } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers/src/auth/AuthContext"
import {
  ListingEvent,
  ListingEventsTypeEnum,
  MarketingTypeEnum,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import DetailMarketingFlyerSection from "./DetailMarketingFlyerSection"
import { getDetailFieldDate, getDetailFieldString, getDetailFieldTime } from "./helpers"

const DetailApplicationDates = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const [drawer, setDrawer] = useState<ListingEvent | null>(null)

  const enableMarketingStatus = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableMarketingStatus,
    listing?.jurisdictions?.id
  )

  const enableMarketingStatusMonths = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableMarketingStatusMonths,
    listing?.jurisdictions?.id
  )

  const enableMarketingFlyer = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableMarketingFlyer,
    listing?.jurisdictions?.id
  )

  const openHouseHeaders = {
    date: "t.date",
    startTime: "t.startTime",
    endTime: "t.endTime",
    url: "t.link",
    view: "",
  }

  const marketingTypeHeaders = {
    [MarketingTypeEnum.marketing]: "listings.marketing",
    [MarketingTypeEnum.comingSoon]: "listings.underConstruction",
  }

  const openHouseEvents = useMemo(
    () =>
      listing.listingEvents
        .filter((item) => item.type === ListingEventsTypeEnum.openHouse)
        .sort((a, b) => (dayjs(a.startTime).isAfter(b.startTime) ? 1 : -1))
        .map((event) => {
          const { startTime, endTime, url } = event

          return {
            date: { content: startTime && getDetailFieldDate(startTime) },
            startTime: { content: startTime && getDetailFieldTime(startTime) },
            endTime: { content: endTime && getDetailFieldTime(endTime) },
            url: {
              content: url ? (
                <Link href={url} className={"darker-link"}>
                  {t("t.url")}
                </Link>
              ) : (
                t("t.n/a")
              ),
            },
            view: {
              content: (
                <div className="flex">
                  <Button
                    type="button"
                    variant="text"
                    size="sm"
                    className={"font-semibold darker-link"}
                    onClick={() => setDrawer(event)}
                  >
                    {t("t.view")}
                  </Button>
                </div>
              ),
            },
          }
        }),
    [listing]
  )

  return (
    <>
      <SectionWithGrid heading={t("listings.sections.applicationDatesTitle")} inset>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <FieldValue id="applicationDeadline" label={t("listings.applicationDeadline")}>
              {getDetailFieldDate(listing.applicationDueDate) ?? t("t.n/a")}
            </FieldValue>
          </Grid.Cell>
          <Grid.Cell>
            <FieldValue
              id="applicationDueTime"
              className="seeds-grid-span-2"
              label={t("listings.applicationDueTime")}
            >
              {getDetailFieldTime(listing.applicationDueDate) ?? t("t.n/a")}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>

        {!!openHouseEvents.length && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <FieldValue id="openHouseEvent.header" label={t("listings.openHouseEvent.header")}>
                <MinimalTable
                  id="openhouseHeader"
                  className="spacer-heading-above"
                  headers={openHouseHeaders}
                  data={openHouseEvents}
                />
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}

        <Drawer
          isOpen={!!drawer}
          ariaLabelledBy="detail-application-dates-drawer-header"
          onClose={() => setDrawer(null)}
        >
          <Drawer.Header id="detail-application-dates-drawer-header">
            {t("listings.sections.openHouse")}
          </Drawer.Header>
          <Drawer.Content>
            <Card>
              <Card.Section>
                <Grid className="grid-inset-section">
                  <Grid.Row columns={3}>
                    <Grid.Cell>
                      <FieldValue id="drawer.startTime.date" label={t("t.date")}>
                        {drawer?.startTime && getDetailFieldDate(drawer.startTime)}
                      </FieldValue>
                    </Grid.Cell>
                    <Grid.Cell>
                      <FieldValue id="drawer.startTime.time" label={t("t.startTime")}>
                        {getDetailFieldTime(drawer?.startTime)}
                      </FieldValue>
                    </Grid.Cell>
                    <Grid.Cell>
                      <FieldValue id="drawer.endTime.time" label={t("t.endTime")}>
                        {drawer?.endTime && getDetailFieldTime(drawer?.endTime)}
                      </FieldValue>
                    </Grid.Cell>
                    <Grid.Cell>
                      <FieldValue id="drawer.url" label={t("t.url")}>
                        {drawer?.url ? (
                          <Link className="mx-0 my-0 darker-link" href={drawer.url}>
                            {drawer?.label ?? t("t.url")}
                          </Link>
                        ) : (
                          t("t.n/a")
                        )}
                      </FieldValue>
                    </Grid.Cell>
                    <Grid.Cell>
                      <FieldValue
                        id="events.openHouseNotes"
                        label={t("listings.events.openHouseNotes")}
                      >
                        {drawer?.note || t("t.n/a")}
                      </FieldValue>
                    </Grid.Cell>
                  </Grid.Row>
                </Grid>
              </Card.Section>
            </Card>
          </Drawer.Content>
          <Drawer.Footer>
            <Button variant="primary" size="sm" onClick={() => setDrawer(null)}>
              {t("t.done")}
            </Button>
          </Drawer.Footer>
        </Drawer>

        {enableMarketingStatus && (
          <Grid.Row columns={3}>
            <Grid.Cell>
              <FieldValue id="marketingStatus" label={t("listings.marketingSection.status")}>
                {getDetailFieldString(t(marketingTypeHeaders[listing.marketingType]))}
              </FieldValue>
            </Grid.Cell>
            <Grid.Cell>
              <FieldValue id="marketingSeasonDate" label={t("listings.marketingSection.date")}>
                {!enableMarketingStatusMonths &&
                  listing.marketingSeason &&
                  t(`seasons.${listing.marketingSeason}`)}{" "}
                {enableMarketingStatusMonths &&
                  listing.marketingMonth &&
                  t(`months.${listing.marketingMonth}`)}{" "}
                {listing.marketingYear && listing.marketingYear}
                {!listing.marketingSeason &&
                  !listing.marketingYear &&
                  !listing.marketingMonth &&
                  t("t.none")}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}

        <DetailMarketingFlyerSection
          listing={listing}
          enableMarketingFlyer={enableMarketingFlyer}
        />
      </SectionWithGrid>
    </>
  )
}

export default DetailApplicationDates
