/* eslint-disable import/no-unresolved */
import { group, sleep, check } from "k6"
import http from "k6/http"
import sql from "k6/x/sql"
import driver from "k6/x/sql/driver/postgres"

/**
 * Run this with the following command `k6 run headless.js --env DB_URL="<db url here>"`
 *  adding vus increases the number of workers
 *  adding iterations increases the max number of runs the default funciton will perform
 *  in AWS environments we'll need to run this is the EC2 instance so that we can hit the db since its protected behind the VPC
 */

export const options = {
  vus: 5,
  iterations: 10,
}

const randomString = (stringLength = 5) =>
  (Math.random() + 1).toString(36).substring(2, stringLength + 2)

let db

export function setup() {
  // eslint-disable-next-line no-undef
  db = sql.open(driver, __ENV.DB_URL)
}

export function teardown() {
  db.close()
}

export default function () {
  let params
  let resp
  let url

  group("Default group", function () {
    const email = `${randomString()}+${randomString()}@exygy.com`
    const password = `Abcdef123456!${randomString()}`

    // Hit base URL
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `document`,
        "sec-fetch-mode": `navigate`,
        "sec-fetch-site": `none`,
        "sec-fetch-user": `?1`,
        "upgrade-insecure-requests": `1`,
        accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
        priority: `u=0, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // create a user
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "content-type": `application/json`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        origin: `https://core-dev.bloomhousing.dev`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/create-account`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/user/public`
    resp = http.request(
      "POST",
      url,
      `{"firstName":"${randomString()}","middleName":"","lastName":"${randomString()}","email":"${email}","password":"${password}","passwordConfirmation":"${password}","dob":"1955-01-11T08:00:00.000Z","language":"en","appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )
    check(resp, { "status equals 201": (r) => r.status === 201 })

    const userToConfirm = sql.query(
      db,
      `SELECT id, confirmation_token FROM user_accounts WHERE email = '${email}';`
    )
    const confirmationToken = userToConfirm[0].confirmation_token

    // hit confirm user page
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `document`,
        "sec-fetch-mode": `navigate`,
        "sec-fetch-site": `none`,
        "sec-fetch-user": `?1`,
        "upgrade-insecure-requests": `1`,
        accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
        priority: `u=0, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/?token=${confirmationToken}`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // confirm user
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "content-type": `application/json`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        origin: `https://core-dev.bloomhousing.dev`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/?token=${confirmationToken}`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/auth/confirm`
    resp = http.request("PUT", url, `{"token":"${confirmationToken}"}`, params)
    check(resp, { "status equals 201": (r) => r.status === 201 })

    // sign in
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "content-type": `application/json`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        origin: `https://core-dev.bloomhousing.dev`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/sign-in`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/auth/login`
    resp = http.request("POST", url, `{"email":"${email}","password":"${password}"}`, params)
    check(resp, { "status equals 201": (r) => r.status === 201 })

    const vuJar = http.cookieJar()
    const cookiesForURL = vuJar.cookiesForURL("https://core-dev.bloomhousing.dev")
    check(null, {
      "has cookie 'access-token'": () => cookiesForURL["access-token"].length > 0,
      "has cookie 'refresh-token'": () => cookiesForURL["refresh-token"].length > 0,
      "has cookie 'access-token-available'": () =>
        cookiesForURL["access-token-available"].length > 0,
    })

    // get user profile
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/sign-in`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/user`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // Get Jurisdiction
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=496cd10a-4f3d-4add-9a79-c10ab7cd72b2`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/38f7eb8c-e29c-447e-9b01-eb1c78f5457c`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // Look at a listing
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "if-none-match": `"89n9pbkw5fd51"`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=496cd10a-4f3d-4add-9a79-c10ab7cd72b2`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/listings/496cd10a-4f3d-4add-9a79-c10ab7cd72b2`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // jurisdiction fetch
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=496cd10a-4f3d-4add-9a79-c10ab7cd72b2`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/38f7eb8c-e29c-447e-9b01-eb1c78f5457c`
    resp = http.request("GET", url, null, params)
    check(resp, { "status equals 200": (r) => r.status === 200 })

    // verify application submission
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "content-type": `application/json`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        origin: `https://core-dev.bloomhousing.dev`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/applications/review/summary`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/applications/verify`
    resp = http.request(
      "POST",
      url,
      `{"loaded":false,"autofilled":false,"completedSections":3,"submissionType":"electronical","language":"en","acceptedTerms":false,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"home","noPhone":false,"applicantAddress":{"street":"Eastborne Avenue","street2":"1/2","city":"Los Angeles","state":"AZ","zipCode":"90024","county":"","longitude":-118.426842,"latitude":34.056933},"workInRegion":"no","phoneNumber":"(520) 123-4567","firstName":"First Name","middleName":"Middle Name","lastName":"Last Name","birthMonth":"1","birthDay":"1","birthYear":"2000","emailAddress":"${email}","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["letter"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":{"type":"noContact","firstName":"","lastName":"","agency":"","phoneNumber":"","emailAddress":null,"address":{"street":"","street2":"","city":"","state":"","zipCode":""}},"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"incomeVouchers":true,"income":"5000.00","incomePeriod":"perMonth","householdMember":[],"preferredUnitTypes":[{"id":"cb6dad5c-88af-4afe-af72-4eb4a0318ef7"}],"demographics":{"ethnicity":"notHispanicLatino","gender":"","sexualOrientation":"","howDidYouHear":["friend"],"race":["asian","asian-asianIndian"],"spokenLanguage":""},"preferences":[],"programs":[],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listing":{"id":"496cd10a-4f3d-4add-9a79-c10ab7cd72b2"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )
    check(resp, { "status equals 201": (r) => r.status === 201 })

    // submit application
    params = {
      headers: {
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "content-type": `application/json`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-fetch-dest": `empty`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-site": `same-origin`,
        accept: `application/json, text/plain, */*`,
        appurl: `https://core-dev.bloomhousing.dev`,
        jurisdictionname: `Bloomington`,
        language: `en`,
        origin: `https://core-dev.bloomhousing.dev`,
        priority: `u=1, i`,
        referer: `https://core-dev.bloomhousing.dev/applications/review/terms`,
      },
      cookies: {
        ["access-token"]: cookiesForURL["access-token"],
        ["refresh-token"]: cookiesForURL["refresh-token"],
        ["access-token-available"]: cookiesForURL["access-token-available"],
      },
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/applications/submit`
    resp = http.request(
      "POST",
      url,
      `{"loaded":false,"autofilled":false,"completedSections":6,"submissionType":"electronical","language":"en","acceptedTerms":true,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"home","noPhone":false,"applicantAddress":{"street":"Eastborne Avenue","street2":"1/2","city":"Los Angeles","state":"AZ","zipCode":"90024","county":"","longitude":-118.426842,"latitude":34.056933},"workInRegion":"no","phoneNumber":"(520) 123-4567","firstName":"${randomString()}}","middleName":"${randomString()}}","lastName":"${randomString()}}","birthMonth":"1","birthDay":"1","birthYear":"2000","emailAddress":"${email}","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["letter"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":{"type":"noContact","firstName":"","lastName":"","agency":"","phoneNumber":"","emailAddress":null,"address":{"street":"","street2":"","city":"","state":"","zipCode":""}},"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"incomeVouchers":true,"income":"5000.00","incomePeriod":"perMonth","householdMember":[],"preferredUnitTypes":[{"id":"cb6dad5c-88af-4afe-af72-4eb4a0318ef7"}],"demographics":{"ethnicity":"notHispanicLatino","gender":"","sexualOrientation":"","howDidYouHear":["friend"],"race":["asian","asian-asianIndian"],"spokenLanguage":""},"preferences":[],"programs":[],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listings":{"id":"496cd10a-4f3d-4add-9a79-c10ab7cd72b2"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )
    check(resp, { "status equals 201": (r) => r.status === 201 })
  })
  sleep(1)
}
