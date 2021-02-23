import { HouseholdMemberUpdate } from "./backend-swagger"

export class Member implements HouseholdMemberUpdate {
  id: string
  orderId = undefined as number | undefined
  firstName = ""
  middleName = ""
  lastName = ""
  birthMonth = undefined
  birthDay = undefined
  birthYear = undefined
  emailAddress = ""
  noEmail = undefined
  phoneNumber = ""
  phoneNumberType = ""
  noPhone = undefined

  constructor(orderId: number) {
    this.orderId = orderId
  }
  address = {
    placeName: undefined,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: undefined,
    longitude: undefined,
  }
  workAddress = {
    placeName: undefined,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: undefined,
    longitude: undefined,
  }
  sameAddress?: string
  relationship?: string
  workInRegion?: string
}
