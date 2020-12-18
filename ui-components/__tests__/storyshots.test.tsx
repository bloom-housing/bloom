import initStoryshots, { multiSnapshotWithOptions } from "@storybook/addon-storyshots"
import { mount } from "enzyme"
import { createSerializer } from "enzyme-to-json"
import MockDate from "mockdate"

// Force all tests to use dates far in the future, so the storyshot files
// remain consistent between runs.
MockDate.set("2030-04-01T16:00:00.000Z")

initStoryshots({
  renderer: mount,
  snapshotSerializers: [createSerializer()],
  test: multiSnapshotWithOptions({
    renderer: mount,
  }),
})
