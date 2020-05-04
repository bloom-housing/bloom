import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./DashBlocks.scss"
import HeaderBadge from "./HeaderBadge"

export default {
  title: "Prototypes|DashBlocks",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const DashBlocks = () => (
<div class="dash-blocks">
  <div class="dash-block">
    <a href="#" class="dash-item">
      <span class="dash-item__badge">
        <HeaderBadge />
      </span>
      <h2 class="dash-item__name">My Applications</h2>
      <p>See lottery dates and listings for properties for which you've applied</p>
    </a>
  </div>

  <div class="dash-block">
    <a href="#" class="dash-item">
      <span class="dash-item__badge">
        <HeaderBadge />
      </span>
      <h2 class="dash-item__name">My Favorites</h2>
      <p>See properties you favorited in the past</p>
    </a>
  </div>

  <div class="dash-block">
    <a href="#" class="dash-item">
      <span class="dash-item__badge">
        <HeaderBadge />
      </span>
      <h2 class="dash-item__name">Eligibility Settings</h2>
      <p>Quickly search based on eligibility filters</p>
    </a>
  </div>

  <div class="dash-block">
    <a href="#" class="dash-item">
      <span class="dash-item__badge">
        <HeaderBadge />
      </span>
      <h2 class="dash-item__name">Account Settings</h2>
      <p>Account settings, email and password</p>
    </a>
  </div>
</div>
)