import Layout from "./application"
import { ApplicationTimeout } from "../src/forms/applications/ApplicationTimeout"
import React from "react"

const FormLayout = (props) => {
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-gray-300">
          <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
            {props.children}
          </div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
