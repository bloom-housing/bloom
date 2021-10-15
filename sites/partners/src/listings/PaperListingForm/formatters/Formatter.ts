import { FormListing, FormMetadata } from "../formTypes"

/** Base class for Listing Form formatters */
export default class Formatter {
  data: FormListing
  metadata: FormMetadata

  alreadyFormatted = false

  constructor(data: FormListing, metadata: FormMetadata) {
    this.data = data
    this.metadata = metadata
  }

  /** Format the data object */
  format(): void {
    if (this.alreadyFormatted)
      throw new Error(
        "Cannot run formatter a second time on the same dataset. Call `importData' first."
      )

    this.process()
    this.alreadyFormatted = true
  }

  /** Override in subclass */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected process(): void {}
}
