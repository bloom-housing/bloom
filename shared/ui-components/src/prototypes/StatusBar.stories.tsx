import React from "react"

import "./StatusBar.scss"

export default {
  title: "Prototypes/StatusBar",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const StatusBar = () => (
  <div className="status-bar">
     <div className="pr-2 mr-4 border-r border-gray-600"><span>Status:</span><span className="tag mx-2">Draft</span></div>
     <div><span className="mr-4">Last Updated: August 1, 2020</span></div>
     <button className="button is-small is-filled">Save</button>
  </div>
)

export const StatusBarSubmitted = () => (
  <div className="status-bar">
     <div className="pr-2 mr-4 border-r border-gray-600"><span>Status:</span><span className="tag mx-2 bg-success text-white">Submitted</span></div>
     <div><span className="mr-4">Last Updated: August 1, 2020</span></div>
     <button className="button is-small">Edit</button>
  </div>
)