import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import FormSummaryDetails from "../shared/FormSummaryDetails"
import { CustomIconMap, listingSectionQuestions, AuthContext } from "@bloom-housing/shared-helpers"
import {
  Application,
  ApplicationStatusEnum,
  FeatureFlagEnum,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useMemo, useContext } from "react"
import { DATE_FORMAT } from "../../lib/constants"
import dayjs from "dayjs"
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
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const confirmationDate = useMemo(() => {
    return dayjs(application.submissionDate).format(DATE_FORMAT)
  }, [application.submissionDate])
  const confirmationNumber = application?.confirmationCode || application?.id
  const accessibleUnitWaitlistNumber = application?.accessibleUnitWaitlistNumber
  const conventionalUnitWaitlistNumber = application?.conventionalUnitWaitlistNumber
  const isWaitlistStatus =
    application?.status === ApplicationStatusEnum.waitlist ||
    application?.status === ApplicationStatusEnum.waitlistDeclined

  const displayNumbers: { label: string; value: string | number }[] = []
  if (isWaitlistStatus && accessibleUnitWaitlistNumber != undefined) {
    displayNumbers.push({
      label: t("application.yourAccessibleWaitlistNumber"),
      value: accessibleUnitWaitlistNumber,
    })
  }
  if (isWaitlistStatus && conventionalUnitWaitlistNumber != undefined) {
    displayNumbers.push({
      label: t("application.yourConventionalWaitlistNumber"),
      value: conventionalUnitWaitlistNumber,
    })
  }
  if (confirmationNumber) {
    displayNumbers.push({
      label: t("application.yourLotteryNumber"),
      value: confirmationNumber,
    })
  }

  return (
    <>
      <ApplicationListingCard
        listingName={application.listings?.name}
        listingId={application.listings?.id}
      />
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
          <Heading priority={2} size={"2xl"} className="mt-6 seeds-large-heading">
            {t("application.confirmation.informationSubmittedTitle")}
          </Heading>
          <p className="field-note mt-4">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
        </Card.Section>
        <Card.Section divider={"inset"} className={"border-none"}>
          {displayNumbers.map((item, index) => (
            <div
              key={item.label}
              className={index === displayNumbers.length - 1 ? "" : "seeds-p-be-content"}
            >
              <p>{`${item.label}:`}</p>
              <p className="font-semibold text-lg mt-3">{item.value}</p>
            </div>
          ))}
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
          enableUnitGroups={doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableUnitGroups)}
          enableFullTimeStudentQuestion={doJurisdictionsHaveFeatureFlagOn(
            FeatureFlagEnum.enableFullTimeStudentQuestion
          )}
          enableAdaOtherOption={doJurisdictionsHaveFeatureFlagOn(
            FeatureFlagEnum.enableAdaOtherOption
          )}
          swapCommunityTypeWithPrograms={doJurisdictionsHaveFeatureFlagOn(
            FeatureFlagEnum.swapCommunityTypeWithPrograms
          )}
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
