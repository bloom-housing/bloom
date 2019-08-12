import initStoryshots, { multiSnapshotWithOptions } from "@storybook/addon-storyshots";
import { mount } from "enzyme";
import { createSerializer } from "enzyme-to-json";

initStoryshots({
  renderer: mount,
  snapshotSerializers: [createSerializer()],
  integrityOptions: { cwd: __dirname }, // it will start searching from the current directory
  test: multiSnapshotWithOptions({
    renderer: mount
  })
});
