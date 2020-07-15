import { Factory } from "fishery"
import { nanoid } from "nanoid"
import { Unit } from "../../src/entity/unit.entity"

export default Factory.define<Unit>(({ sequence, factories }) => ({
  id: nanoid(),
  amiPercentage: "80.0",
  annualIncomeMin: "58152.0",
  monthlyIncomeMin: 4858.0,
  floor: 2,
  annualIncomeMax: "103350.0",
  maxOccupancy: 2,
  minOccupancy: 1,
  monthlyRent: 2429.0,
  numBathrooms: 1,
  numBedrooms: null,
  number: "265",
  priorityType: null,
  reservedType: null,
  sqFeet: 750,
  status: "available",
  unitType: "oneBdrm",
  createdAt: new Date(),
  updatedAt: new Date(),
  amiChartId: 1,
  monthlyRentAsPercentOfIncome: null,
  listing: null,
}))
