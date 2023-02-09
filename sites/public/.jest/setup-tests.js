import { addTranslation } from "@bloom-housing/ui-components"
import general from "../../../detroit-ui-components/src/locales/general.json"
import general_overrides from "../page_content/locale_overrides/general.json"
import "@testing-library/jest-dom/extend-expect"

addTranslation(general)
addTranslation(general_overrides)
