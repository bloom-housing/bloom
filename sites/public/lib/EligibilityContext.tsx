import React from "react"
import { AccessibilityFeatures } from "../pages/eligibility/accessibility"

export enum AgeRangeType {
  "LessThanFiftyFive" = "lessThan55",
  "FiftyFiveToSixtyOne" = "55to61",
  "SixtyTwoAndUp" = "62andUp",
  "PreferNotSay" = "preferNotSay",
}

/*export enum AccessibilityFeatures {
  "elevator"= "elevator",
  "wheelchairRamp"= "wheelchairRamp",
  "serviceAnimalsAllowed"= "serviceAnimalsAllowed",
  "accessibleParking"= "accessibleParking",
  "parkingOnSite"= "parkingOnSite",
  "inUnitWasherDryer"= "inUnitWasherDryer",
  "laundryInBuilding"= "laundryInBuilding",
  "barrierFreeEntrance"= "barrierFreeEntrance",
  "rollInShower"= "rollInShower",
  "grabBars"= "grabBars",
  "heatingInUnit"= "heatingInUnit",
  "acInUnit"= "acInUnit",
}*/

class EligibilityRequirements {
  age: AgeRangeType
  householdSizeCount: number
  income: string
  disability: string
  accessibility: AccessibilityFeatures
  completedSections: number

  constructor(age: AgeRangeType, householdSizeCount: number, income: string, disability: string, accessibility: AccessibilityFeatures) {
    this.age = age
    this.householdSizeCount = householdSizeCount
    this.income = income
    this.disability = disability
    this.accessibility = accessibility
    this.completedSections = 0
  }

  setAge(age: AgeRangeType) {
    this.age = age
  }

  setHouseholdSizeCount(householdSizeCount: number) {
    this.householdSizeCount = householdSizeCount
  }
  setIncome(income: string) {
    this.income = income
  }

  setAccessibility(accessibilityFeatures: AccessibilityFeatures){
    this.accessibility = accessibilityFeatures
  }

  setDisability(disability: string) {
    this.disability = disability
  }

  setCompletedSections(numCompleted: number) {
    this.completedSections = numCompleted
  }
}

export const blankEligibilityRequirements = () => {
  return new EligibilityRequirements(null, null, null, null, null)
}

export const EligibilityContext = React.createContext({
  eligibilityRequirements: blankEligibilityRequirements(),
})
