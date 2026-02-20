import {
  getRaceEthnicityOptions,
  convertConfigToRaceKeysFormat,
} from "../src/utilities/raceEthnicityOptions"
import { RaceEthnicityConfiguration } from "../src/types/backend-swagger"

describe("raceEthnicityOptions utilities", () => {
  it("should return null when no configuration is provided", () => {
    const result = getRaceEthnicityOptions(undefined)
    expect(result).toBeNull()
  })

  it("should convert configuration to race keys format when provided", () => {
    const config: RaceEthnicityConfiguration = {
      options: [
        {
          id: "asian",
          hasSubOptions: true,
          subOptions: [
            { id: "chinese", allowOtherText: false },
            { id: "japanese", allowOtherText: false },
          ],
        },
        {
          id: "white",
          hasSubOptions: false,
          subOptions: [],
        },
      ],
    }

    const result = getRaceEthnicityOptions(config)

    expect(result).toEqual({
      asian: ["asian-chinese", "asian-japanese"],
      white: [],
    })
  })
})

it("should handle multiple root options with mixed suboptions", () => {
  const config: RaceEthnicityConfiguration = {
    options: [
      {
        id: "americanIndianAlaskanNative",
        hasSubOptions: false,
        subOptions: [],
      },
      {
        id: "asian",
        hasSubOptions: true,
        subOptions: [
          { id: "chinese", allowOtherText: false },
          { id: "vietnamese", allowOtherText: false },
        ],
      },
      {
        id: "nativeHawaiianOtherPacificIslander",
        hasSubOptions: true,
        subOptions: [
          { id: "nativeHawaiian", allowOtherText: false },
          { id: "samoan", allowOtherText: false },
        ],
      },
      {
        id: "white",
        hasSubOptions: false,
        subOptions: [],
      },
    ],
  }

  const result = convertConfigToRaceKeysFormat(config)

  expect(result).toEqual({
    americanIndianAlaskanNative: [],
    asian: ["asian-chinese", "asian-vietnamese"],
    nativeHawaiianOtherPacificIslander: [
      "nativeHawaiianOtherPacificIslander-nativeHawaiian",
      "nativeHawaiianOtherPacificIslander-samoan",
    ],
    white: [],
  })
})
