import React from "react"
import Layout from "./application"
import { ApplicationTimeout } from "../components/applications/ApplicationTimeout"

interface FormLayoutProps {
  children?: React.ReactNode
  className?: string
}
const FormLayout = (props: FormLayoutProps) => {
  const classNames = [
    "sm:mb-20 sm:mt-12 mx-auto sm:max-w-lg max-w-full print:my-0 print:max-w-full",
  ]
  if (props.className) classNames.push(props.className)
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-gray-300 border-t border-gray-450">
          <div className={classNames.join(" ")}>{props.children}</div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
