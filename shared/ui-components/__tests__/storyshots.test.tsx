import initStoryshots from "@storybook/addon-storyshots";
import { mount } from "enzyme";
import { createSerializer } from "enzyme-to-json";

initStoryshots({
  renderer: mount,
  snapshotSerializers: [createSerializer()]
});
