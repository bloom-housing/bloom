import Formatter from "./Formatter"
import { removeEmptyObjects } from "../helpers"
import { FormListing, FormMetadata } from "./formTypes"

/**
 * Format data from the Listing Form for API submission.
 * You can configure pipeline steps by updating the `loadFormatters` method.
 */
export default class ListingDataPipeline {
  data: FormListing
  metadata: FormMetadata

  alreadyFormatted = false

  /**
   * Sets up a new formatting pipeline.
   * @param data supplied by the form component
   * @param metadata additional values formatters can use to override form data
   * @see importData
   */
  constructor(data: FormListing, metadata: FormMetadata) {
    this.importData(data, metadata)
  }

  /**
   * Import and return a list of Formatter subclasses.
   * @see Formatter
   */
  async loadFormatters() {
    const formatterClasses = await Promise.all([
      import("./DatesFormatter"),
      import("./BooleansFormatter"),
      import("./WaitlistFormatter"),
      import("./UnitsFormatter"),
      import("./UnitGroupsFormatter"),
      import("./EventsFormatter"),
      import("./JurisdictionFormatter"),
      import("./AdditionalMetadataFormatter"),
    ])

    return formatterClasses.map((formatterClass) => formatterClass.default)
  }

  /**
   * Resets the pipeline with new data.
   * @param data supplied by the form component
   * @param metadata additional values formatters can use to override form data
   */
  importData(data: FormListing, metadata: FormMetadata) {
    this.alreadyFormatted = false
    this.data = { ...data } // make a copy before transformation
    this.metadata = metadata
  }

  /**
   * Transform the data via the formatters pipeline and return the output.
   */
  async run() {
    if (this.alreadyFormatted)
      throw new Error("Cannot run pipeline a second time on the same dataset")

    const formatters = await this.loadFormatters()

    formatters.forEach((formatterClass: typeof Formatter) => {
      new formatterClass(this.data, this.metadata).format()
    })

    removeEmptyObjects(this.data)

    this.alreadyFormatted = true

    return this.data
  }
}
