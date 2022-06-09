/*
Accessibility
Prompts the user for their age to filter for properties that are age dependent.
*/
import { t, Field } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { EligibilityContext } from "../../lib/EligibilityContext"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityAccessibility = () => {
  const { eligibilityRequirements } = useContext(EligibilityContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formMethods = useForm()

  const onSubmitAccessibility = (data) => {
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
    eligibilityRequirements.setBarrierFreeUnitEntrance(data.barrierFreeUnitEntrance)
    eligibilityRequirements.setLoweredLightSwitch(data.loweredLightSwitch)
    eligibilityRequirements.setBarrierFreeBathroom(data.barrierFreeBathroom)
    eligibilityRequirements.setWideDoorways(data.wideDoorways)
    eligibilityRequirements.setLoweredCabinets(data.loweredCabinets)
  }

  return (
    <EligibilityLayout
      title={t("eligibility.accessibility.prompt")}
      currentPage={4}
      formMethods={formMethods}
      onFinishStep={onSubmitAccessibility}
    >
      <div className="form-card__group is-borderless">
        <p className="field-note mb-4" id="accessibility-description">
          {t("eligibility.accessibility.description")}
        </p>
        <div className="accessibility-eligibility-selector">
          <Field
            id="elevator"
            name="elevator"
            type="checkbox"
            label={t("eligibility.accessibility.elevator")}
            inputProps={{
              defaultChecked: eligibilityRequirements?.elevator,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="wheelchairRamp"
            name="wheelchairRamp"
            type="checkbox"
            label={t("eligibility.accessibility.wheelchairRamp")}
            inputProps={{
              defaultChecked: eligibilityRequirements.wheelchairRamp,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="serviceAnimalsAllowed"
            name="serviceAnimalsAllowed"
            type="checkbox"
            label={t("eligibility.accessibility.serviceAnimalsAllowed")}
            inputProps={{
              defaultChecked: eligibilityRequirements.serviceAnimalsAllowed,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="accessibleParking"
            name="accessibleParking"
            type="checkbox"
            label={t("eligibility.accessibility.accessibleParking")}
            inputProps={{
              defaultChecked: eligibilityRequirements.accessibleParking,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="parkingOnSite"
            name="parkingOnSite"
            type="checkbox"
            label={t("eligibility.accessibility.parkingOnSite")}
            inputProps={{
              defaultChecked: eligibilityRequirements.parkingOnSite,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="inUnitWasherDryer"
            name="inUnitWasherDryer"
            type="checkbox"
            label={t("eligibility.accessibility.inUnitWasherDryer")}
            inputProps={{
              defaultChecked: eligibilityRequirements.inUnitWasherDryer,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="laundryInBuilding"
            name="laundryInBuilding"
            type="checkbox"
            label={t("eligibility.accessibility.laundryInBuilding")}
            inputProps={{
              defaultChecked: eligibilityRequirements.laundryInBuilding,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="barrierFreeEntrance"
            name="barrierFreeEntrance"
            type="checkbox"
            label={t("eligibility.accessibility.barrierFreeEntrance")}
            inputProps={{
              defaultChecked: eligibilityRequirements.barrierFreeEntrance,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="rollInShower"
            name="rollInShower"
            type="checkbox"
            label={t("eligibility.accessibility.rollInShower")}
            inputProps={{
              defaultChecked: eligibilityRequirements.rollInShower,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="grabBars"
            name="grabBars"
            type="checkbox"
            label={t("eligibility.accessibility.grabBars")}
            inputProps={{
              defaultChecked: eligibilityRequirements.grabBars,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="heatingInUnit"
            name="heatingInUnit"
            type="checkbox"
            label={t("eligibility.accessibility.heatingInUnit")}
            inputProps={{
              defaultChecked: eligibilityRequirements.heatingInUnit,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="acInUnit"
            name="acInUnit"
            type="checkbox"
            label={t("eligibility.accessibility.acInUnit")}
            inputProps={{
              defaultChecked: eligibilityRequirements.acInUnit,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="barrierFreeUnitEntrance"
            name="barrierFreeUnitEntrance"
            type="checkbox"
            label={t("eligibility.accessibility.barrierFreeUnitEntrance")}
            inputProps={{
              defaultChecked: eligibilityRequirements.barrierFreeUnitEntrance,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="loweredLightSwitch"
            name="loweredLightSwitch"
            type="checkbox"
            label={t("eligibility.accessibility.loweredLightSwitch")}
            inputProps={{
              defaultChecked: eligibilityRequirements.loweredLightSwitch,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="barrierFreeBathroom"
            name="barrierFreeBathroom"
            type="checkbox"
            label={t("eligibility.accessibility.barrierFreeBathroom")}
            inputProps={{
              defaultChecked: eligibilityRequirements.barrierFreeBathroom,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="wideDoorways"
            name="wideDoorways"
            type="checkbox"
            label={t("eligibility.accessibility.wideDoorways")}
            inputProps={{
              defaultChecked: eligibilityRequirements.wideDoorways,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
          <Field
            id="loweredCabinets"
            name="loweredCabinets"
            type="checkbox"
            label={t("eligibility.accessibility.loweredCabinets")}
            inputProps={{
              defaultChecked: eligibilityRequirements.loweredCabinets,
            }}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            register={formMethods.register}
          />
        </div>
      </div>
    </EligibilityLayout>
  )
}

export default EligibilityAccessibility
