const { createElement } = require("react")
const { action } = require("@storybook/addon-actions")

// Used to produce actions in Storybook when NextJS links are clicked
function onClick(event) {
  event.preventDefault()
  action("onClickLink")(event.target.href)
}

module.exports = ({ children, href }) => createElement("a", { ...children.props, href, onClick })
