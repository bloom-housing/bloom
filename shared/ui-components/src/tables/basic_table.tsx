import * as React from "react"

export const Row = (props: any) => <tr>{props.children}</tr>

export const HeaderCell = (props: any) => (
  <th className="text-left uppercase bg-gray-200 p-5 font-semibold tracking-wider border-0 border-b border-blue-600">
    {props.children}
  </th>
)

export const Cell = (props: any) => (
  <td data-label={props.headerLabel} className="p-5">
    {props.children}
  </td>
)

export const BasicTable = (props: any) => {
  const { headers, data } = props

  const headerLabels = Object.values(headers).map(col => <HeaderCell>{col}</HeaderCell>)

  const body = data.map((row: any) => {
    const cols = Object.keys(headers).map(colKey => (
      <Cell headerLabel={headers[colKey]}>{row[colKey]}</Cell>
    ))

    return <Row>{cols}</Row>
  })

  let tableClasses = ["w-full", "text-sm"]
  if (props.responsiveCollapse) {
    tableClasses.push("responsive-collapse")
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <Row>{headerLabels}</Row>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
