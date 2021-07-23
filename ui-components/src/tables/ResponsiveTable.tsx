import * as React from "react"
import { Row } from "./StandardTable"
import "./ResponsiveTable.scss"

interface ResponsiveTableProps {
  header: React.ReactNode
  rows: React.ReactNode[]
}

const ResponsiveTable = (props: ResponsiveTableProps) => {
  const tableClasses = ["responsive-table"]

  return (
    <div style={{ overflowX: "auto" }}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <Row>{props.header}</Row>
        </thead>
        {props.rows &&
          props.rows.map((row, index) => {
            return (
              <tbody className="responsive-table__row">
                <Row className="responsive-table__inner-row" key={index}>
                  {props.header}
                </Row>
                <Row className="responsive-table__inner-row">{row}</Row>
              </tbody>
            )
          })}
      </table>
    </div>
  )
}

export { ResponsiveTable as default, ResponsiveTable }
