import React, { useContext, useMemo } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"

type DateTimePST = {
  hour: string
  minute: string
  second: string
  dayPeriod: string
  year: string
  day: string
  month: string
}

const DetailsApplicationData = () => {
  const application = useContext(ApplicationContext)

  const applicationDate = useMemo(() => {
    if (!application) return null

    if (!application.submissionDate) {
      return {
        date: t("t.n/a"),
        time: t("t.n/a"),
      }
    }

    // convert date and time to PST
    const ptFormat = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      day: "numeric",
      month: "numeric",
    })

    const originalDate = new Date(application.submissionDate)
    const ptDateParts = ptFormat.formatToParts(originalDate)
    const timeValues = ptDateParts.reduce((acc, curr) => {
      Object.assign(acc, {
        [curr.type]: curr.value,
      })
      return acc
    }, {} as DateTimePST)

    const { month, day, year, hour, minute, second, dayPeriod } = timeValues

    const date = `${month}/${day}/${year}`
    const time = `${hour}:${minute}:${second} ${dayPeriod} PT`

    return {
      date,
      time,
    }
  }, [application])

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.applicationData")}
      inset
    >
      <GridCell>
        <ViewItem label={t("application.details.number")}>{application.id}</ViewItem>
      </GridCell>

      {application.submissionType && (
        <GridCell>
          <ViewItem label={t("application.details.type")}>
            {t(`application.details.submissionType.${application.submissionType}`)}
          </ViewItem>
        </GridCell>
      )}

      <GridCell>
        <ViewItem label={t("application.details.submittedDate")}>{applicationDate.date}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.timeDate")}>{applicationDate.time}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.language")}>
          {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.totalSize")}>
          {!application.householdSize ? 1 : application.householdSize}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.submittedBy")}>
          {application.applicant.firstName && application.applicant.lastName
            ? `${application.applicant.firstName} ${application.applicant.lastName}`
            : t("t.n/a")}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsApplicationData as default, DetailsApplicationData }
