import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AppStatusItem.scss"

export default {
  title: "Prototypes|AppStatusItem",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AppStatusItem = () => (
  <article className="status-item is-editable animated-fade">
    <div className="status-item__inner">
      <header className="status-item__header">
        <h3 className="status-item__title">Potrero 1010</h3>
        <p className="status-item__due">Application Deadline: January 12th 2016</p>
      </header>

      <section className="status-item__content">
        <div className="status-item__details">
          <p className="status-item__address">
            1010 16th Street
            <br /> Studio: 22 units, 1 Bedroom: 33 units 2 Bedroom: 38 units
          </p>
        </div>

        <div className="status-item__action">
          <p className="status-item__status">
            <span className="status-item__label">Status: In Progress</span>
          </p>
          <a href="#" className="button small primary">
            Continue Application
          </a>
        </div>
      </section>

      <footer className="status-item__footer">
        <div className="status-item_links">
          <a href="#" className="status-item__link lined">
            See Listing
          </a>
          <a className="status-item__link alert lined">Delete</a>
        </div>

        <div className="status-item__meta">
          <p className="status-item__date">Edited: January 12th 2016</p>
        </div>
      </footer>
    </div>
  </article>
)

export const AppStatusItemSubmitted = () => (
  <article className="status-item is-submitted animated-fade">
    <div className="status-item__inner">
      <header className="status-item__header">
        <h3 className="status-item__title">Potrero 1010</h3>
        <p className="status-item__due">Application Deadline: January 12th 2016</p>
      </header>

      <section className="status-item__content">
        <div className="status-item__details">
          <p className="status-item__address">
            1010 16th Street
            <br /> Studio: 22 units, 1 Bedroom: 33 units 2 Bedroom: 38 units
          </p>
          <p className="status-item__number">Your lottery number is #98AU18</p>
        </div>

        <div className="status-item__action">
          <p className="status-item__status">
            <span className="status-item__label is-submitted">Status: Submitted</span>
          </p>
          <a href="#" className="button small">
            View Application
          </a>
        </div>
      </section>

      <footer className="status-item__footer">
        <div className="status-item__links">
          <a href="#" className="status-item__link lined">
            See Listing
          </a>
          <a className="status-item__link alert lined">Delete</a>
        </div>

        <div className="status-item__meta">
          <p className="status-item__date">Edited: January 12th 2016</p>
        </div>
      </footer>
    </div>
  </article>
)

export const AppStatusItemPastDue = () => (
  <article className="status-item is-past-due animated-fade">
    <div className="status-item__inner">
      <header className="status-item__header">
        <h3 className="status-item__title">Potrero 1010</h3>
        <p className="status-item__due">Application Deadline: January 12th 2016</p>
      </header>

      <section className="status-item__content">
        <div className="status-ite__details">
          <p className="status-item__address">
            1010 16th Street
            <br /> Studio: 22 units, 1 Bedroom: 33 units 2 Bedroom: 38 units
          </p>
          <p className="status-item__number">Your application was never submitted</p>
        </div>

        <div className="status-item__action">
          <p className="status-item__status">
            <span className="status-item__label is-past-due">Status: Never Submitted</span>
          </p>
        </div>
      </section>

      <footer className="status-item__footer">
        <div className="status-item__links">
          <a href="#" className="status-item__link lined">
            See Listing
          </a>
          <a className="status-item__link alert lined">Delete</a>
        </div>

        <div className="status-item__meta">
          <p className="status-item__date">Edited: January 12th 2016</p>
        </div>
      </footer>
    </div>
  </article>
)
