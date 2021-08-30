import React from "react"

class EligibilityRequirements {
  age: number
  bedroomCounts: string[]
  personCount: number
  income: string
  disability: string
  completedSections: number

  constructor(
    age: number,
    bedroomCounts: string[],
    personCount: number,
    income: string,
    disability: string
  ) {
    this.age = age
    this.bedroomCounts = bedroomCounts
    this.personCount = personCount
    this.income = income
    this.disability = disability
    this.completedSections = 0
  }

  setAge(age: number) {
    this.age = age
  }

  setBedroomCounts(bedroomCounts: string[]) {
    this.bedroomCounts = bedroomCounts
  }

  setPersonCount(personCount: number) {
    this.personCount = personCount
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
  return new EligibilityRequirements(null, null, null, null, null)
}

export const EligibilityContext = React.createContext({
  eligibilityRequirements: blankEligibilityRequirements(),
})
