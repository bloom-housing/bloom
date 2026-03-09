import { FormProvider, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useCallback, useMemo, useRef, useState } from "react"
import { BloomCard, CustomIconMap } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ListingFeaturesConfiguration,
  ListingFilterKeys,
  MultiselectQuestion,
  RegionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Form, ProgressNav, StepHeader, t } from "@bloom-housing/ui-components"
import { Button, Heading, Icon } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FinderDisclaimer from "./FinderDisclaimer"
import FinderMultiselectQuestion from "./FinderMultiselectQuestion"
import FinderRentQuestion from "./FinderRentQuestion"
import styles from "./RentalsFinder.module.scss"
import {
  buildDefaultFilterFields,
  encodeFilterDataToQuery,
  FilterData,
  getAccessibilityFeatureKeys,
  ReservedCommunityTypes,
  unitTypeMapping,
  unitTypesSorted,
  unitTypesSortedByUnitGroups,
  unitTypeUnitGroupsMapping,
} from "../browse/FilterDrawerHelpers"

type FinderStep = {
  content: React.ReactNode
  question: string
  subtitle: string
}

type FinderSection = {
  sectionTitle?: string
  sectionSteps: FinderStep[]
}

export type RentalsFinderProps = {
  activeFeatureFlags: FeatureFlagEnum[]
  listingFeaturesConfiguration?: ListingFeaturesConfiguration
  multiselectData: MultiselectQuestion[]
}

const setFocusToTitle = () => {
  document.getElementById("finder-card-title")?.focus()
  return
}

