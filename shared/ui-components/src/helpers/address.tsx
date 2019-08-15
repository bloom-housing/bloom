import * as React from 'react';

export const OneLineAddress = (props: any) => (
  <>
    {props.address.street_address},{` `}
    {props.address.city} {props.address.state},{` `}
    {props.address.zip_code}
  </>
)

export const MultiLineAddress = (props:any) => (
  <>
   {props.address.street_address}<br/>
    {props.address.city} {props.address.state},{` `}
    {props.address.zip_code}
  </>
)