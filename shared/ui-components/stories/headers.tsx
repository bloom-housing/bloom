import * as React from "react";
import { storiesOf } from "@storybook/react";
import ImageHeader from "../src/headers/image_header";
import PageHeader from "../src/headers/page_header";

storiesOf("Headers|ImageHeader", module).add("with image and title", () => (
  <ImageHeader imageUrl="/images/listing.jpg" title="Hello World" />
));

storiesOf("Headers|PageHeader", module).add("with text content", () => (
  <PageHeader>Hello World</PageHeader>
));
