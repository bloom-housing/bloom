import HomePage from "../index"
import { addTranslation } from "@dahlia/ui-components/src/helpers/translator"
import spanish from "../../static/locales/es.json"

export default props => {
  addTranslation(spanish)

  return <HomePage />
}
