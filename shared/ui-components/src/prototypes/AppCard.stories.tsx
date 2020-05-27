import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AppCard.scss"

export default {
  title: "Prototypes|AppCard",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AppCard = () => (
  <div className="app-card">
    <div className="app-card__header border-bottom">
      <div className="app-card__back">
        <a href="#" className="lined">
          Back
        </a>
      </div>
      <h2 className="app-card__question">
        Who would you’d like us to contact if we can’t get ahold of you?
      </h2>
      <p className="app-card__note">
        By providing an alternate contact, you are allowing us to discuss information on your
        application with them.
      </p>
    </div>
    <header className="app-card__sub-header border-top">
      <h3 className="app-card__sub-title">You</h3>
    </header>
    <div className="app-card__section inset">
      <div className="info-item mb-4">
        <h4 className="info-item__name">Name</h4>
        <p className="info-item__value">Laura Smith</p>
      </div>
      <div className="info-item mb-4">
        <p className="info-item__value">Laura Smith</p>
        <h4 className="info-item__name">Name</h4>
      </div>
    </div>
  </div>
)

export const AppCardEdit = () => (
  <div className="app-card">
    <div className="app-card__header border-bottom">
      <div className="app-card__back">
        <a href="#" className="lined">
          Back
        </a>
      </div>
      <h2 className="app-card__question">
        Who would you’d like us to contact if we can’t get ahold of you?
      </h2>
      <p className="app-card__note">
        By providing an alternate contact, you are allowing us to discuss information on your
        application with them.
      </p>
    </div>
    <header className="app-card__sub-header border-top">
      <h3 className="app-card__sub-title">You</h3>
      <a className="edit-link hide-for-print darker" href="#">
        Edit
      </a>
    </header>
    <div className="app-card__section inset">
      <div className="info-item mb-4 pb-4 border-b">
        <h4 className="info-item__name">Name</h4>
        <p className="info-item__value">Laura Smith</p>
        <a className="edit-link info-item__link" href="#">
          Edit
        </a>
      </div>
      <div className="info-item mb-4 pb-4 border-b">
        <p className="info-item__value">Laura Smith</p>
        <h4 className="info-item__name">Name</h4>
        <a className="edit-link info-item__link" href="#">
          Edit
        </a>
      </div>
    </div>
  </div>
)
