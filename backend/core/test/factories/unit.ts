import { Factory } from "fishery"
import { nanoid } from "nanoid"
import { Unit } from "../../src/entity/Unit"

export default Factory.define<Unit>(({ sequence, factories }) => ({
  id: nanoid(),
  amiPercentage: "80.0", // should be numeric?
  annualIncomeMin: "58152.0", // should be numeric?
  monthlyIncomeMin: 4858.0,
  floor: 2,
  annualIncomeMax: "103350.0", // should be numeric?
  maxOccupancy: 2,
  minOccupancy: 1,
  monthlyRent: 2429.0,
  numBathrooms: 1,
  numBedrooms: null, // nullable?
  number: "265",
  priorityType: null, // nullable?
  reservedType: null, // nullable?
  sqFeet: 750,
  status: "available", // should be enum?
  unitType: "oneBdrm", // should be enum?
  createdAt: new Date(),
  updatedAt: new Date(),
  amiChartId: 1,
  monthlyRentAsPercentOfIncome: null, // nullable?
  listing: null,
}))
