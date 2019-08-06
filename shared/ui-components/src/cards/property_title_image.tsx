import * as React from "react";
import Link from "next/link";

interface PropertyTitleImageProps {
  title: string;
  imageUrl: string;
  listingId: Number;
}

export const PropertyTitleImage = (props: PropertyTitleImageProps) => (
  <Link href="listing/[id]" as={`/listing/${props.listingId}`}>
    <a>
      <figure className="relative">
        {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
        {!props.imageUrl && <div style={{ height: "300px", background: "#ccc" }} />}
        <figcaption className="absolute inset-x-0 bottom-0">
          <h2 className="text-white text-center text-2xl uppercase t-alt-sans mb-3">{props.title}</h2>
        </figcaption>
      </figure>
    </a>
  </Link>
);
