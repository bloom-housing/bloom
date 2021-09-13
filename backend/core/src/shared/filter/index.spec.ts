import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"
import { addFilters } from "."
import { HttpException } from "@nestjs/common"

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  whereInIds: jest.fn().mockReturnThis(),
  andWhereInIds: jest.fn().mockReturnThis(),
  orWhereInIds: jest.fn().mockReturnThis(),
}

describe("FilterAdder", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("addFilter", () => {
    it("should not call where when no filters are passed", () => {
      const filter = {}

      addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)

      expect(mockQueryBuilder.where).not.toHaveBeenCalled()
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled()
      expect(mockQueryBuilder.orWhere).not.toHaveBeenCalled()
    })

    it("should add where clause when name is passed", () => {
      const filter = {
        $comparison: "=",
        name: "Coliseum",
      }

      addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining("="), {
        name_0: expect.stringContaining("Coliseum"),
      })
    })

    it("should throw an exception when filter is not supported", () => {
      const filter = {
        $comparison: "=",
        abc: "Test",
      }

      // This extra function wrapper is needed to catch the exception.
      expect(() => {
        addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)
      }).toThrow(HttpException)
      expect(() => {
        addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)
      }).toThrow("Filter Not Implemented")
    })

    it("should throw an exception when comparison is not supported", () => {
      const filter = {
        $comparison: "abc",
        name: "Test",
      }

      // This extra function wrapper is needed to catch the exception.
      expect(() => {
        addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)
      }).toThrow(HttpException)
      expect(() => {
        addFilters([filter], filterTypeToFieldMap, mockQueryBuilder)
      }).toThrow("Comparison Not Implemented")
    })
  })
})
