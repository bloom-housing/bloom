import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "./Tabs"

export default {
  title: "Navigation/Tabs",
  decorators: [
    (storyFn: any) => (
      <div style={{ padding: "1rem" }}>
        <style>
          {`
      .funky {
        color: orange !important;
        background: darkblue;
        font-family: cursive;
        font-weight: bold;
      }
      .tabs__panel.funky {
        display: block;
      }
    `}
        </style>

        {storyFn()}
      </div>
    ),
  ],
}

export const Default = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Title 1</Tab>
        <Tab>Title 2</Tab>
        <Tab>Long Tab Title 3</Tab>
        <Tab disabled>Disabled Tab</Tab>
        <Tab selectedClassName="funky">Funky Tab</Tab>
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
        <p>Paragraph text 1.</p>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
        <p>Paragraph text 2.</p>
      </TabPanel>
      <TabPanel>
        <h2>Any kind of content here</h2>
        <p>Paragraph text 3.</p>
        <p>Paragraph text 3.</p>
        <p>Paragraph text 3.</p>
      </TabPanel>
      <TabPanel>
        <p>This is disabled</p>
      </TabPanel>
      <TabPanel selectedClassName="funky">
        <p>Feeling funky!</p>
      </TabPanel>
    </Tabs>
  )
}
