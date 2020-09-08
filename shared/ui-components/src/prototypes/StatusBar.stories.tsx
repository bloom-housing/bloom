import React from "react"

export default {
  title: "Prototypes/StatusBar",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const StatusBar = () => (
  <div className="flex text-sm items-center">
     <div className="pr-2 mr-4 border-r border-gray-600"><span>Status:</span><span className="mx-2 px-2 py-1 bg-primary-light text-primary rounded-md font-semibold font-alt-sans uppercase tracking-widest">Draft</span></div>
     <div><span className="mr-4">Last Updated: August 1, 2020</span></div>
     <button className="button is-small is-filled">Save</button>
  </div>
)

export const StatusBarSubmitted = () => (
  <div className="flex text-sm items-center">
     <div className="pr-2 mr-4 border-r border-gray-600"><span>Status:</span><span className="mx-2 px-2 py-1 bg-success text-white rounded-md font-semibold font-alt-sans uppercase tracking-widest">Submitted</span></div>
     <div><span className="mr-4">Last Updated: August 1, 2020</span></div>
     <button className="button is-small">Edit</button>
  </div>
)