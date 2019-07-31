import * as React from 'react';

interface DescriptionProps {
  term: String;
  description: any;
}

export const Description = (props: DescriptionProps) => (
  <>
    <dd className="t-serif text-xl">{props.term}</dd>
    <dt className="mb-4">{props.description}</dt>
  </>
);
