import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import FormSummaryDetails from "../shared/FormSummaryDetails"
import React, { useMemo } from "react"
import { DATE_FORMAT } from "../../lib/constants"
import dayjs from "dayjs"
import { CustomIconMap, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  Application,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ApplicationListingCard } from "../account/ApplicationCards"

interface SubmittedApplicationViewProps {
  application: Application
  listing: Listing
  backHref: string
}

const SubmittedApplicationView = ({
  application,
  listing,
  backHref,
}: SubmittedApplicationViewProps) => {
  const confirmationDate = useMemo(() => {
    return dayjs(application.submissionDate).format(DATE_FORMAT)
  }, [application.submissionDate])

  return (
    <>
      <ApplicationListingCard listingName={listing?.name} listingId={listing?.id} />
      <Card spacing={"lg"} className={"mb-6"}>
        <Card.Section divider={"inset"}>
          <Button
            size="sm"
            leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
            variant={"text"}
            href={backHref}
          >
            {t("t.back")}
          </Button>
          <Heading priority={2} size={"2xl"} className="mt-6">
            {t("application.confirmation.informationSubmittedTitle")}
          </Heading>
          <p className="field-note mt-4">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
        </Card.Section>
        <Card.Section divider={"inset"} className={"border-none"}>
          <p>{`${t("application.yourLotteryNumber")}:`}</p>
          <p className="font-semibold text-lg mt-3">
            {application?.confirmationCode || application?.id}
          </p>
        </Card.Section>
        <FormSummaryDetails
          listing={listing}
          application={application}
          hidePreferences={
            listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)
              ?.length === 0
          }
          hidePrograms={
            listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)
              ?.length === 0
          }
          editMode={false}
        />
        <Card.Section>
          <div className="hide-for-print">
            <Button variant="text" size="sm" onClick={() => window.print()}>
              {t("application.confirmation.printCopy")}
            </Button>
          </div>
        </Card.Section>
      </Card>
    </>
  )
}

export { SubmittedApplicationView as default, SubmittedApplicationView }
