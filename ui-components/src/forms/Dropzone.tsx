import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ErrorMessage } from "../notifications/ErrorMessage"
import "./Dropzone.scss"

const Dropzone = (props: { uploader: (file: any) => void; label: string }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => props.uploader(file))
  }, [props.uploader])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const classes = ["dropzone", "control"]
  if (isDragActive) classes.push("is-active")

  return (
    <div className="field">
      <label className="label">{props.label}</label>
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
    </div>
  )
}

export { Dropzone as default, Dropzone }