export default function RentalsFinder({
  activeFeatureFlags,
  listingFeaturesConfiguration,
  multiselectData,
}: RentalsFinderProps) {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [sectionIndex, setSectionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<FilterData>({})
  const formMethods = useForm<FilterData>()
  const stepHeaderRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { reset, handleSubmit, getValues, errors } = formMethods

  const rentalFinderSections: FinderSection[] = useMemo(
    () => [
      {
        sectionTitle: t("finder.housingSectionTitle"),
        sectionSteps: [
          {
            question: t("finder.bedrooms.question"),
            subtitle: t("finder.bedrooms.subtitle"),
            content: (
              <FinderMultiselectQuestion
                legend={t("finder.multiselectLegend")}
                fieldGroupName={ListingFilterKeys.bedrooms}
                options={buildDefaultFilterFields(
                  ListingFilterKeys.bedroomTypes,
                  activeFeatureFlags.some((flag) => flag == FeatureFlagEnum.enableUnitGroups)
                    ? unitTypesSortedByUnitGroups.map((unitType) =>
                        t(unitTypeUnitGroupsMapping[unitType].labelKey)
                      )
                    : unitTypesSorted.map((unitType) => t(unitTypeMapping[unitType].labelKey)),
                  activeFeatureFlags.some((flag) => flag == FeatureFlagEnum.enableUnitGroups)
                    ? unitTypesSortedByUnitGroups
                    : unitTypesSorted,
                  {}
                )}
              />
            ),
          },
          ...(activeFeatureFlags.some((flag) => flag == FeatureFlagEnum.enableRegions)
            ? [
                {
                  question: t("finder.region.question"),
                  subtitle: t("finder.region.subtitle"),
                  content: (
                    <FinderMultiselectQuestion
                      legend={t("finder.multiselectLegend")}
                      fieldGroupName={ListingFilterKeys.regions}
                      options={Object.keys(RegionEnum).map((region) => ({
                        key: `${ListingFilterKeys.regions}.${region}`,
                        label: region.replace("_", " "),
                        defaultChecked: false,
                      }))}
                    />
                  ),
                },
              ]
            : []),
          {
            question: t("finder.rent.question"),
            subtitle: t("finder.rent.subtitle"),
            content: <FinderRentQuestion />,
          },
        ],
      },
      ...(activeFeatureFlags.some((flag) => flag == FeatureFlagEnum.enableAccessibilityFeatures) &&
      listingFeaturesConfiguration
        ? [
            {
              sectionTitle: t("t.accessibility"),
              sectionSteps: [
                {
                  question: t("finder.accessibility.question"),
                  subtitle: t("finder.accessibility.subtitle"),
                  content: (
                    <FinderMultiselectQuestion
                      legend={t("finder.multiselectLegend")}
                      fieldGroupName={ListingFilterKeys.listingFeatures}
                      options={buildDefaultFilterFields(
                        ListingFilterKeys.listingFeatures,
                        "eligibility.accessibility",
                        getAccessibilityFeatureKeys(listingFeaturesConfiguration),
                        {}
                      )}
                    />
                  ),
                },
              ],
            },
          ]
        : []),
      {
        sectionTitle: t("finder.buildingSectionTitle"),
        sectionSteps: [
          {
            question: t("finder.building.question"),
            subtitle: t("finder.building.subtitle"),
            content: activeFeatureFlags.some(
              (flag) => flag === FeatureFlagEnum.swapCommunityTypeWithPrograms
            ) ? (
              <FinderMultiselectQuestion
                legend={t("finder.multiselectLegend")}
                fieldGroupName={ListingFilterKeys.multiselectQuestions}
                options={multiselectData.map((entry) => ({
                  key: `${ListingFilterKeys.multiselectQuestions}.${entry.id}`,
                  label: entry.untranslatedText
                    ? t(`listingFilters.program.${entry.untranslatedText}`)
                    : t(`listingFilters.program.${entry.text}`),
                  defaultChecked: false,
                }))}
              />
            ) : (
              <FinderMultiselectQuestion
                legend={t("finder.multiselectLegend")}
                fieldGroupName={ListingFilterKeys.reservedCommunityTypes}
                options={Object.values(ReservedCommunityTypes).map((type) => ({
                  key: `${ListingFilterKeys.reservedCommunityTypes}.${type}`,
                  label: t(`finder.building.${type}`),
                  defaultChecked: false,
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
    ],
    [activeFeatureFlags, multiselectData]
  )

  const sectionLabels = useMemo(
    () =>
      rentalFinderSections
        .filter((section) => !!section.sectionTitle)
        .map((section) => section.sectionTitle),
    [rentalFinderSections]
  )

  const activeQuestion = rentalFinderSections[sectionIndex]?.sectionSteps[stepIndex]
  const isLastSection = sectionIndex === rentalFinderSections.length - 1
  const isLastStep = stepIndex === rentalFinderSections[sectionIndex]?.sectionSteps.length - 1

  const onNextClick = useCallback(() => {
    if (Object.keys(errors).length > 0) return
    setFormData((prev) => ({ ...prev, ...getValues() }))
    if (isLastStep) {
      setSectionIndex((prev) => prev + 1)
      setStepIndex(0)
      stepHeaderRef.current?.focus()
    } else {
      setStepIndex((prev) => prev + 1)
      document.getElementById("finder-card-title")?.focus()
    }
    window.scrollTo({ top: 0 })
  }, [errors, isLastStep, getValues])

  const onPreviousClick = useCallback(() => {
    if (JSON.stringify(getValues()) !== JSON.stringify(formData)) {
      const newFormData = { ...formData, ...getValues() }
      setFormData(newFormData)
      reset(newFormData)
    } else {
      reset(formData)
    }

    if (stepIndex == 0) {
      const prevSectionIndex = sectionIndex - 1
      const numberOfSteps = rentalFinderSections[prevSectionIndex]?.sectionSteps.length
      setStepIndex(numberOfSteps - 1)
      setSectionIndex(prevSectionIndex)
      stepHeaderRef.current?.focus()
    } else {
      setStepIndex((prev) => prev - 1)
      setFocusToTitle()
    }
  }, [formData, stepIndex, sectionIndex, getValues, rentalFinderSections, reset])

  const onSkipClick = useCallback(() => {
    setSectionIndex(rentalFinderSections.length - 1)
    setStepIndex(0)
  }, [rentalFinderSections.length])

  const onSubmit = useCallback(() => {
    const searchQuery = encodeFilterDataToQuery(formData)
    void router.push(searchQuery ? `/listings?${searchQuery}` : "/listings")
  }, [formData, router])

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
            <div tabIndex={-1} ref={stepHeaderRef}>
              <StepHeader
                currentStep={sectionIndex + 1}
                totalSteps={sectionLabels.length}
                stepPreposition={t("finder.progress.stepPreposition")}
                stepLabeling={sectionLabels}
                priority={2}
              />
            </div>
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
          titleTabIndex={-1}
          titleId="finder-card-title"
          subtitle={activeQuestion.subtitle}
          headingPriority={2}
        >
          <Form id="finderForm" onSubmit={handleSubmit(onSubmit)}>
            <CardSection className={styles["questions-section"]} divider="flush">
              <div className={styles["questions-wrapper"]}>
                <FormProvider {...formMethods}>{activeQuestion.content}</FormProvider>
              </div>
            </CardSection>
            <CardSection className={styles["button-section"]} divider="flush">
              <div className={styles["button-wrapper"]}>
                {isLastSection && isLastStep ? (
                  <Button key="submit" type="submit">
                    {t("t.finish")}
                  </Button>
                ) : (
                  <Button key="next" onClick={onNextClick}>
                    {t("t.next")}
                  </Button>
                )}
              </div>
            </CardSection>
            {sectionIndex <= sectionLabels.length - 1 && (
              <CardSection>
                <div className={styles["footer"]}>
                  <Button variant="text" onClick={onSkipClick}>
                    {t("finder.skip")}
                  </Button>
                </div>
              </CardSection>
            )}
          </Form>
        </BloomCard>
      </div>
    </div>
  )
}
