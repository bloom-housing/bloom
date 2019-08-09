import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "../src/test-button/button";
import { PageHeader } from "../src/headers/page_header";

storiesOf("Button", module)
  .add("with text", () => <Button>Hello Button</Button>)
  .add("with emoji", () => (
    <Button>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf("Header", module).add("header", () => <PageHeader />);
