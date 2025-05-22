import { FormProvider, useForm } from "react-hook-form"
import { useState } from "react"
import { BloomCard, CustomIconMap, listingFeatures } from "@bloom-housing/shared-helpers"
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ProgressNav, StepHeader, t } from "@bloom-housing/ui-components"
import { Button, Heading, Icon } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FinderMultiselectQuestion from "./FinderMultiselectQuestion"
import FinderRentQuestion from "./FinderRentQuestion"
import styles from "./RentalsFinder.module.scss"
import FinderDisclaimer from "./FinderDisclaimer"

type FinderStep = {
  content: React.ReactNode
  question: string
  subtitle: string
}

type FinderSection = {
  sectionTitle?: string
  sectionSteps: FinderStep[]
}

const buildingTypes = ["withDisabilities", "senior55", "senior62", "homeless", "veterans"]

export default function RentalsFinder() {
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [sectionIndex, setSectionIndex] = useState<number>(0)
  const formMethods = useForm()

  const rentalFinderSections: FinderSection[] = [
    {
      sectionTitle: t("finder.housingSectionTitle"),
      sectionSteps: [
        {
          question: t("finder.bedrooms.question"),
          subtitle: t("finder.bedrooms.subtitle"),
          content: (
            <FinderMultiselectQuestion
              legend={t("finder.multiselectLegend")}
              fieldGroupName="bedrooms_count"
              options={[
                {
                  label: t("application.household.preferredUnit.options.studio"),
                  value: "studio",
                },
                {
                  label: t("application.household.preferredUnit.options.oneBdrm"),
                  value: "oneBdrm",
                },
                {
                  label: t("application.household.preferredUnit.options.twoBdrm"),
                  value: "twoBdrm",
                },
                {
                  label: t("application.household.preferredUnit.options.threeBdrm"),
                  value: "threBdrm",
                },
                {
                  label: t("finder.bedrooms.fourMoreBdrm"),
                  value: "fourMoreBdrm",
                },
              ]}
            />
          ),
        },
        {
          question: t("finder.region.question"),
          subtitle: t("finder.region.subtitle"),
          content: (
            <FinderMultiselectQuestion
              legend={t("finder.multiselectLegend")}
              fieldGroupName="region"
              options={Object.keys(RegionEnum).map((region) => ({
                label: region.replace("_", " "),
                value: region,
              }))}
            />
          ),
        },
        {
          question: t("finder.rent.question"),
          subtitle: t("finder.rent.subtitle"),
          content: <FinderRentQuestion />,
        },
      ],
    },
    {
      sectionTitle: t("t.accessibility"),
      sectionSteps: [
        {
          question: t("finder.accessibility.question"),
          subtitle: t("finder.accessibility.subtitle"),
          content: (
            <FinderMultiselectQuestion
              legend={t("finder.multiselectLegend")}
              fieldGroupName="accessibility"
              options={listingFeatures.map((feature) => ({
                label: t(`eligibility.accessibility.${feature}`),
                value: feature,
              }))}
            />
          ),
        },
      ],
    },
    {
      sectionTitle: t("finder.buildingSectionTitle"),
      sectionSteps: [
        {
          question: t("finder.building.question"),
          subtitle: t("finder.building.subtitle"),
          content: (
            <FinderMultiselectQuestion
              legend={t("")}
              fieldGroupName="communityType"
              options={buildingTypes.map((type) => ({
                label: t(`finder.building.${type}`),
                value: type,
              }))}
            />
          ),
        },
      ],
    },
    {
      sectionSteps: [
        {
          question: t("finder.disclaimer.question"),
          subtitle: t("finder.disclaimer.subtitle"),
          content: <FinderDisclaimer />,
        },
      ],
    },
  ]

  const sectionLabels = rentalFinderSections
    .filter((section) => !!section.sectionTitle)
    .map((section) => section.sectionTitle)

  const activeQuestion = rentalFinderSections[sectionIndex]?.sectionSteps[stepIndex]
  const isLastSection = sectionIndex === rentalFinderSections.length - 1
  const isLastStep = stepIndex === rentalFinderSections[sectionIndex]?.sectionSteps.length - 1

  const onNextClick = () => {
    if (isLastStep) {
      setSectionIndex((prev) => prev + 1)
      setStepIndex(0)
    } else {
      setStepIndex((prev) => prev + 1)
    }
  }

  const onPreviousClick = () => {
    if (stepIndex == 0) {
      const prevSectionIndex = sectionIndex - 1
      const numberOfSteps = rentalFinderSections[prevSectionIndex]?.sectionSteps.length
      setStepIndex(numberOfSteps - 1)
      setSectionIndex(prevSectionIndex)
    } else {
      setStepIndex((prev) => prev - 1)
    }
  }

  return (
    <div className={styles["finder-container"]}>
      <div className={styles["questionnaire-container"]}>
        <div className={styles["questionnaire-header"]}>
          <Heading priority={1} size="2xl" className={styles["title"]}>
            {t("finder.finderTitle")}
          </Heading>
          <ProgressNav
            labels={sectionLabels}
            currentPageSection={sectionIndex + 1}
            completedSections={sectionIndex}
            style="bar"
            removeSrHeader
            mounted={true}
          />
          {sectionIndex <= sectionLabels.length - 1 && (
            <StepHeader
              currentStep={sectionIndex + 1}
              totalSteps={sectionLabels.length}
              stepPreposition={t("finder.progress.stepPreposition")}
              stepLabeling={sectionLabels}
              priority={2}
              className={styles["step-header"]}
            />
          )}
        </div>
        <BloomCard
          className={styles["questionnaire-card"]}
          headerLink={
            <>
              {!(sectionIndex === 0 && stepIndex === 0) && (
                <Button
                  onClick={onPreviousClick}
                  leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
                  variant={"text"}
                  className={styles["back-button"]}
                >
                  {t("t.back")}
                </Button>
              )}
            </>
          }
          title={activeQuestion.question}
          subtitle={activeQuestion.subtitle}
          headingPriority={2}
        >
          <>
            <CardSection className={styles["questions-section"]} divider="flush">
              <div className={styles["questions-wrapper"]}>
                <FormProvider {...formMethods}>{activeQuestion.content}</FormProvider>
              </div>
            </CardSection>
            <CardSection className={styles["button-section"]} divider="flush">
              <div className={styles["button-wrapper"]}>
                {isLastSection && isLastStep ? (
                  <Button>{t("t.finish")}</Button>
                ) : (
                  <Button onClick={onNextClick}>{t("t.next")}</Button>
                )}
              </div>
            </CardSection>
            {sectionIndex <= sectionLabels.length - 1 && (
              <CardSection>
                <div className={styles["footer"]}>
                  <Button variant="text">{t("finder.skip")}</Button>
                </div>
              </CardSection>
            )}
          </>
        </BloomCard>
      </div>
    </div>
  )
}
