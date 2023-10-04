import { t } from "@bloom-housing/ui-components"

// translationKey must be in the format `key*argumentName:argumentValue*argumentName:argumentValue`
// any number of arguments can be passed, returns a fully translated string
export const getTranslationWithArguments = (translationKey: string) => {
  if (translationKey.indexOf("*") >= 0) {
    const [key, ...stringArguments] = translationKey.split("*")
    const argumentsObject = stringArguments.reduce((obj, arg) => {
      const [key, value] = arg.split(":")
      return { ...obj, [key]: value }
    }, {})
    return t(key, argumentsObject)
  } else return t(translationKey)
}
