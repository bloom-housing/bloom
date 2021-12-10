import React from "react"

export enum AgeRangeType {
  "LessThanFiftyFive" = "lessThan55",
  "FiftyFiveToSixtyOne" = "55to61",
  "SixtyTwoAndUp" = "62andUp",
  "PreferNotSay" = "preferNotSay",
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
