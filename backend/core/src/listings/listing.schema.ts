import * as yup from "yup"

const previewSchema = yup.object().shape({
  name: yup.string().required(),
})

const applicationMethodSchema = yup.object().shape({})
const addressSchema = yup.object().shape({})
const propertySchema = yup
  .object()
  .shape({ buildingAddress: addressSchema, developer: yup.string().required() })
const unitSchema = yup.object().shape({})

const publishSchema = yup.object().shape({
  name: yup.string().required(),
  applicationMethods: yup.array().of(applicationMethodSchema),
  property: propertySchema,
  units: yup.array().of(unitSchema).min(1),
  depositMin: yup.string().required(),
  depositMax: yup.string().required(),
  rentalAssistance: yup.string().required(),
  isWaitlistOpen: yup.boolean().required(),
  leasingAgentEmail: yup.string().email().required(),
  leasingAgentName: yup.string().required(),
  leasingAgentPhone: yup.string().required(),
})

export { previewSchema, publishSchema }
