import * as React from "react"
import { Textarea } from "./Textarea"

export default {
  title: "Forms/Textarea",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const defaultTextarea = () => <Textarea label={"Label"} />

export const maxLengthCustom = () => <Textarea maxLength={10} label={"Label"} />

export const noResize = () => <Textarea resize={false} label={"Label"} />

export const customSize = () => <Textarea resize={false} cols={15} rows={10} label={"Label"} />

export const disabled = () => <Textarea disabled={true} label={"Label"} />

export const errorMessage = () => <Textarea errorMessage={"Error message"} label={"Label"} />

export const placeholder = () => <Textarea placeholder={"Custom placeholder"} label={"Label"} />
