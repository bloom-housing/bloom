import { ListingDefaultSeed } from "./listing-default-seed"
import { ListingReviewOrder } from "../../../listings/types/listing-review-order-enum"

export class ListingDefaultFCFSSeed extends ListingDefaultSeed {
  async seed() {
    const listing = await super.seed()
    return await this.listingRepository.save({
      ...listing,
      name: "Test: Default, FCFS",
      reviewOrderType: "firstComeFirstServe" as ListingReviewOrder,
      applicationDueDate: null,
      events: [],
      images: [
        {
          image: {
            label: "building",
            fileId:
              "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
          },
        },
        {
          image: {
            label: "building",
            fileId:
              "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/house_goo3cp.jpg",
          },
        },
      ],
    })
  }
}
