import * as React from "react"
import { Message } from "./Message"

export default {
  title: "Prototypes/Message",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const standard = () => <Message>Message</Message>

export const warning = () => <Message warning={true}>Warning</Message>
