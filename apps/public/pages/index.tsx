import * as React from "react";
import Layout from "../layouts/application";
import Hero from "@dahlia/ui-components/src/headers/hero";
import { getCurrentGroup } from "../lib/config";

export default props => {
  const region = getCurrentGroup();
  const heroTitle = (
    <>
      Apply for affordable housing in <em>{region}</em>
    </>
  );

  return (
    <Layout>
      <Hero title={heroTitle} buttonTitle="See Rentals" buttonLink="/listings" />
      <div>{props.polyglot.t("WELCOME.TITLE")}</div>
    </Layout>
  );
};
