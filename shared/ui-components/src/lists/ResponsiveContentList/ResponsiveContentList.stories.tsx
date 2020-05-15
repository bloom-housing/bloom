import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody,
} from "./ResponsiveContentList"

export default {
  title: "Sections|ResponsiveContentList",
  decorators: [withA11y],
}

export const withContentItems = () => (
  <ResponsiveContentList>
    <ResponsiveContentItem>
      <ResponsiveContentItemHeader>
        <h3 className="md:text-black font-sans uppercase md:normal-case md:font-serif md:text-2xl">
          Item 1 Header
        </h3>
      </ResponsiveContentItemHeader>
      <ResponsiveContentItemBody>
        <p>Item 1 Content</p>
      </ResponsiveContentItemBody>
    </ResponsiveContentItem>

    <ResponsiveContentItem>
      <ResponsiveContentItemHeader>
        <h3 className="md:text-black font-sans uppercase md:normal-case md:font-serif md:text-2xl">
          Item 2 Header
        </h3>
      </ResponsiveContentItemHeader>
      <ResponsiveContentItemBody>
        <p>Item 2 Content</p>
      </ResponsiveContentItemBody>
    </ResponsiveContentItem>
  </ResponsiveContentList>
)
