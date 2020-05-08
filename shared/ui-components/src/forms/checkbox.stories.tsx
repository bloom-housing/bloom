import * as React from "react"

export default {
  title: "Forms|Checkbox",
  decorators: [(storyFn: () => JSX.Element) => <div style={{ padding: "30px" }}>{storyFn()}</div>],
}

export const standard = () => (
  <div className="field">
    <input type="checkbox" id="remember" name="remember" />
    <label htmlFor="remember">Remember me</label>
  </div>
)
