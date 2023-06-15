import * as React from "react"

import { DoorwayLinkableCardGroup } from "./DoorwayLinkableCardGroup"
import { Card, DoorwayCollapsibleSection, Heading, t } from "../../.."

export default {
  title: "Help center/Doorway Linkable Card Group",
}
const getStartedCards = [
  <Card
    className="border-0"
    key="blah-1"
    jumplinkData={{ title: "I'm just a heading for blah 1 jumplink" }}
  >
    <Card.Header>
      <Heading priority={2} className={"text-primary-lighter font-semibold"}>
        {t("I'm just a heading for blah 1")}
      </Heading>
    </Card.Header>
    <Card.Section>
      GET STARTED Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt
      veniam officiis quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis,
      sunt cumque delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Esse illo ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto.
      Velit totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
      voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
      inventore illo.
    </Card.Section>
    <Card.Section>
      <DoorwayCollapsibleSection title="blah title">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </DoorwayCollapsibleSection>
      <DoorwayCollapsibleSection title="blah title 2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </DoorwayCollapsibleSection>
    </Card.Section>
    <Card.Footer>
      <Card.Section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </Card.Section>
    </Card.Footer>
  </Card>,
  <Card
    className="border-0"
    key="blah-2"
    jumplinkData={{ title: "I'm just a heading for blah 2 jumplink" }}
  >
    <Card.Header>
      <Heading priority={2} className={"text-primary-lighter font-semibold"}>
        {"I'm just a heading for blah 2"}
      </Heading>
    </Card.Header>
    <Card.Section>this blah blah blah is text</Card.Section>
    <Card.Section>
      <DoorwayCollapsibleSection title="blah title">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </DoorwayCollapsibleSection>
      <DoorwayCollapsibleSection title="blah title 2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </DoorwayCollapsibleSection>
    </Card.Section>
    <Card.Footer>
      <Card.Section>
        <p>Footer content here.</p>
      </Card.Section>
    </Card.Footer>
  </Card>,
]

export const test = () => (
  <DoorwayLinkableCardGroup cards={getStartedCards}>
    <Card className="border-0">
      <Card.Section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ullam a sunt veniam officiis
        quae vitae similique non odio, minus minima nisi voluptatem? Sequi veritatis, sunt cumque
        delectus culpa harum? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse illo
        ullam nulla possimus, incidunt mollitia culpa quam, ex sequi totam provident iusto. Velit
        totam deleniti unde fugiat minima omnis commodi! Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem excepturi nemo doloribus est consequatur praesentium enim
        voluptate fuga qui earum repellendus, placeat facere debitis ex eaque repudiandae provident
        inventore illo.
      </Card.Section>
    </Card>
  </DoorwayLinkableCardGroup>
)
