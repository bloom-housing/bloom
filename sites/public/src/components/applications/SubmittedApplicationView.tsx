import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Link } from "@bloom-housing/ui-seeds"
import FormSummaryDetails from "../shared/FormSummaryDetails"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { Application, ApplicationSection, Listing } from "@bloom-housing/backend-core"
import { useMemo } from "react"
import { DATE_FORMAT } from "../../lib/constants"
import dayjs from "dayjs"

interface SubmittedApplicationViewProps {
  application: Application
  listing: Listing
}

const SubmittedApplicationView = ({ application, listing }: SubmittedApplicationViewProps) => {
  const confirmationDate = useMemo(() => {
    return dayjs().format(DATE_FORMAT)
  }, [])

  return (
    <>
      <Card spacing={"sm"} className={"my-6"}>
        <Card.Section className={"bg-primary px-8 py-4"}>
          <Heading priority={1} size="xl" className={"font-bold font-alt-sans text-white"}>
            {listing.name}
          </Heading>
        </Card.Section>
        <Card.Section className={"px-8"}>
          <div>
            {listing && (
              <span className={"lined text-sm"}>
                <Link href={`/listing/${listing.id}/${listing.urlSlug}`}>
                  {t("application.confirmation.viewOriginalListing")}
                </Link>
              </span>
            )}
          </div>
        </Card.Section>
      </Card>
      <Card spacing={"lg"} className={"mb-6"}>
        <Card.Section divider={"inset"}>
          <Heading priority={2} size={"2xl"}>
            {t("application.confirmation.informationSubmittedTitle")}
          </Heading>
          <p className="field-note mt-4">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
        </Card.Section>
        <Card.Section divider={"inset"} className={"border-none"}>
          <Heading priority={3} size={"md"}>
            {t("application.confirmation.lotteryNumber")}
          </Heading>
          <p className="font-serif text-2xl my-0">
            {application.confirmationCode || application.id}
          </p>
        </Card.Section>
        <FormSummaryDetails
          listing={listing}
          application={application}
          hidePreferences={
            listingSectionQuestions(listing, ApplicationSection.preferences)?.length === 0
          }
          hidePrograms={listingSectionQuestions(listing, ApplicationSection.programs)?.length === 0}
          editMode={false}
        />
        <Card.Section>
          <div className="hide-for-print">
            <Button variant="primary-outlined" size="sm" onClick={() => window.print()}>
              {t("application.confirmation.printCopy")}
            </Button>
          </div>
        </Card.Section>
      </Card>
    </>
  )
}

export { SubmittedApplicationView as default, SubmittedApplicationView }
