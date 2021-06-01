import { register } from "fishery"
import listing from "./listing"
import unit from "./unit"

export const factories = register({
  listing,
  unit,
})
