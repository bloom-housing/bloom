import * as React from "react";
import { storiesOf } from "@storybook/react";
import ImageHeader from "./image_header";

storiesOf("Headers|ImageHeader", module).add("with image and title", () => (
  <ImageHeader imageUrl="/images/listing.jpg" title="Hello World" />
));
