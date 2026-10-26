/* eslint-disable import/no-unresolved */
import { group, sleep, check } from "k6"
import http from "k6/http"

export const options = {
  vus: 500,
  iterations: 10000,
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
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=5fdfd253-d270-48e4-92ee-793ec5beda78`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/2bc7a6c3-13b2-4a7e-9a98-2f47d9686ba5`
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
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=5fdfd253-d270-48e4-92ee-793ec5beda78`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        "if-none-match": `"89n9pbkw5fd51"`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/listings/5fdfd253-d270-48e4-92ee-793ec5beda78`
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
        referer: `https://core-dev.bloomhousing.dev/applications/start/choose-language?listingId=5fdfd253-d270-48e4-92ee-793ec5beda78`,
        "accept-encoding": `gzip, deflate, br, zstd`,
        "accept-language": `en-US,en;q=0.9`,
        priority: `u=1, i`,
      },
      cookies: {},
    }
    url = http.url`https://core-dev.bloomhousing.dev/api/adapter/jurisdictions/2bc7a6c3-13b2-4a7e-9a98-2f47d9686ba5`
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
      `{"loaded":false,"autofilled":false,"completedSections":6,"submissionType":"electronical","language":"en","acceptedTerms":true,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"","noPhone":true,"applicantAddress":{"street":"2024 1st Street","city":"Napa","state":"CA","zipCode":"94559","county":"","longitude":-122.29551,"latitude":38.297914},"workInRegion":"no","phoneNumber":"","firstName":"Eric","middleName":"","lastName":"McGarry","birthMonth":"02","birthDay":"12","birthYear":"1998","emailAddress":"eric.mcgarry@exygy.com","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["email"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":null,"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"reasonableAccommodations":"","incomeVouchers":false,"income":"1234.00","incomePeriod":"perYear","householdMember":[],"preferredUnitTypes":[{"id":"ee78d841-c49a-487d-b316-834037673338"}],"demographics":{"ethnicity":"","gender":"","sexualOrientation":"","howDidYouHear":[],"race":[],"spokenLanguage":""},"preferences":[{"multiselectQuestionId":"fe910943-d01f-4900-bd3e-b62782d61740","key":"City Employees","claimed":true,"options":[{"key":"At least one member of my household is a city employee","checked":true,"extraData":[]}]}],"programs":[{"multiselectQuestionId":"6cef9823-d856-404e-83e1-d77c0f0caf3b","key":"Veteran","claimed":true,"options":[{"key":"Yes","checked":true,"extraData":[]}]}],"applicationSelections":[],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listings":{"id":"5fdfd253-d270-48e4-92ee-793ec5beda78"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
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
      `{"loaded":false,"autofilled":false,"completedSections":6,"submissionType":"electronical","language":"en","acceptedTerms":true,"status":"submitted","accessibleUnitWaitlistNumber":null,"conventionalUnitWaitlistNumber":null,"manualLotteryPositionNumber":null,"applicant":{"phoneNumberType":"","noPhone":true,"applicantAddress":{"street":"2024 1st Street","city":"Napa","state":"CA","zipCode":"94559","county":"","longitude":-122.29551,"latitude":38.297914},"workInRegion":"no","phoneNumber":"","firstName":"Eric","middleName":"","lastName":"McGarry","birthMonth":"02","birthDay":"12","birthYear":"1998","emailAddress":"eric.mcgarry@exygy.com","noEmail":false,"fullTimeStudent":null,"applicantWorkAddress":{"street":"","street2":"","city":"","state":"","zipCode":"","county":""}},"additionalPhone":false,"additionalPhoneNumber":"","additionalPhoneNumberType":"","contactPreferences":["email"],"householdSize":1,"housingStatus":"","sendMailToMailingAddress":false,"applicationsMailingAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"applicationsAlternateAddress":{"street":"","street2":"","city":"","state":"","zipCode":""},"alternateContact":null,"accessibility":{"mobility":false,"vision":false,"hearing":false,"other":null},"householdExpectingChanges":false,"householdStudent":false,"reasonableAccommodations":"","incomeVouchers":false,"income":"1234.00","incomePeriod":"perYear","householdMember":[],"preferredUnitTypes":[{"id":"ee78d841-c49a-487d-b316-834037673338"}],"demographics":{"ethnicity":"","gender":"","sexualOrientation":"","howDidYouHear":[],"race":[],"spokenLanguage":""},"preferences":[{"multiselectQuestionId":"fe910943-d01f-4900-bd3e-b62782d61740","key":"City Employees","claimed":true,"options":[{"key":"At least one member of my household is a city employee","checked":true,"extraData":[]}]}],"programs":[{"multiselectQuestionId":"6cef9823-d856-404e-83e1-d77c0f0caf3b","key":"Veteran","claimed":true,"options":[{"key":"Yes","checked":true,"extraData":[]}]}],"applicationSelections":[],"confirmationCode":"","id":"","reachedReviewStep":true,"reviewStatus":"pending","listings":{"id":"5fdfd253-d270-48e4-92ee-793ec5beda78"},"appUrl":"https://core-dev.bloomhousing.dev"}`,
      params
    )
    check(resp, { "submission ": (r) => r.status === 201 })
  })
}
