import React from "react"

export default {
  title: "Prototypes|Testy McTestface",
  decorators: [(storyFn: any) => <div style={{ padding: "70px" }}>{storyFn()}</div>]
}

const paragraph = <p className="my-5">I am a paragraph.</p>

export const testingJustPlainHTML = () => (
  <div className="foo">
    <span>Nice!</span>

    {paragraph}

    <strong>
      And <a href="#">Links</a>...
    </strong>
  </div>
)

export const testingMoreHTML = () => (
  <div className="bar">
    {paragraph}

    <em>Something else to test</em>
  </div>
)
