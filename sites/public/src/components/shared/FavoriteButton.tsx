import React, { Dispatch, SetStateAction } from "react"
import HeartIcon from "@heroicons/react/24/solid/HeartIcon"
import { Button, Icon } from "@bloom-housing/ui-seeds"

export interface FavoriteButtonProps {
  favorited: boolean
  setFavorited: Dispatch<SetStateAction<boolean>>
  children?: React.ReactNode
}

const FavoriteButton = (props: FavoriteButtonProps) => {
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
      onClick={() => props.setFavorited(!props.favorited)}
    >
      {props.children}
    </Button>
  )
}

export default FavoriteButton
