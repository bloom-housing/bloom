import { addFilter } from "."

describe("addFilter", () => {
  let mockRepo, andWhere

  beforeEach(() => {
    andWhere = jest.fn().mockReturnThis()
    mockRepo = jest.fn(() => ({
      createQueryBuilder: jest.fn(() => ({
        andWhere,
      })),
    }))()
  })

  it("Should add = filter", () => {
    const qb = mockRepo.createQueryBuilder()
    addFilter(
      [
        {
          operator: "=",
          foo: "bar",
        },
      ],
      "listings",
      qb
    )

    expect(andWhere).toHaveBeenCalledWith("listings.foo = :foo", { foo: "bar" })
  })

  it("Should add <> filter", () => {
    const qb = mockRepo.createQueryBuilder()
    addFilter(
      [
        {
          operator: "<>",
          foo: "bar",
        },
      ],
      "listings",
      qb
    )

    expect(andWhere).toHaveBeenCalledWith("listings.foo <> :foo", { foo: "bar" })
  })

  it("Should add = and <> filters", () => {
    const qb = mockRepo.createQueryBuilder()
    addFilter(
      [
        {
          operator: "=",
          foo: "bar",
        },
        {
          operator: "<>",
          bar: "foo",
        },
      ],
      "listings",
      qb
    )

    expect(andWhere).toHaveBeenCalledWith("listings.foo = :foo", { foo: "bar" })
    expect(andWhere).toHaveBeenCalledWith("listings.bar <> :bar", { bar: "foo" })
  })
})
