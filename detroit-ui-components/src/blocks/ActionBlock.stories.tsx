import React from "react"
import ActionBlock, { ActionBlockLayout } from "./ActionBlock"
import { Button } from "../actions/Button"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import Icon from "../icons/Icon"

export default {
  title: "Blocks/Action Block",
}

export const blockWithIcon = () => (
  <ActionBlock
    header="Action block"
    background="primary-lighter"
    icon={<Icon size="3xl" symbol="mail" />}
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.primary}>
        Action
      </Button>,
    ]}
  ></ActionBlock>
)

export const blockNoIconNoBackgroung = () => (
  <ActionBlock
    header="Full length headline text that spans the block"
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.info}>
        Button
      </Button>,
    ]}
  ></ActionBlock>
)

export const blockWithDarkerBg = () => (
  <ActionBlock
    header="Action block"
    icon={<Icon size="3xl" symbol="mail" />}
    background="primary-darker"
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.primary}>
        Action
      </Button>,
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.info}>
        Action
      </Button>,
    ]}
  ></ActionBlock>
)

export const blockWithSubheader = () => (
  <ActionBlock
    header="Full length headline text that spans the block"
    subheader="Brunch leggings trust fund tattooed, flannel sustainable man braid venmo. "
    icon={<Icon size="3xl" symbol="mail" />}
    background="primary-lighter"
    actions={[<Button onClick={() => console.log("click")}>Action</Button>]}
  ></ActionBlock>
)

export const inlineBlock = () => (
  <ActionBlock
    header="See more listings from our community partners"
    icon={<Icon size="3xl" symbol="mail" />}
    background="primary-lighter"
    layout={ActionBlockLayout.inline}
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.primary}>
        Action
      </Button>,
    ]}
  ></ActionBlock>
)

export const inlineBlockWith2actions = () => (
  <ActionBlock
    header="Find more listings on our website"
    background="primary-darker"
    layout={ActionBlockLayout.inline}
    actions={[
      <Button onClick={() => console.log("click")}>First Come, First Served</Button>,
      <Button onClick={() => console.log("click")}>First Come, First Served</Button>,
    ]}
  ></ActionBlock>
)

export const inlineBlockWith2actionsAsLinks = () => (
  <ActionBlock
    header="Find more listings on our website:"
    background="primary-darker"
    layout={ActionBlockLayout.inline}
    actions={[
      <a className="button" key="action-1" href={"https://google.com"}>
        {"First come, first served"}
      </a>,
      <a className="button" key="action-2" href={"https://google.com"}>
        {"City Second loan program"}
      </a>,
    ]}
  ></ActionBlock>
)
