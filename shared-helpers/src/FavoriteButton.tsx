import * as React from "react"
import { AppearanceSizeType, Button } from "@bloom-housing/ui-components"
import { Icon, IconFillColors } from "../../detroit-ui-components/src/icons/Icon"
import { t } from "@bloom-housing/ui-components"
import { AuthContext } from "./AuthContext"
import { useContext, useEffect, useState } from "react"

export interface FavoriteButtonProps {
  id: string
  name: string
}

const FavoriteButton = ({ id, name }: FavoriteButtonProps) => {
  const { profile, userPreferencesService, updateProfile } = useContext(AuthContext)
  const [listingFavorited, setListingFavorited] = useState(false)
  const preferences = profile?.preferences

  useEffect(() => {
    setListingFavorited(preferences?.favoriteIds?.includes(id) ?? false)
  }, [preferences])

  if (!profile) {
    return <span />
  }

  const addFavorite = async () => {
    if (!profile || listingFavorited) {
      return
    }
    if (profile && !profile.preferences?.favoriteIds) {
      if (!profile.preferences) {
        profile.preferences = { favoriteIds: [id] }
      } else if (!profile.preferences?.favoriteIds) {
        profile.preferences.favoriteIds = [id]
      }
    } else {
      preferences?.favoriteIds?.push(id)
    }

    try {
      await userPreferencesService?.update({
        id: profile.id,
        body: preferences ?? { favoriteIds: [id] },
      })
      setListingFavorited(true)
      if (updateProfile) {
        updateProfile(profile)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const removeFavorite = async () => {
    if (!profile || !preferences?.favoriteIds || preferences?.favoriteIds?.length === 0) {
      return
    }

    const index: number = preferences.favoriteIds?.indexOf(id)
    preferences?.favoriteIds?.splice(index, 1)

    try {
      await userPreferencesService?.update({
        id: profile.id,
        body: preferences,
      })
      setListingFavorited(false)
      if (updateProfile) {
        updateProfile(profile)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <span>
      {listingFavorited ? (
        <span>
          <Button
            className="mx-2 p-3 rounded-full bg-primary-dark border-primary-dark"
            size={AppearanceSizeType.small}
            onClick={() => removeFavorite()}
            ariaLabel={t("t.unfavorite")}
          >
            <Icon
              symbol={"likeFill"}
              size={"extra-medium"}
              fill={IconFillColors.white}
              iconClass={"favorited-fill mt-0"}
            />
          </Button>
          <a
            role="button"
            aria-label={t("t.unfavorite")}
            onClick={removeFavorite}
            className={"cursor-pointer font-bold align-middle"}
          >
            {t("t.favorite")}
          </a>
        </span>
      ) : (
        <span>
          <Button
            className="mx-2 p-3 rounded-full"
            size={AppearanceSizeType.small}
            onClick={() => addFavorite()}
            ariaLabel={t("t.favorite")}
          >
            <Icon symbol={"like"} size={"extra-medium"} iconClass={"mt-0"} />
          </Button>
          <a
            role="button"
            aria-label={t("t.favorite")}
            onClick={addFavorite}
            className={"cursor-pointer font-bold align-middle"}
          >
            {t("t.favorite")}
          </a>
        </span>
      )}
      {/* Below uses aria-live which announces changes to a screen reader. The element must be "visible" to the screen reader, hence the classes on there. */}
      <span
        className="text-white text-xs max-h-px max-w-0 inline-block overflow-hidden"
        aria-live="assertive"
      >
        {listingFavorited ? `${t("t.favorited")} ${name}` : `${t("t.unfavorited")} ${name}`}
      </span>
    </span>
  )
}

export { FavoriteButton as default, FavoriteButton }
