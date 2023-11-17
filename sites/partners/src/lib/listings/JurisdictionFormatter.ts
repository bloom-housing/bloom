import Formatter from "./Formatter"

export default class JurisdictionFormatter extends Formatter {
  /** Pull in the user's jurisdiction if a specific override jurisdiction isn't provided */
  process() {
    this.data.jurisdictions =
      !this.data.jurisdictions?.name && this.metadata.profile.jurisdictions.length === 1
        ? this.metadata.profile.jurisdictions[0]
        : this.data.jurisdictions
  }
}
