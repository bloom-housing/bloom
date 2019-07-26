import * as React from "react";
import { Header } from "@dahlia/ui-components/src/header/header";

const Layout = props => (
  <>
    <Header />
    <main>
      {props.children}
    </main>
    <hr/>
    <footer>footer</footer>
  </>
);

export default Layout;