import React from "react"
import ActionBlock, { ActionBlockLayout } from "./ActionBlock"
import { Button } from "../.."
import { AppearanceStyleType } from "../global/AppearanceTypes"
import Icon from "../icons/Icon"
import Heading from "../text/Heading"

export default {
  title: "Blocks/Action Block",
}

export const blockWithIcon = () => (
  <ActionBlock
    header={<Heading priority={2}>Action Block</Heading>}
    background="primary-lighter"
    icon={<Icon size="3xl" symbol="mail" />}
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.primary}>
        Action
      </Button>,
    ]}
  ></ActionBlock>
)

export const blockNoIconNoBackground = () => (
  <ActionBlock
    header={<Heading priority={2}>Full length headline text that spans the block</Heading>}
    actions={[
      <Button onClick={() => console.log("click")} styleType={AppearanceStyleType.info}>
        Button
      </Button>,
    ]}
  ></ActionBlock>
)

export const blockWithDarkerBg = () => (
  <ActionBlock
    header={<Heading priority={2}>Action Block</Heading>}
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
    header={<Heading priority={2}>Full length headline text that spans the block</Heading>}
    subheader="Brunch leggings trust fund tattooed, flannel sustainable man braid venmo. "
    icon={<Icon size="3xl" symbol="mail" />}
    background="primary-lighter"
    actions={[<Button onClick={() => console.log("click")}>Action</Button>]}
  ></ActionBlock>
)

export const inlineBlock = () => (
  <ActionBlock
    header={<Heading priority={2}>See more listings from our community partners</Heading>}
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
    header={<Heading priority={2}>Find more listings on our website</Heading>}
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
    header={<Heading priority={2}>Find more listings on our website</Heading>}
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
