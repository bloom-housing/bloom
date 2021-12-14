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
    FieldGroup,
  } from "@bloom-housing/ui-components"
  import FormsLayout from "../../layouts/forms"
  import { useForm } from "react-hook-form"
  import React, { useContext } from "react"
  import { useRouter } from "next/router"
  import { ELIGIBILITY_DISCLAIMER_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
  import { EligibilityContext } from "../../lib/EligibilityContext"
  import FormBackLink from "../../src/forms/applications/FormBackLink"
  import { eligibilityRoute } from "../../lib/helpers"

  export class AccessibilityFeatures {
    elevator: boolean
    wheelchairRamp: boolean
    serviceAnimalsAllowed: boolean
    accessibleParking: boolean
    parkingOnSite: boolean
    inUnitWasherDryer: boolean
    laundryInBuilding: boolean
    barrierFreeEntrance: boolean
    rollInShower: boolean
    grabBars: boolean
    heatingInUnit: boolean
    acInUnit: boolean

    constructor(elevator: boolean,
      wheelchairRamp: boolean,
      serviceAnimalsAllowed: boolean,
      accessibleParking: boolean,
      parkingOnSite: boolean,
      inUnitWasherDryer: boolean,
      laundryInBuilding: boolean,
      barrierFreeEntrance: boolean,
      rollInShower: boolean,
      grabBars: boolean,
      heatingInUnit: boolean,
      acInUnit: boolean) {
      this.elevator = elevator
      this.wheelchairRamp = wheelchairRamp
      this.serviceAnimalsAllowed = serviceAnimalsAllowed
      this.accessibleParking = accessibleParking
      this.parkingOnSite = parkingOnSite
      this.inUnitWasherDryer = inUnitWasherDryer
      this.laundryInBuilding = laundryInBuilding
      this.barrierFreeEntrance = barrierFreeEntrance
      this.rollInShower = rollInShower
      this.grabBars = grabBars
      this.heatingInUnit = heatingInUnit
      this.acInUnit = acInUnit
    }
  
    setElevator(elevator: boolean) {
      this.elevator = elevator
    }
  
    
  }
  
  const EligibilityAccessibility = () => {
    const AccFilter = new AccessibilityFeatures(false, false, false, false, false, false, false, false, false, false, false, false)
    const router = useRouter()
    const CURRENT_PAGE = 4
    const { eligibilityRequirements } = useContext(EligibilityContext)
    /* Form Handler */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { handleSubmit, register } = useForm()
  
    const onSubmit = async (data) => {
      eligibilityRequirements.setAccessibility()
      await router.push(eligibilityRoute(CURRENT_PAGE + 1))
    }
  
    const onClick = async (data) => {
      eligibilityRequirements.setAccessibility()
      accessibilityValues[0].
      await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
    }

    /*var AccessibilityFeature: {[key: string]: boolean} = {
      "elevator": false,
      "wheelchairRamp": false,
      "serviceAnimalsAllowed": false,
      "accessibleParking": false,
      "parkingOnSite": false,
      "inUnitWasherDryer": false,
      "laundryInBuilding": false,
      "barrierFreeEntrance": false,
      "rollInShower": false,
      "grabBars": false,
      "heatingInUnit": false,
      "acInUnit": false,
    } */   
  
    
    const accessibilityValues = [
        {
            id: "elevator",
            value: AccessibilityFeatures.elevator,
            label: t("eligibility.accessibility.elevator"),
            defaultChecked: false,
          },
          {
            id: "wheelchairRamp",
            value: AccessibilityFeatures.wheelchairRamp,
            label: t("eligibility.accessibility.wheelchairRamp"),
            defaultChecked: false,
          },
          {
            id: "serviceAnimalsAllowed",
            value: AccessibilityFeatures.serviceAnimalsAllowed,
            label: t("eligibility.accessibility.serviceAnimalsAllowed"),
            defaultChecked: false,
          },
          {
            id: "accessibleParking",
            value: AccessibilityFeatures.accessibleParking,
            label: t("eligibility.accessibility.accessibleParking"),
            defaultChecked: false,
          },
          {
            id: "parkingOnSite",
            value: AccessibilityFeatures.parkingOnSite,
            label: t("eligibility.parkingOnSite"),
            defaultChecked: false,
          },
          {
            id: "inUnitWasherDryer",
            value: AccessibilityFeatures.inUnitWasherDryer,
            label: t("eligibility.accessibility.inUnitWasherDryer"),
            defaultChecked: false,
          },
          {
            id: "laundryInBuilding",
            value: AccessibilityFeatures.laundryInBuilding,
            label: t("eligibility.accessibility.laundryInBuilding"),
            defaultChecked: false,
          },
          {
            id: "barrierFreeEntrance",
            value: AccessibilityFeatures.barrierFreeEntrance,
            label: t("eligibility.accessibility.barrierFreeEntrance"),
            defaultChecked: false,
          },
          {
            id: "rollInShower",
            value: AccessibilityFeatures.rollInShower,
            label: t("eligibility.accessibility.rollInShower"),
            defaultChecked: false,
          },
          {
            id: "grabBars",
            value: AccessibilityFeatures.grabBars,
            label: t("eligibility.accessibility.grabBars"),
            defaultChecked: false,
          },
          {
            id: "heatingInUnit",
            value: AccessibilityFeatures.heatingInUnit,
            label: t("eligibility.accessibility.heatingInUnit"),
            defaultChecked: false,
          },
          {
            id: "acInUnit",
            value: AccessibilityFeatures.acInUnit,
            label: t("eligibility.accessibility.acInUnit"),
            defaultChecked: false,
          },
    ]
  
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
              <h2 className="form-card__title is-borderless">{t("eligibility.accessibility.prompt")}</h2>
            </div>
            <div className="form-card__group is-borderless">
              <p className="field-note mb-4" id="accessibility-description">
                {t("eligibility.accessibility.description")}
              </p>
              <FieldGroup
                type="checkbox"
                name="accessibility"
                register={register}
                fields={accessibilityValues}
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
  