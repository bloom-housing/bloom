import * as React from 'react'

export const HeaderCell = (props: any) => (
  <th className="text-left uppercase bg-gray-200 p-5 font-semibold tracking-wider border-0 border-b border-blue-600">{props.children}</th>
)

export const Cell = (props: any) => (
  <td data-label={props.headerLabel} className="p-5">{props.children}</td>
)