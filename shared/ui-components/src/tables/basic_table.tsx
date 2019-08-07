import * as React from 'react'
import { HeaderCell, Cell } from './cell'
import { Row } from './row'

export const BasicTable = (props: any) => {
  const { headers, data } = props

  const headerLabels = Object.values(headers).map(col => (
    <HeaderCell>{col}</HeaderCell>
  ))

  const body = data.map(row => {
    const cols = Object.keys(headers).map(colKey => (
      <Cell headerLabel={headers[colKey]}>{row[colKey]}</Cell>
    ))

    return <Row>{cols}</Row>
  })

  let tableClasses = ['w-full', 'text-sm']
  if (props.responsiveCollapse) {
    tableClasses.push('responsive-collapse')
  }

  return (
    <div style={{"overflowX": "auto"}}>
      <table className={tableClasses.join(' ')}>
        <thead>
          <Row>
            {headerLabels}
          </Row>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </div>
  )
}