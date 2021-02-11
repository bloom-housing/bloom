import React from "react"
import { PageHeader } from "../src/headers/PageHeader"
import { shallow } from "enzyme"

test("example test", () => {
  const wrapper = shallow(<PageHeader title="hello i am a header" />)
  expect(wrapper.text()).toEqual("hello i am a header")
})
