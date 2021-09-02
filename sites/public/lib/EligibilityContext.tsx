import React from "react"

class EligibilityRequirements {
  age: number
  householdSizeCount: number
  income: string
  disability: string
  completedSections: number

  constructor(age: number, householdSizeCount: number, income: string, disability: string) {
    this.age = age
    this.householdSizeCount = householdSizeCount
    this.income = income
    this.disability = disability
    this.completedSections = 0
  }

  setAge(age: number) {
    this.age = age
  }

  setHouseholdSizeCount(householdSizeCount: number) {
    this.householdSizeCount = householdSizeCount
  }
  setIncome(income: string) {
    this.income = income
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
