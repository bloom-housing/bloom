import React from "react"
import "./Video.scss"
import { useRouter } from "next/router"

export interface VideoProps {
  url: string
  label: string
  ccLang?: string
}

const Video = (props: VideoProps) => {
  const youtubeA11y = `?disablekb=1&cc_load_policy=1&cc_lang_pref=${props.ccLang}`
  return (
    <div className="video">
      <iframe
        title={props.label}
        src={props.url + youtubeA11y}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      />
    </div>
  )
}

export { Video as default, Video }
