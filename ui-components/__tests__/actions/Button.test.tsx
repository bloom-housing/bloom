import React from "react"
import { shallow } from "enzyme"
import { Button } from "../../src/actions/Button"
import { AppearanceSizeType } from "../../src/global/AppearanceTypes"

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

test("shows small button", () => {
  const wrapper = shallow(
    <Button size={AppearanceSizeType.small} onClick={handleClick}>
      Small Button
    </Button>
  )
  expect(wrapper.html()).toEqual('<button class="button is-small">Small Button</button>')
})
