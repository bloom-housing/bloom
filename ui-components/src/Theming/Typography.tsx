import * as React from "react"
import "./Theming.scss"

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
        ["text__large-header", <div className={"text__large-header"}>Large Header Text Style</div>],
        [
          "text__medium-header",
          <div className={"text__medium-header"}>Medium Header Text Style</div>,
        ],
        [
          "text__small-weighted",
          <div className={"text__small-weighted"}>Small Weighted Text Style</div>,
        ],
        ["text__small-normal", <div className={"text__small-normal"}>Small Normal Text Style</div>],
        [
          "text__underline-header",
          <div className={"text__underline-header"}>Underline Header Text Style</div>,
        ],
        [
          "text__light-weighted",
          <div className={"text__light-weighted"}>Light Weighted Text Style</div>,
        ],
        [
          "text__caps-weighted",
          <div className={"text__caps-weighted"}>Caps Weighted Text Style</div>,
        ],
        ["text__field-label", <div className={"text__field-label"}>Field Label Text Style</div>],
      ]}
    />
  )
}
