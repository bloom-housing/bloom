import React from "react"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@bloom-housing/shared-helpers/src/views/components/Map"), {
  ssr: false,
})

type LazyMapProps = {
  [key: string]: unknown
}

const LazyMap = (props: LazyMapProps) => {
  return <Map {...props} />
}

export default LazyMap
