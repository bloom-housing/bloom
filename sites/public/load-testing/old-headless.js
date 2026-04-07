/* eslint-disable import/no-unresolved */
import { group, sleep, check } from "k6"
import http from "k6/http"

export const options = {
  vus: 100,
  iterations: 1000,
}

const randomString = (stringLength = 5) =>
  (Math.random() + 1).toString(36).substring(2, stringLength + 2)

export default function () {
  let params
  let resp
  let url

  group("Default group", function () {
    // home page get
    params = {
      headers: {
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        "sec-ch-ua-platform": `"macOS"`,
        "upgrade-insecure-requests": `1`,
        accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
        "sec-fetch-site": `none`,
        "sec-fetch-mode": `navigate`,
        "sec-fetch-user": `?1`,
        "sec-fetch-dest": `document`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=0, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/`
    resp = http.request("GET", url, null, params)
    check(resp, { "home page get": (r) => r.status === 200 })

    // jurisdictions get
    params = {
      headers: {
        language: `en`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        jurisdictionname: `Bloomington`,
        appurl: `https://core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "sec-fetch-site": `same-origin`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-dest": `empty`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=53468ecc-7736-4d3b-a489-10e62e3cb8b7`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/42561f98-4e0e-46f4-a653-cf8097cd38c0`
    resp = http.request("GET", url, null, params)
    check(resp, { "jurisdictions get 1": (r) => r.status === 200 })

    // listings get
    params = {
      headers: {
        language: `en`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        jurisdictionname: `Bloomington`,
        appurl: `https://core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "sec-fetch-site": `same-origin`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-dest": `empty`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=53468ecc-7736-4d3b-a489-10e62e3cb8b7`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "if-none-match": `"89n9pbkw5fd51"`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/listings/53468ecc-7736-4d3b-a489-10e62e3cb8b7`
    resp = http.request("GET", url, null, params)
    check(resp, { "listing get": (r) => r.status === 200 })

    // jurisdiction get
    params = {
      headers: {
        language: `en`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        jurisdictionname: `Bloomington`,
        appurl: `https://core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "sec-fetch-site": `same-origin`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-dest": `empty`,
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=53468ecc-7736-4d3b-a489-10e62e3cb8b7`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/42561f98-4e0e-46f4-a653-cf8097cd38c0`
    resp = http.request("GET", url, null, params)
    check(resp, { "jurisdiction get 2": (r) => r.status === 200 })

    // verify application
    params = {
      headers: {
        language: `en`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        jurisdictionname: `Bloomington`,
        appurl: `https://core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "content-type": `application/json`,
        origin: `https://core-dev.bloomhousing.dev`,
        "sec-fetch-site": `same-origin`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-dest": `empty`,
        referer: `https://core-dev.bloomhousing.dev/applications/review/summary`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/applications/verify`
    resp = http.request(
      "POST",
      url,
      `{"loaded":false,"autofilled":false,"completedSections":3,"submissionType":"electronical","language":"en","acceptedTerms":false,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"home","noPhone":false,"applicantAddress":{"street":"Eastborne Avenue","street2":"1/2","city":"Los Angeles","state":"AZ","zipCode":"90024","county":"","longitude":-118.426842,"latitude":34.056933},"workInRegion":"no","phoneNumber":"(520) 123-4567","firstName":"First Name","middleName":"Middle Name","lastName":"Last Name","birthMonth":"1","birthDay":"1","birthYear":"2000","emailAddress":"example@exygy.com","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["letter"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":{"type":"noContact","firstName":"","lastName":"","agency":"","phoneNumber":"","emailAddress":null,"address":{"street":"","street2":"","city":"","state":"","zipCode":""}},"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"incomeVouchers":true,"income":"5000.00","incomePeriod":"perMonth","householdMember":[],"preferredUnitTypes":[{"id":"cb6dad5c-88af-4afe-af72-4eb4a0318ef7"}],"demographics":{"ethnicity":"notHispanicLatino","gender":"","sexualOrientation":"","howDidYouHear":["friend"],"race":["asian","asian-asianIndian"],"spokenLanguage":""},"preferences":[{"multiselectQuestionId":"3497f10d-404d-48b6-8881-36b1188fe24d","key":"City Employees","claimed":true,"options":[{"key":"At least one member of my household is a city employee","checked":true,"extraData":[]}]}],"programs":[{"multiselectQuestionId":"45583597-37a0-4c5d-bfcf-9a82a28ba337","key":"Veteran","claimed":true,"options":[{"key":"Yes","checked":true,"extraData":[]}]}],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listing":{"id":"53468ecc-7736-4d3b-a489-10e62e3cb8b7"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )

    check(resp, { "verify ": (r) => r.status === 201 })

    // application submission
    params = {
      headers: {
        language: `en`,
        "sec-ch-ua-platform": `"macOS"`,
        "sec-ch-ua": `"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"`,
        "sec-ch-ua-mobile": `?0`,
        jurisdictionname: `Bloomington`,
        appurl: `https://core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "content-type": `application/json`,
        origin: `https://core-dev.bloomhousing.dev`,
        "sec-fetch-site": `same-origin`,
        "sec-fetch-mode": `cors`,
        "sec-fetch-dest": `empty`,
        referer: `https://core-dev.bloomhousing.dev/applications/review/terms`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/applications/submit`
    resp = http.request(
      "POST",
      url,
      `{"loaded":false,"autofilled":false,"completedSections":3,"submissionType":"electronical","language":"en","acceptedTerms":false,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"home","noPhone":false,"applicantAddress":{"street":"Eastborne Avenue","street2":"1/2","city":"Los Angeles","state":"AZ","zipCode":"90024","county":"","longitude":-118.426842,"latitude":34.056933},"workInRegion":"no","phoneNumber":"(520) 123-4567","firstName":"First Name","middleName":"Middle Name","lastName":"Last Name","birthMonth":"1","birthDay":"1","birthYear":"2000","emailAddress":"example@exygy.com","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["letter"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":{"type":"noContact","firstName":"","lastName":"","agency":"","phoneNumber":"","emailAddress":null,"address":{"street":"","street2":"","city":"","state":"","zipCode":""}},"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"incomeVouchers":true,"income":"5000.00","incomePeriod":"perMonth","householdMember":[],"preferredUnitTypes":[{"id":"cb6dad5c-88af-4afe-af72-4eb4a0318ef7"}],"demographics":{"ethnicity":"notHispanicLatino","gender":"","sexualOrientation":"","howDidYouHear":["friend"],"race":["asian","asian-asianIndian"],"spokenLanguage":""},"preferences":[{"multiselectQuestionId":"3497f10d-404d-48b6-8881-36b1188fe24d","key":"City Employees","claimed":true,"options":[{"key":"At least one member of my household is a city employee","checked":true,"extraData":[]}]}],"programs":[{"multiselectQuestionId":"45583597-37a0-4c5d-bfcf-9a82a28ba337","key":"Veteran","claimed":true,"options":[{"key":"Yes","checked":true,"extraData":[]}]}],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listing":{"id":"53468ecc-7736-4d3b-a489-10e62e3cb8b7"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )

    check(resp, { "submission ": (r) => r.status === 201 })
  })
  sleep(1)
}
