import * as React from 'react';

interface ContentSectionProps {
  title: String;
  subtitle: String;
  icon?: String;
  children: JSX.Element;
}

export const ContentSection = (props: ContentSectionProps) => (
  <section className="py-10">
    <header className="mb-5">
      <hgroup>
        <h3 className="text-2xl">{props.title}</h3>
        <span className="text-gray-700">{props.subtitle}</span>
      </hgroup>
    </header>

    {props.children}
  </section>
);
