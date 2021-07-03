// From https://www.npmjs.com/package/@storybook/addon-storyshots-puppeteer

import initStoryshots from "@storybook/addon-storyshots"
import { axeTest } from "@storybook/addon-storyshots-puppeteer"
import * as path from "path"

initStoryshots({
  suite: "a11y checks",
  test: axeTest({
    storybookUrl: `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
})
