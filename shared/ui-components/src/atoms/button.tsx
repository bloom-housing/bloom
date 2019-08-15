import * as React from 'react'
import Link from 'next/link'

interface ButtonProps {
  href: string;
  children: any;
}

export const Button = (props: ButtonProps) => {
  const buttonClasses = ['border', 'border-primary', 'px-8', 'py-4', 'text-lg', 'uppercase', 't-alt-sans', 'inline-block']

  return (
    <Link href={props.href}>
      <a className={buttonClasses.join(' ')}>{props.children}</a>
    </Link>
  )
};