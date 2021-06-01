import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "./Tabs"

export default {
  title: "Navigation/Tabs",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Title 1</Tab>
        <Tab>Title 2</Tab>
        <Tab>Long Tab Title 3</Tab>
        <Tab disabled>Disabled Tab</Tab>
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
        <p>Weee</p>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
        <p>Waaa</p>
      </TabPanel>
      <TabPanel>
        <h2>Any kind of content here</h2>
        <p>Woo hoo</p>
      </TabPanel>
      <TabPanel>
        <p>This is disabled</p>
      </TabPanel>
    </Tabs>
  )
}
