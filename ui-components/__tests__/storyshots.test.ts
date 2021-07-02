// From https://www.npmjs.com/package/@storybook/addon-storyshots-puppeteer

import initStoryshots from "@storybook/addon-storyshots"
import { axeTest } from "@storybook/addon-storyshots-puppeteer"

initStoryshots({
  suite: "a11y checks",
  test: axeTest({
    storybookUrl: "http://192.168.0.102:62285",
  }),
})
