import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./ButtonPager.scss"
import ButtonPager from "./ButtonPager"

export default {
  title: "Prototypes|ButtonPager",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const ButtonPager = () => (
  <div class="button-pager">
    <div class="button-pager__row primary">
      <button class="button filled">Next</button>
    </div>
    <div class="button-pager__row">
      <button class="button button button-link">Save and Finish Later</button>
    </div>
  </div>
)