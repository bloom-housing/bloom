import {
  addListItem,
  clearValueAt,
  fieldState,
  listRows,
  normalizeRichText,
  parsePath,
  pathsThatHideContent,
  removeListItem,
  restoreListItem,
  setValueAt,
  tombstoneListItem,
  valueAt,
} from "../../src/lib/contentEditor"

const englishFaq = {
  faq: {
    categories: [
      {
        id: "applying",
        title: "Applying",
        items: [
          { id: "how", question: "How?", answerHtml: "<p>Apply online.</p>" },
          { id: "when", question: "When?", answerHtml: "<p>Any time.</p>" },
        ],
      },
    ],
  },
}

describe("parsePath", () => {
  it("reads fields and list ids", () => {
    expect(parsePath("faq.categories[applying].items[how].answerHtml")).toEqual([
      { field: "faq" },
      { field: "categories" },
      { id: "applying" },
      { field: "items" },
      { id: "how" },
      { field: "answerHtml" },
    ])
  })
})

describe("valueAt", () => {
  it("finds a nested list item by id", () => {
    expect(valueAt(englishFaq, "faq.categories[applying].items[when].question")).toEqual("When?")
  })

  it("returns undefined for an id that is not in the list", () => {
    expect(valueAt(englishFaq, "faq.categories[missing].title")).toBeUndefined()
  })
})

describe("setValueAt", () => {
  it("writes into an existing list item without touching its siblings", () => {
    const next = setValueAt(
      englishFaq,
      "faq.categories[applying].items[how].answerHtml",
      "<p>Edited.</p>"
    )

    expect(valueAt(next, "faq.categories[applying].items[how].answerHtml")).toEqual(
      "<p>Edited.</p>"
    )
    expect(valueAt(next, "faq.categories[applying].items[when].question")).toEqual("When?")
  })

  it("creates the item a translation is starting from", () => {
    const spanish = { faq: { categories: [{ id: "applying", items: [] }] } }

    const next = setValueAt(
      spanish,
      "faq.categories[applying].items[how].answerHtml",
      "<p>Solicite en linea.</p>"
    )

    expect(valueAt(next, "faq.categories[applying].items[how]")).toEqual({
      id: "how",
      answerHtml: "<p>Solicite en linea.</p>",
    })
  })

  it("leaves the document it was given untouched", () => {
    setValueAt(englishFaq, "faq.categories[applying].items[how].answerHtml", "<p>Edited.</p>")

    expect(valueAt(englishFaq, "faq.categories[applying].items[how].answerHtml")).toEqual(
      "<p>Apply online.</p>"
    )
  })
})

describe("clearValueAt", () => {
  it("removes a field so it falls back to English", () => {
    const spanish = setValueAt({}, "disclaimers.privacyHtml", "<p>Privacidad</p>")

    const next = clearValueAt(spanish, "disclaimers.privacyHtml")

    expect(fieldState(valueAt(next, "disclaimers.privacyHtml"))).toEqual("fallback")
  })
})

describe("fieldState", () => {
  it("separates a fallback from a value and from a deliberate empty", () => {
    expect(fieldState(undefined)).toEqual("fallback")
    expect(fieldState(null)).toEqual("fallback")
    expect(fieldState("")).toEqual("hidden")
    expect(fieldState("<p>Something</p>")).toEqual("overridden")
  })
})

describe("normalizeRichText", () => {
  it("treats an emptied editor as empty rather than as an empty paragraph", () => {
    expect(normalizeRichText("<p></p>")).toEqual("")
    expect(normalizeRichText("<p><br></p>")).toEqual("")
    expect(normalizeRichText("<p>&nbsp;</p>")).toEqual("")
  })

  it("leaves real content alone", () => {
    expect(normalizeRichText("<p>Something</p>")).toEqual("<p>Something</p>")
  })

  it("keeps the empty paragraph Enter opens in a document that has content", () => {
    expect(normalizeRichText("<p>one</p><p></p>")).toEqual("<p>one</p><p></p>")
  })

  it("reads as hidden once normalized, which is what fires the confirmation", () => {
    expect(fieldState(normalizeRichText("<p></p>"))).toEqual("hidden")
  })
})

