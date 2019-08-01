import * as React from 'react';

interface ListSectionProps {
  title: String;
  subtitle: String;
  children?: JSX.Element;
}

export const ListSection = (props: ListSectionProps) => (
  <li className="custom-counter_item">
    <header className="custom-counter_header mb-4">
      <hgroup>
        <h4 className="text-1xl">{props.title}</h4>
        <span className="text-gray-700">{props.subtitle}</span>
      </hgroup>
    </header>

    {props.children}
  </li>
);
