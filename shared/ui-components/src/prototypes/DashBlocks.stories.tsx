import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./DashBlocks.scss"
import HeaderBadge from "./HeaderBadge"

export default {
  title: "Prototypes|DashBlocks",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const DashBlocks = () => (
  <div className="dash-blocks">
    <div className="dash-block">
      <a href="#" className="dash-item">
        <span className="dash-item__badge">
          <HeaderBadge />
        </span>
        <h2 className="dash-item__name">My Applications</h2>
        <p>See lottery dates and listings for properties for which you've applied</p>
      </a>
    </div>

    <div className="dash-block">
      <a href="#" className="dash-item">
        <span className="dash-item__badge">
          <span className="header-badge">
            <svg id="i-settings" viewBox="0 0 32 32">
              <title>settings</title>
              <path
                fill="#c7cbc7"
                d="M30.075 14.091c-2.858-0.549-4.168-3.888-2.446-6.234l1.208-1.648-2.611-2.611-1.624 1.099c-2.408 1.632-5.696 0.197-6.138-2.677l-0.31-2.021h-3.693l-0.478 2.486c-0.538 2.794-3.757 4.128-6.114 2.531l-2.096-1.419-2.611 2.611 1.208 1.648c1.72 2.346 0.411 5.685-2.446 6.234l-1.925 0.37v3.693l2.021 0.31c2.875 0.443 4.309 3.73 2.677 6.139l-1.099 1.622 2.611 2.611 1.648-1.208c2.347-1.72 5.685-0.411 6.234 2.446l0.371 1.925h3.693l0.219-1.421c0.453-2.939 3.861-4.35 6.259-2.592l1.16 0.851 2.611-2.611-1.099-1.622c-1.632-2.408-0.197-5.696 2.677-6.139l2.021-0.31v-3.693l-1.925-0.37zM16.307 19.077c-1.53 0-2.77-1.24-2.77-2.77s1.24-2.77 2.77-2.77 2.77 1.24 2.77 2.77c0 1.53-1.24 2.77-2.77 2.77v0 0z"
              ></path>
              <path
                fill="#556080"
                d="M16.307 10.461c-3.229 0-5.846 2.618-5.846 5.846s2.618 5.846 5.846 5.846 5.846-2.618 5.846-5.846c0-3.229-2.618-5.846-5.846-5.846v0 0zM16.307 19.077c-1.53 0-2.77-1.24-2.77-2.77s1.24-2.77 2.77-2.77 2.77 1.24 2.77 2.77c0 1.53-1.24 2.77-2.77 2.77v0 0z"
              ></path>
            </svg>
          </span>
        </span>
        <h2 className="dash-item__name">Account Settings</h2>
        <p>Account settings, email and password</p>
      </a>
    </div>
  </div>
)
