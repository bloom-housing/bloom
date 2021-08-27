import * as client from "../types/src/backend-swagger"
import { Language, serviceOptions } from "../types/src/backend-swagger"
import axios from "axios"
import * as crypto from "crypto"

const adminUsername = "admin@example.com" || process.env.ADMIN_USERNAME
const adminPassword = "abcdef" || process.env.ADMIN_PASSWORD
const backendUrl = "http://localhost:3100" || process.env.BACKEND_URL

const generatePassword = (
  length = 20,
  wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$"
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("")

const [targetUserEmail, targetFirstName, targetLastName, ...listingIds] = process.argv.slice(2)

if (!targetUserEmail || !targetFirstName || !targetLastName) {
  console.log(
    "Usage ts-node scripts/add-new-leasing-agent.ts targetUserEmail targetFirstName targetLastName"
  )
  process.exit(-1)
}

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
})
serviceOptions.axios = axiosInstance

const userService = new client.UserService()
const authService = new client.AuthService()
const listingService = new client.ListingsService()

async function main() {
  const loginResponse = await authService.login({
    body: {
      email: adminUsername,
      password: adminPassword,
    },
  })

  const newPassword = generatePassword()
  const authHeaders = { Authorization: `Bearer ${loginResponse.accessToken}` }

  const user = await userService.create(
    {
      noWelcomeEmail: true,
      body: {
        password: newPassword,
        passwordConfirmation: newPassword,
        emailConfirmation: targetUserEmail,
        email: targetUserEmail,
        firstName: targetFirstName,
        lastName: targetLastName,
        language: Language.en,
        appUrl: "https://housing.acgov.org/",
        middleName: "",
        dob: new Date(),
      },
    },
    { headers: authHeaders }
  )
  console.log("User created")
  console.log(user)

  await userService.update(
    {
      body: {
        ...user,
        confirmedAt: new Date(),
      },
    },
    { headers: authHeaders }
  )
  console.log("User confirmed")

  await authService.login({
    body: {
      email: targetUserEmail,
      password: newPassword,
    },
  })
  console.log("User can log in.")

  for (const listingId of listingIds) {
    const listing = await listingService.retrieve(
      { listingId: listingId },
      { headers: authHeaders }
    )
    await listingService.update(
      {
        listingId,
        body: {
          ...listing,
          leasingAgents: listing.leasingAgents
            .map((agent) => {
              return { id: agent.id }
            })
            .concat([{ id: user.id }]),
        },
      },
      { headers: authHeaders }
    )
    console.log(`User added to listing: ${listing.name}`)
  }
  console.log(`User email: ${targetUserEmail}`)
  console.log(`User password: ${newPassword}`)
}

void main()
