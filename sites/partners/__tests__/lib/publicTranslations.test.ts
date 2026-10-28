import fs from "fs"
import path from "path"
import { publicOverrideTranslations } from "../../src/lib/publicTranslations"

const OVERRIDES_DIR = path.join(__dirname, "../../../public/page_content/locale_overrides")

// general.json is the English layer; every other file is named for its locale.
const localeForFile = (file: string) =>
  file === "general.json" ? "en" : path.basename(file, ".json")

const localeFiles = fs.readdirSync(OVERRIDES_DIR).filter((file) => file.endsWith(".json"))

describe("publicOverrideTranslations", () => {
  // A fork customizes the public site's locale overrides, so this map drifts silently unless the
  // pairing is asserted. Without it the editor compares a language against the wrong base.
  it("covers every locale the public site defines overrides for", () => {
    expect(localeFiles.length).toBeGreaterThan(0)
    expect(Object.keys(publicOverrideTranslations).sort()).toEqual(
      localeFiles.map(localeForFile).sort()
    )
  })

  it.each(localeFiles)("loads %s unmodified", (file) => {
    const contents = JSON.parse(fs.readFileSync(path.join(OVERRIDES_DIR, file), "utf8"))

    expect(publicOverrideTranslations[localeForFile(file)]).toEqual(contents)
  })
})
