import { ListingEventType } from "../../../../types/src/backend-swagger"
import { ListingDefaultSeed } from "./listing-default-seed"
import { getDate } from "./shared"

export class ListingDefaultLottery extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, Lottery Results",
      applicationOpenDate: getDate(30),
      applicationDueDate: getDate(60),
      events: JSON.parse(
        JSON.stringify([
          {
            startTime: getDate(10),
            endTime: getDate(10),
            note:
              "Custom public lottery event note. This is a long note and should take up more space.",
            type: ListingEventType.openHouse,
            url: "https://www.example.com",
            label: "Custom Event URL Label",
          },
          {
            startTime: getDate(15),
            endTime: getDate(15),
            type: ListingEventType.openHouse,
          },
          {
            startTime: getDate(20),
            endTime: getDate(20),
            note: "Custom open house event note",
            type: ListingEventType.openHouse,
            url: "https://www.example.com",
            label: "Custom Event URL Label",
          },
          {
            startTime: getDate(10),
            endTime: getDate(10),
            type: ListingEventType.publicLottery,
            url: "https://www.example2.com",
            label: "Custom Event URL Label",
          },
          {
            startTime: getDate(10),
            endTime: getDate(10),
            type: ListingEventType.lotteryResults,
            note:
              "Custom public lottery event note. This is a long note and should take up more space.",
            url: "https://www.example2.com",
            label: "Custom Event URL Label",
          },
        ])
      ),
    })
  }
}
