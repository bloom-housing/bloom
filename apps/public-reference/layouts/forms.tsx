import Layout from "./application"

export default (props) => {
  return (
    <Layout>
      <section style={{ padding: "1px", background: "#f6f6f6" }}>
        <div className="md:mb-20 md:mt-12 mx-auto" style={{ maxWidth: "34rem" }}>
          {props.children}
        </div>
      </section>
    </Layout>
  )
}
