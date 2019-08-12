import * as React from "react";

const PageHeader = (props: any) => (
  <header className="bg-gray-300 py-10 px-5">
    <h1 className="title m-auto max-w-5xl">{props.children}</h1>
  </header>
);

export default PageHeader;
