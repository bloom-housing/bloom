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
    <div class="app-card__section inset">
      
    </div>
  </div>
)