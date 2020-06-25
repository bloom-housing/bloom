import React from "react"
import { shallow } from "enzyme"
import Button from "../../src/atoms/Button"

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

test("shows small button", () => {
  const wrapper = shallow(
    <Button small={true} onClick={handleClick}>
      Small Button
    </Button>
  )
  expect(wrapper.html()).toEqual('<button class="button is-small">Small Button</button>')
})
