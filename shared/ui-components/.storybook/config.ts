import { configure } from "@storybook/react"
import "@bloom/ui-components/styles/index.scss"

// automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /stories\.tsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)
