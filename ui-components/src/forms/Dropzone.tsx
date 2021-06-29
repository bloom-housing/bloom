import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import "./Dropzone.scss"

interface DropzoneProps {
  uploader: (file: File) => void
  label: string
  helptext?: string
  accept?: string | string[]
  progress?: number
}

const Dropzone = (props: DropzoneProps) => {
  const { uploader } = props
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => uploader(file))
    },
    [uploader]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.accept,
    maxFiles: 1,
  })

  const classes = ["dropzone", "control"]
  if (isDragActive) classes.push("is-active")

  return (
    <div className="field">
      <label className="label">{props.label}</label>
      {props.helptext && <p className="text-sm mt-2 mb-4 text-gray-700">{props.helptext}</p>}
      {props.progress && props.progress == 100 ? (
        <></>
      ) : props.progress && props.progress > 0 ? (
        <progress style={{ maxWidth: "250px" }} max="100" value={props.progress}></progress>
      ) : (
        <div className={classes.join(" ")} {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop files here…</p>
          ) : (
            <p>
              Drag files here or <u className="text-primary">choose from folder</u>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export { Dropzone as default, Dropzone }
