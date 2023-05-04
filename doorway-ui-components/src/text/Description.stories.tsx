import * as React from "react"
import { Description } from "./Description"
import { BADGES } from "../../.storybook/constants"

export default {
  title: "Text/Description 🚩",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    badges: [BADGES.GEN2],
  },
}

export const Default = () => (
  <dl className="column-definition-list">
    <Description term={"Title"} description={"Description"} />
    <Description term={"Title"} description={"Description"} />
    <Description term={"Title"} description={"Description"} />
    <Description term={"Title"} description={"This last description takes up the full width"} />
  </dl>
)

export const LongStrings = () => (
  <dl className="column-definition-list">
    <Description
      term={"Natoque penatibus"}
      description={
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo a diam sollicitudin tempor id eu. Porttitor lacus luctus accumsan tortor. Viverra mauris in aliquam sem fringilla. At augue eget arcu dictum. Penatibus et magnis dis parturient montes nascetur ridiculus mus mauris. Velit euismod in pellentesque massa placerat duis ultricies lacus sed. Aliquam vestibulum morbi blandit cursus risus. Tellus at urna condimentum mattis pellentesque id nibh. Interdum consectetur libero id faucibus."
      }
    />
    <Description
      term={"Sed vulputate"}
      description={
        "Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Tristique senectus et netus et malesuada."
      }
    />
    <Description
      term={"Quam lacus suspendisse faucibus interdum"}
      description={
        "Ultrices neque ornare aenean euismod elementum. Tellus elementum sagittis vitae et leo duis. In egestas erat imperdiet sed euismod nisi porta. Nisl purus in mollis nunc sed id semper risus. Ac turpis egestas sed tempus urna et pharetra pharetra. Nibh mauris cursus mattis molestie a iaculis at erat pellentesque. Ultricies mi eget mauris pharetra et ultrices. Enim facilisis gravida neque convallis a cras semper auctor. Risus pretium quam vulputate dignissim suspendisse in est ante. Cursus vitae congue mauris rhoncus aenean vel."
      }
    />
    <Description
      term={"Auctor"}
      description={"Bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim."}
    />
  </dl>
)
