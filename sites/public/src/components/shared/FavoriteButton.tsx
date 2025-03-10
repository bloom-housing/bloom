import React from "react"
import HeartIcon from "@heroicons/react/24/solid/HeartIcon"
import { Button, Icon } from "@bloom-housing/ui-seeds"

const FavoriteButton = (props) => {
  const buttonVariant = props.favorited ? "secondary" : "secondary-outlined"

  return (
    <Button
      variant={buttonVariant}
      size="sm"
      leadIcon={
        <Icon>
          <HeartIcon />
        </Icon>
      }
    >
      {props.children}
    </Button>
  )
}

export default FavoriteButton
