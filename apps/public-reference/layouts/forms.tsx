import Layout from "./application"
import { ApplicationTimeout } from "../src/forms/applications/ApplicationTimeout"

const FormLayout = (props) => {
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section style={{ padding: "1px", background: "#f6f6f6" }}>
          <div className="md:mb-20 md:mt-12 mx-auto" style={{ maxWidth: "34rem" }}>
            {props.children}
          </div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
