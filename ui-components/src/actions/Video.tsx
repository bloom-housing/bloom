import React from "react"
import "./Video.scss"

export interface VideoProps {
  url: string
  label: string
  ccLang?: string
}

const Video = (props: VideoProps) => {
  const fullVideoUrl = `${props.url}?disablekb=1&cc_load_policy=1&cc_lang_pref=${props.ccLang}`
  return (
    <div className="video">
      <iframe
        title={props.label}
        src={fullVideoUrl}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      />
    </div>
  )
}

export { Video as default, Video }
