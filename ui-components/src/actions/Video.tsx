import React from "react"
import { createClassDeclaration } from "typescript"
import "./Video.scss"

enum VideoSource {
  youtube = "youtube",
}
export interface VideoProps {
  /** Located within the square brackets in the following example: https://www.youtube.com/watch?v=[dw5s6rF7kxU] */
  videoId: string
  label: string
  videoSource?: VideoSource
  ccLang?: string
}

const Video = ({ videoId, videoSource = VideoSource.youtube, label, ccLang = "" }: VideoProps) => {
  let fullVideoUrl = ""
  if (videoSource === VideoSource.youtube)
    fullVideoUrl = `https://www.youtube.com/embed/${videoId}?disablekb=1&cc_load_policy=1&cc_lang_pref=${ccLang}`
  return (
    <div className="video">
      <iframe
        title={label}
        src={fullVideoUrl}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      />
    </div>
  )
}

export { Video as default, Video }
