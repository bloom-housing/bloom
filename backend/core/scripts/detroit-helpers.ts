import * as client from "../types/src/backend-swagger"
import axios from "axios"
import { serviceOptions } from "../types/src/backend-swagger"
import { CountyCode } from "../src/shared/types/county-code"
import { UnitStatus } from "../src/units/types/unit-status-enum"

export function createUnitsArray(type: string, number: number) {
  const units = []
  for (let unit_index = 0; unit_index < number; unit_index++) {
    units.push({
      unitType: type,
      status: UnitStatus.unknown,
    })
  }
  return units
}

export async function getJurisdictions(
  apiUrl: string,
  email: string,
  password: string
): Promise<client.Jurisdiction[]> {
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
  })
  // Log in to retrieve an access token.
  const authService = new client.AuthService()
  const { accessToken } = await authService.login({
    body: {
      email: email,
      password: password,
    },
  })

  // Update the axios config so future requests include the access token in the header.
  serviceOptions.axios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const jurisdictionsService = new client.JurisdictionsService()

  return jurisdictionsService.list()
}

export async function getDetroitJurisdiction(
  apiUrl: string,
  email: string,
  password: string
): Promise<client.Jurisdiction> {
  try {
    const jurisdictions = await getJurisdictions(apiUrl, email, password)
    return jurisdictions.find((jurisdiction) => jurisdiction.name === CountyCode.detroit)
  } catch (e) {
    console.log(e)
    return undefined
  }
}
