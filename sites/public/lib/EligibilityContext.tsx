import React from "react"

export enum AgeRangeType {
  "LessThanFiftyFive" = "lessThan55",
  "FiftyFiveToSixtyOne" = "55to61",
  "SixtyTwoAndUp" = "62andUp",
  "PreferNotSay" = "preferNotSay",
}

export enum AccessibilityFeatures {
  "elevator"= "Elevator",
      "wheelchair_ramp"= "wheelchairRamp",
      "service_animals_allowed"= "serviceAnimalsAllowed",
      "accessible_parking"= "accessibleParking",
      "parking_on_site"= "parkingOnSite",
      "in_unit_washer_dryer"= "inUnitWasherDryer",
      "laundry_in_building"= "laundryInBuilding",
      "barrier_free_entrance"= "barrierFreeEntrance",
      "roll_in_shower"= "rollInShower",
      "grab_bars"= "grabBars",
      "heating_in_unit"= "heatingInUnit",
      "ac_in_unit"= "acInUnit",
}

class EligibilityRequirements {
  age: AgeRangeType
  householdSizeCount: number
  income: string
  disability: string
  completedSections: number

  constructor(age: AgeRangeType, householdSizeCount: number, income: string, disability: string) {
    this.age = age
    this.householdSizeCount = householdSizeCount
    this.income = income
    this.disability = disability
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

  setAccessibility(){
  }

  setDisability(disability: string) {
    this.disability = disability
  }

  setCompletedSections(numCompleted: number) {
    this.completedSections = numCompleted
  }
}

export const blankEligibilityRequirements = () => {
  return new EligibilityRequirements(null, null, null, null)
}

export const EligibilityContext = React.createContext({
  eligibilityRequirements: blankEligibilityRequirements(),
})
