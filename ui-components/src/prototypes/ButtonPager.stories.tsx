import React from "react"

import "./ButtonPager.scss"

export default {
  title: "Prototypes/ButtonPager",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const ButtonPager = () => (
  <div className="button-pager">
    <div className="button-pager__row primary">
      <button className="button is-filled">Next</button>
    </div>
    <div className="button-pager__row">
      <button className="button is-unstyled">Save and Finish Later</button>
    </div>
  </div>
)
