import * as React from "react"
import "./Utilities.scss"

interface CustomMdxTableProps {
  data: (string | React.ReactNode)[][]
  headers: (string | React.ReactNode)[]
}

const CustomMdxTable = (props: CustomMdxTableProps) => {
  return (
    <table className={"mdx-table"}>
      {props.headers.length > 0 && (
        <tr>
          {props.headers.map((header) => {
            return <th align="left">{header}</th>
          })}
        </tr>
      )}

      {props.data.map((row) => {
        return (
          <tr>
            {row.map((cell) => {
              return <td>{cell}</td>
            })}
          </tr>
        )
      })}
    </table>
  )
}

export const Typography = () => {
  return (
    <CustomMdxTable
      headers={["Class", "Example"]}
      data={[
        [
          "text__large-primary",
          <div className={"text__large-primary"}>Large Primary Text Style</div>,
        ],
        [
          "text__medium-normal",
          <div className={"text__medium-normal"}>Medium Normal Text Style</div>,
        ],
        [
          "text__small-weighted",
          <div className={"text__small-weighted"}>Small Weighted Text Style</div>,
        ],
        ["text__small-normal", <div className={"text__small-normal"}>Small Normal Text Style</div>],
        [
          "text__underline-weighted",
          <div className={"text__underline-weighted"}>Underline Weighted Text Style</div>,
        ],
        [
          "text__light-weighted",
          <div className={"text__light-weighted"}>Light Weighted Text Style</div>,
        ],
        [
          "text__caps-weighted",
          <div className={"text__caps-weighted"}>Caps Weighted Text Style</div>,
        ],
        ["text_caps-spaced", <div className={"text_caps-spaced"}>Caps Spaced Text Style</div>],
      ]}
    />
  )
}
