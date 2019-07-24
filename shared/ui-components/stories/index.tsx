import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { Button } from "../src/test-button/button";
import { Header } from "../src/header/header";

storiesOf("Button", module)
  .add("with text", () => <Button>Hello Button</Button>)
  .add("with emoji", () => (
    <Button>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf("Header", module)
  .add("header", () => (
    <Header />
  ))