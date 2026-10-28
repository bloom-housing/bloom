// webpack loads .md as `asset/source`, a raw string. Jest needs the same, or any page importing a
// content file fails to require.
module.exports = {
  process(sourceText) {
    return { code: `module.exports = ${JSON.stringify(sourceText)};` }
  },
}
