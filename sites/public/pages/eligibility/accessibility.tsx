/*
Accessibility
Prompts the user for their age to filter for properties that are age dependent.
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  Form,
  ProgressNav,
  Field,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_DISCLAIMER_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext, AccessibilityFeatures } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"

const EligibilityAccessibility = () => {
  const router = useRouter()
  const CURRENT_PAGE = 4
  const { eligibilityRequirements } = useContext(EligibilityContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()

  const onSubmit = async (data) => {
    eligibilityRequirements.setElevator(data.elevator)
    eligibilityRequirements.setWheelchairRamp(data.wheelchairRamp)
    eligibilityRequirements.setServiceAnimalsAllowed(data.serviceAnimalsAllowed)
    eligibilityRequirements.setAccessibleParking(data.accessibleParking)
    eligibilityRequirements.setParkingOnSite(data.parkingOnSite)
    eligibilityRequirements.setInUnitWasherDryer(data.inUnitWasherDryer)
    eligibilityRequirements.setLaundryInBuilding(data.laundryInBuilding)
    eligibilityRequirements.setBarrierFreeEntrance(data.barrierFreeEntrance)
    eligibilityRequirements.setRollInShower(data.rollInShower)
    eligibilityRequirements.setGrabBars(data.grabBars)
    eligibilityRequirements.setHeatingInUnit(data.heatingInUnit)
    eligibilityRequirements.setaAcInUnit(data.acInUnit)
    await router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  const onClick = async (data) => {
    eligibilityRequirements.setElevator(data.elevator)
    eligibilityRequirements.setWheelchairRamp(data.wheelchairRamp)
    eligibilityRequirements.setServiceAnimalsAllowed(data.serviceAnimalsAllowed)
    eligibilityRequirements.setAccessibleParking(data.accessibleParking)
    eligibilityRequirements.setParkingOnSite(data.parkingOnSite)
    eligibilityRequirements.setInUnitWasherDryer(data.inUnitWasherDryer)
    eligibilityRequirements.setLaundryInBuilding(data.laundryInBuilding)
    eligibilityRequirements.setBarrierFreeEntrance(data.barrierFreeEntrance)
    eligibilityRequirements.setRollInShower(data.rollInShower)
    eligibilityRequirements.setGrabBars(data.grabBars)
    eligibilityRequirements.setHeatingInUnit(data.heatingInUnit)
    eligibilityRequirements.setaAcInUnit(data.acInUnit)
    await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  return (
    <FormsLayout>
      <FormCard header={t("eligibility.progress.header")}>
        <ProgressNav
          currentPageSection={5}
          completedSections={eligibilityRequirements.completedSections}
          labels={ELIGIBILITY_SECTIONS.map((label) => t(`eligibility.progress.sections.${label}`))}
          routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={eligibilityRoute(CURRENT_PAGE - 1)}
          onClick={() => {
            // Not extra actions needed.
          }}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__lead pb-0 pt-8">
            <h2 className="form-card__title is-borderless">
              {t("eligibility.accessibility.prompt")}
            </h2>
          </div>
          <div className="form-card__group is-borderless">
            <p className="field-note mb-4" id="accessibility-description">
              {t("eligibility.accessibility.description")}
            </p>
            <Field
              id="elevator"
              name="elevator"
              type="checkbox"
              label={t("eligibility.accessibility.elevator")}
              inputProps={{
                defaultChecked: eligibilityRequirements?.elevator,
              }}
              register={register}
            />
            <Field
              id="wheelchairRamp"
              name="wheelchairRamp"
              type="checkbox"
              label={t("eligibility.accessibility.wheelchairRamp")}
              inputProps={{
                defaultChecked: eligibilityRequirements.wheelchairRamp,
              }}
              register={register}
            />
            <Field
              id="serviceAnimalsAllowed"
              name="serviceAnimalsAllowed"
              type="checkbox"
              label={t("eligibility.accessibility.serviceAnimalsAllowed")}
              inputProps={{
                defaultChecked: eligibilityRequirements.serviceAnimalsAllowed,
              }}
              register={register}
            />
            <Field
              id="accessibleParking"
              name="accessibleParking"
              type="checkbox"
              label={t("eligibility.accessibility.accessibleParking")}
              inputProps={{
                defaultChecked: eligibilityRequirements.accessibleParking,
              }}
              register={register}
            />
            <Field
              id="parkingOnSite"
              name="parkingOnSite"
              type="checkbox"
              label={t("eligibility.accessibility.parkingOnSite")}
              inputProps={{
                defaultChecked: eligibilityRequirements.parkingOnSite,
              }}
              register={register}
            />
            <Field
              id="inUnitWasherDryer"
              name="inUnitWasherDryer"
              type="checkbox"
              label={t("eligibility.accessibility.inUnitWasherDryer")}
              inputProps={{
                defaultChecked: eligibilityRequirements.inUnitWasherDryer,
              }}
              register={register}
            />
            <Field
              id="laundryInBuilding"
              name="laundryInBuilding"
              type="checkbox"
              label={t("eligibility.accessibility.laundryInBuilding")}
              inputProps={{
                defaultChecked: eligibilityRequirements.laundryInBuilding,
              }}
              register={register}
            />
            <Field
              id="barrierFreeEntrance"
              name="barrierFreeEntrance"
              type="checkbox"
              label={t("eligibility.accessibility.barrierFreeEntrance")}
              inputProps={{
                defaultChecked: eligibilityRequirements.barrierFreeEntrance,
              }}
              register={register}
            />
            <Field
              id="rollInShower"
              name="rollInShower"
              type="checkbox"
              label={t("eligibility.accessibility.rollInShower")}
              inputProps={{
                defaultChecked: eligibilityRequirements.rollInShower,
              }}
              register={register}
            />
            <Field
              id="grabBars"
              name="grabBars"
              type="checkbox"
              label={t("eligibility.accessibility.grabBars")}
              inputProps={{
                defaultChecked: eligibilityRequirements.grabBars,
              }}
              register={register}
            />
            <Field
              id="heatingInUnit"
              name="heatingInUnit"
              type="checkbox"
              label={t("eligibility.accessibility.heatingInUnit")}
              inputProps={{
                defaultChecked: eligibilityRequirements.heatingInUnit,
              }}
              register={register}
            />
            <Field
              id="acInUnit"
              name="acInUnit"
              type="checkbox"
              label={t("eligibility.accessibility.acInUnit")}
              inputProps={{
                defaultChecked: eligibilityRequirements.acInUnit,
              }}
              register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
              <Button
                type="button"
                onClick={handleSubmit(onClick)}
                className="mx-2 mt-6"
                styleType={AppearanceStyleType.primary}
              >
                {t("t.finish")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default EligibilityAccessibility
