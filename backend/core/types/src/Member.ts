import { HouseholdMemberUpdate } from "./backend-swagger"

export class Member implements HouseholdMemberUpdate {
  id: string
  orderId = undefined as number | undefined
  firstName = ""
  middleName = ""
  lastName = ""
  birthMonth = null
  birthDay = null
  birthYear = null
  emailAddress = ""
  noEmail = null
  phoneNumber = ""
  phoneNumberType = ""
  noPhone = null

  constructor(orderId: number) {
    this.orderId = orderId
  }
  address = {
    placeName: null,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  }
  workAddress = {
    placeName: null,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  }
  sameAddress?: string
  relationship?: string
  workInRegion?: string
}
