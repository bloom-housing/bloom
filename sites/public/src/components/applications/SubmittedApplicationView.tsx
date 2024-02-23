import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import FormSummaryDetails from "../shared/FormSummaryDetails"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import React, { useMemo } from "react"
import { DATE_FORMAT } from "../../lib/constants"
import dayjs from "dayjs"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import {
  Application,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
    return dayjs().format(DATE_FORMAT)
  }, [])

  return (
    <>
      <Card spacing={"sm"} className={"my-6"}>
        <Card.Section className={"bg-primary px-8 py-4"}>
          <Heading priority={1} size="xl" className={"font-bold font-alt-sans text-white"}>
            {listing?.name}
          </Heading>
        </Card.Section>
        <Card.Section className={"px-8"}>
          <div>
            {listing && (
              <Button
                size="sm"
                variant={"text"}
                href={`/listing/${listing.id}/${listing?.urlSlug}`}
              >
                {t("application.confirmation.viewOriginalListing")}
              </Button>
            )}
          </div>
        </Card.Section>
      </Card>
      <Card spacing={"lg"} className={"mb-6"}>
        <Card.Section divider={"inset"}>
          <Button
            size="sm"
            leadIcon={<Icon icon={faChevronLeft} />}
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
