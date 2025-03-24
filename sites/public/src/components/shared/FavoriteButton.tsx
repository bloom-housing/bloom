import React, { Dispatch, SetStateAction } from "react"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import { CustomIconMap } from "@bloom-housing/shared-helpers"

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
        <Icon outlined={!props.favorited}>
          {props.favorited ? CustomIconMap.heartIconSolid : CustomIconMap.heartIcon}
        </Icon>
      }
      onClick={() => props.setFavorited(!props.favorited)}
    >
      {props.children}
    </Button>
  )
}

export default FavoriteButton