describe("listRows", () => {
  const items = englishFaq.faq.categories[0].items

  it("pairs each English item with what the language row says about it", () => {
    const rows = listRows(items, [{ id: "how", answerHtml: "<p>Solicite.</p>" }])

    expect(rows.map((row) => row.id)).toEqual(["how", "when"])
    expect(rows[0].override?.answerHtml).toEqual("<p>Solicite.</p>")
    expect(rows[1].override).toBeUndefined()
  })

  it("marks a tombstoned item as deleted rather than dropping it", () => {
    const rows = listRows(items, [{ id: "when", _deleted: true }])

    expect(rows[1].deleted).toBe(true)
  })

  it("appends items the language row adds on its own", () => {
    const rows = listRows(items, [{ id: "extra", question: "Solo espanol" }])

    expect(rows.map((row) => row.id)).toEqual(["how", "when", "extra"])
    expect(rows[2].english).toBeUndefined()
  })

  it("tolerates a document with no list yet", () => {
    expect(listRows(undefined, undefined)).toEqual([])
  })
})

describe("list edits", () => {
  const listPath = "faq.categories[applying].items"

  it("adds an item", () => {
    const next = addListItem(englishFaq, listPath, { id: "new", question: "New?" })

    expect(listRows(valueAt(next, listPath), undefined).map((row) => row.id)).toEqual([
      "how",
      "when",
      "new",
    ])
  })

  it("removes an item outright, which is what English does", () => {
    const next = removeListItem(englishFaq, listPath, "how")

    expect(valueAt(next, `${listPath}[how]`)).toBeUndefined()
  })

  it("tombstones an English item in a language row instead of deleting it", () => {
    const spanish = { faq: { categories: [{ id: "applying", items: [] }] } }

    const next = tombstoneListItem(spanish, listPath, "how")

    expect(valueAt(next, `${listPath}[how]`)).toEqual({ id: "how", _deleted: true })
  })

  it("keeps a translated item's values when it is tombstoned", () => {
    const spanish = setValueAt({}, `${listPath}[how].answerHtml`, "<p>Solicite.</p>")

    const next = tombstoneListItem(spanish, listPath, "how")

    expect(valueAt(next, `${listPath}[how]`)).toEqual({
      id: "how",
      answerHtml: "<p>Solicite.</p>",
      _deleted: true,
    })
  })

  it("drops an item that held nothing but a tombstone when it is restored", () => {
    const spanish = tombstoneListItem({}, listPath, "how")

    const next = restoreListItem(spanish, listPath, "how")

    expect(valueAt(next, `${listPath}[how]`)).toBeUndefined()
  })

  it("keeps a translated item when its tombstone is lifted", () => {
    const spanish = tombstoneListItem(
      setValueAt({}, `${listPath}[how].answerHtml`, "<p>Solicite.</p>"),
      listPath,
      "how"
    )

    const next = restoreListItem(spanish, listPath, "how")

    expect(valueAt(next, `${listPath}[how]`)).toEqual({
      id: "how",
      answerHtml: "<p>Solicite.</p>",
    })
  })
})

describe("pathsThatHideContent", () => {
  it("reports an emptied field where English has something to show", () => {
    const english = { disclaimers: { privacyHtml: "<p>Privacy</p>" } }
    const spanish = setValueAt({}, "disclaimers.privacyHtml", "")

    expect(
      pathsThatHideContent(spanish, english, [
        "disclaimers.privacyHtml",
        "disclaimers.disclaimerHtml",
      ])
    ).toEqual(["disclaimers.privacyHtml"])
  })

  it("says nothing when English has nothing there either", () => {
    const spanish = setValueAt({}, "disclaimers.privacyHtml", "")

    expect(pathsThatHideContent(spanish, {}, ["disclaimers.privacyHtml"])).toEqual([])
  })
})
