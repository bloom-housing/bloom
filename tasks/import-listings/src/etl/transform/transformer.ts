import { Listing } from "../../types"
import { MapValue, RecordMap, ResolveFunction, RecordValue } from "./map"
import { TransformerInterface } from "./transformer-interface"
import { BaseStage } from "../base-stage"

export class Transformer extends BaseStage implements TransformerInterface {
  map: RecordMap

  constructor(map: RecordMap) {
    super()
    this.map = map
  }

  private getMappedValue(value: MapValue, listing: Listing): RecordValue {
    const type = typeof value

    // eslint complained when I used a switch here
    // if the map value is a string, treat it as the property to get from the listing
    // ie value = "id", return listing["id"]
    if (type == "string") {
      return listing[value as string]
    }

    // if it's a ResolveFunction, call the function, passing in the listing and
    // using the return value
    // this provides a way to generate values that do not map to a single property
    // ie return value(listing)
    if (type == "function") {
      return (value as ResolveFunction)(listing)
    }
  }

  public mapAll(listings: Array<Listing>): Array<Record<string, unknown>> {
    const rows = listings.map((listing) => {
      return this.mapListingToRow(listing)
    })

    this.log(`Transform Results: ${rows.length} listings converted into table rows`)

    return rows
  }

  public mapListingToRow(listing: Listing): Record<string, unknown> {
    const row = {}

    for (const [key, value] of Object.entries(this.map)) {
      row[key] = this.getMappedValue(value, listing)
    }

    return row
  }
}
