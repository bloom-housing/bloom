/* eslint-disable import/no-unresolved */
import { browser } from "k6/browser"
import { sleep } from "k6"

export const options = {
  scenarios: {
    default: {
      executor: "ramping-vus",
      startVUs: 0,
      gracefulRampDown: "0s",
      options: {
        browser: { type: "chromium" },
      },
      stages: [
        { duration: "30s", target: 1 },
        { duration: "30s", target: 1 },
        { duration: "30s", target: 2 },
        { duration: "30s", target: 2 },
        { duration: "30s", target: 3 },
        { duration: "30s", target: 3 },
      ],
      // vus: 10,
      // iterations: 100,
    },
  },
}

const randomNumber = (min = 1, max = 5) => Math.floor(Math.random() * (max - min) + min)
const randomString = (stringLength = 5) =>
  (Math.random() + 1).toString(36).substring(2, stringLength + 2)

const clickNext = async (page, waitFor = false) => {
  await page.getByRole("button", { name: "Next", exact: true }).click()
  //TODO: get rid of sleep
  await sleep(randomNumber())
  const text = await page.getByRole("button", { name: waitFor ? waitFor : "Next", exact: true })
  await text.waitFor({
    state: "visible",
  })
}

export default async function () {
  const page = await browser.newPage()

  try {
    await page.goto("https://core-dev.bloomhousing.dev/")

    await page.getByRole("link", { name: "Listings", exact: true }).click()

    await page.getByRole("link", { name: "Blue Sky Apartments", exact: true }).click()

    await page.getByRole("link", { name: "Apply online", exact: true }).click()

    await page.locator("section").click()

    await page.locator("div:nth-of-type(2) > button:nth-of-type(1)").click()

    await clickNext(page)

    await page
      .getByRole("textbox", { name: "First or given name", exact: true })
      .fill(randomString())

    await page
      .getByRole("textbox", { name: "Middle name (optional)", exact: true })
      .fill(randomString())

    await page
      .getByRole("textbox", { name: "Last or family name", exact: true })
      .fill(randomString())

    await page.getByRole("textbox", { name: "Month", exact: true }).fill(`${randomNumber(1, 12)}`)

    await page.getByRole("textbox", { name: "Day", exact: true }).fill(`${randomNumber(1, 27)}`)

    await page
      .getByRole("textbox", { name: "Year", exact: true })
      .fill(`${randomNumber(1980, 2005)}`)

    await page
      .getByRole("textbox", { name: "Your email address", exact: true })
      .fill(`example+${randomString(10)}@exygy.com`)

    await clickNext(page)

    await page.getByRole("textbox", { name: "Number", exact: true }).fill("(520) 123-4567")

    await page.locator("section").click()

    await page
      .getByRole("combobox", {
        name: "What type of number is this?",
        exact: true,
      })
      .selectOption("home")

    await page
      .getByRole("textbox", { name: "Street address", exact: true })
      .fill("2325 eastborne st")

    await page.getByRole("textbox", { name: "Apt or unit #", exact: true }).fill("1/2")

    await page.getByRole("textbox", { name: "City name", exact: true }).fill("los angeles")

    await page.getByRole("combobox", { name: "State", exact: true }).selectOption("AL")

    await page.getByRole("combobox", { name: "State", exact: true }).selectOption("AZ")

    await page.getByRole("textbox", { name: "Zip code", exact: true }).fill("90025")

    await clickNext(page)

    await page.getByRole("checkbox", { name: "Letter", exact: true }).click()

    await page.getByRole("radio", { name: "No", exact: true }).check()

    await clickNext(page)

    await clickNext(page)

    const text = await page.getByRole("radio", { name: "have an alternate contact", exact: false })
    await text.waitFor({
      state: "visible",
    })

    await page.getByRole("radio", { name: "have an alternate contact", exact: false }).click()

    await clickNext(page)

    await page.getByRole("radio", { name: "I will live alone", exact: true }).click()

    await clickNext(page)

    await page.locator(".font-semibold").click()

    await clickNext(page)

    await page.locator("div:nth-of-type(4) .font-semibold").click()

    await clickNext(page)

    await page.locator("div:nth-of-type(2) > div .font-semibold").click()

    await page.locator(".seeds-card > div:nth-of-type(3)").click()

    await clickNext(page)

    await page.locator("div:nth-of-type(2) > div .font-semibold").click()

    await clickNext(page)

    await page.locator("div:nth-of-type(1) > div > div > .font-semibold").click()

    await page.locator(".seeds-card > div:nth-of-type(3)").click()

    await clickNext(page)

    await page
      .getByRole("textbox", {
        name: "What is your household total pre-tax income?",
        exact: true,
      })
      .fill("5000")

    await page.locator("div:nth-of-type(1) > div > div > .font-semibold").click()

    await page.locator(".seeds-card > div:nth-of-type(3)").click()

    await clickNext(page)

    await page.locator('[data-divider="inset"] div:nth-of-type(2) .font-semibold').click()

    await page
      .locator("div:nth-of-type(2) > div > div:nth-of-type(1) > div > .font-semibold")
      .click()

    await page
      .getByRole("combobox", {
        name: "Which best describes your ethnicity?",
        exact: true,
      })
      .selectOption("notHispanicLatino")

    await page.locator(".border-none div:nth-of-type(5) .font-semibold").click()

    await clickNext(page, "Confirm")

    await page.getByRole("button", { name: "Confirm", exact: true }).click()

    await page.locator(".font-semibold").click()

    await page.getByRole("button", { name: "Submit", exact: true }).click()

    await page
      .getByRole("link", {
        name: "View submitted application and print a copy.",
        exact: true,
      })
      .click()

    await sleep(1)
  } finally {
    await page?.close()
  }
}
