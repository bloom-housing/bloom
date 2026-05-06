import { useMemo, useContext } from "react"
import dayjs from "dayjs"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Icon, Tag } from "@bloom-housing/ui-seeds"
import FormSummaryDetails from "../shared/FormSummaryDetails"
import { CustomIconMap, listingSectionQuestions, AuthContext } from "@bloom-housing/shared-helpers"
import { getApplicationStatusVariant } from "@bloom-housing/shared-helpers/src/utilities/applicationStatus"
import {
  Application,
  ApplicationStatusEnum,
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { DATE_FORMAT } from "../../lib/constants"
import { ApplicationListingCard } from "../account/ApplicationCards"
import { isFeatureFlagOn } from "../../lib/helpers"
import styles from "./SubmittedApplicationView.module.scss"

interface SubmittedApplicationViewProps {
  application: Application
  listing: Listing
  backHref: string
  jurisdiction?: Jurisdiction
}

const SubmittedApplicationView = ({
  application,
  listing,
  backHref,
  jurisdiction,
}: SubmittedApplicationViewProps) => {
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const checkFeatureFlag = (flag: FeatureFlagEnum) => {
    return (
      isFeatureFlagOn(jurisdiction, flag) ||
      doJurisdictionsHaveFeatureFlagOn(flag, listing?.jurisdictions.id)
    )
  }

  const confirmationDate = useMemo(() => {
    return dayjs(application.submissionDate).format(DATE_FORMAT)
  }, [application.submissionDate])
  const confirmationNumber = application?.confirmationCode || application?.id
  const accessibleUnitWaitlistNumber = application?.accessibleUnitWaitlistNumber
  const conventionalUnitWaitlistNumber = application?.conventionalUnitWaitlistNumber
  const isWaitlistStatus =
    application?.status === ApplicationStatusEnum.waitlist ||
    application?.status === ApplicationStatusEnum.waitlistDeclined
  const isDeclinedStatus = application?.status === ApplicationStatusEnum.declined
  const applicationDeclineReason = application?.applicationDeclineReason

  const enableApplicationStatus = checkFeatureFlag(FeatureFlagEnum.enableApplicationStatus)
  const statusTagContent = application?.markedAsDuplicate
    ? t("application.details.applicationStatus.duplicate")
    : t(`application.details.applicationStatus.${application?.status}`)
  const statusTagVariant = application?.markedAsDuplicate
    ? "secondary-inverse"
    : getApplicationStatusVariant(application?.status)

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
        listingName={application.listings?.name || listing?.name}
        listingId={application.listings?.id || listing?.id}
      />
      <Card spacing={"lg"} className={"seeds-m-be-6"}>
        <Card.Section divider={"inset"}>
          <Button
            size="sm"
            leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
            variant={"text"}
            href={backHref}
          >
            {t("t.back")}
          </Button>
          <Heading priority={2} size={"2xl"} className="seeds-m-bs-6 seeds-large-heading">
            {t("application.confirmation.informationSubmittedTitle")}
          </Heading>
          <p className="field-note seeds-m-bs-4">
            {t("application.confirmation.submitted")}
            {confirmationDate}
          </p>
          {enableApplicationStatus && (
            <div className="seeds-m-bs-4">
              <Tag variant={statusTagVariant}>{statusTagContent}</Tag>
            </div>
          )}
        </Card.Section>
        <Card.Section divider={"inset"} className={"border-none"}>
          {displayNumbers.map((item, index) => (
            <div
              key={item.label}
              className={index === displayNumbers.length - 1 ? "" : "seeds-p-be-content"}
            >
              <p>{`${item.label}:`}</p>
              <p className={styles["highlighted-value"]}>{item.value}</p>
            </div>
          ))}
          {isDeclinedStatus && applicationDeclineReason && (
            <div className={displayNumbers.length > 0 ? "seeds-p-bs-content" : ""}>
              <p>{`${t("application.details.applicationDeclineReason")}:`}</p>
              <p className={styles["highlighted-value"]}>
                {t(`application.details.applicationDeclineReason.${applicationDeclineReason}`)}
              </p>
            </div>
          )}
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
          enableUnitGroups={checkFeatureFlag(FeatureFlagEnum.enableUnitGroups)}
          enableFullTimeStudentQuestion={checkFeatureFlag(
            FeatureFlagEnum.enableFullTimeStudentQuestion
          )}
          enableReasonableAccommodations={checkFeatureFlag(
            FeatureFlagEnum.enableReasonableAccommodations
          )}
          swapCommunityTypeWithPrograms={checkFeatureFlag(
            FeatureFlagEnum.swapCommunityTypeWithPrograms
          )}
          enableV2MSQ={checkFeatureFlag(FeatureFlagEnum.enableV2MSQ)}
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
