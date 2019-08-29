import Listings from "../listings"
import { addTranslation } from "@dahlia/ui-components/src/helpers/translator"
import spanish from "../../static/locales/es.json"

export default class extends Listings {
  public render() {
    addTranslation(spanish)

    return <Listings listings={this.props.listings} />
  }
}
