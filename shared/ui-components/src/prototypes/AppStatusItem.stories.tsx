import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AppStatusItem.scss"
import AppStatusItem from "./AppStatusItem"

export default {
  title: "Prototypes|AppStatusItem",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const AppStatusItem = () => (
    <article className="feed-item is-editable animated-fade">
        <div className="feed-item-inner">
            <header className="feed-item-header">
                <h3 className="feed-item-title">Potrero 1010</h3>
                <p className="feed-item-due">Application Deadline: January 12th 2016</p>
            </header>

            <section className="feed-item-content">
                <div className="feed-item-details">
                   <p className="feed-item-address">1010 16th Street<br /> Studio: 22 units, 1 Bedroom: 33 units 2 Bedroom: 38 units</p>
                </div>

                <div className="feed-item-action">
                    <p className="feed-item-status">
                        <span className="feed-item-label is-submitted">Status: In Progress</span>
                    </p>
                    <a href="#" className="button small primary">Continue Application</a>
                </div>
            </section>

            <footer className="feed-item-footer">
                <div className="feed-item-links">
                    <a href="#" className="feed-item-link lined">See Listing</a>
                    <a className="feed-item-link alert lined">Delete</a>
                </div>

                <div className="feed-item-meta">
                    <p className="feed-item-date">Edited: January 12th 2016</p>
                </div>
            </footer>
        </div>
    </article>
)