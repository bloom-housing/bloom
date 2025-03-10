import React from "react"
import FavoritesView from "../../../components/account/FavoritesView"
import { useProfileFavoriteListings } from "../../../lib/hooks"

const Favorites = (props) => {
  const favoriteListings = useProfileFavoriteListings()

  return <FavoritesView listings={favoriteListings} />
}

export default Favorites
