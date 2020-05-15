import * as React from "react"

export default {
  title: "Forms|Radio",
  decorators: [(storyFn: () => JSX.Element) => <div style={{ padding: "30px" }}>{storyFn()}</div>],
}

export const standard = () => (
  <>
    <div className="field field--inline">
      <input type="radio" id="radio1" name="radio" />
      <label htmlFor="radio1">Radio Button 1</label>
    </div>
    <div className="field field--inline">
      <input type="radio" id="radio2" name="radio" />
      <label htmlFor="radio2">Radio Button 2</label>
    </div>
  </>
)
