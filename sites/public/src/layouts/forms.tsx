import React from "react"
import Layout from "./application"
import { ApplicationTimeout } from "../components/applications/ApplicationTimeout"

interface FormLayoutProps {
  children?: React.ReactNode
}
const FormLayout = (props: FormLayoutProps) => {
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="md:mb-20 md:mt-12 mx-auto sm:max-w-lg max-w-full print:my-0 print:max-w-full">
            {props.children}
          </div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
