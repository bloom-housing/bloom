import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AppCard.scss"

export default {
  title: "Prototypes|AppCard",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const AppCard = () => (
  <div className="app-card">
    <div class="app-card__header border-bottom">
      <div class="app-card__back"><a href="#" class="lined">Back</a></div>
      <h2 class="app-card__question">Who would you’d like us to contact if we can’t get ahold of you?</h2>
      <p class="app-card__note">By providing an alternate contact, you are allowing us to discuss information on your application with them.</p>
    </div>
    <header class="app-card__sub-header border-top">
      <h3 class="app-card__sub-title">You</h3>
    </header>
    <div class="app-card__section inset">
      <div class="info-item mb-2">
        <h4 class="info-item__name">Name</h4>
        <p class="info-item__value">Laura Smith</p>
      </div>
    </div>
  </div>
)