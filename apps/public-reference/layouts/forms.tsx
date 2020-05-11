import Layout from "./application"

export default (props) => {
  return (
    <Layout>
      <section style={{ padding: "1px", background: "#f6f6f6" }}>
        <div style={{ maxWidth: "550px", margin: "3rem auto 5rem" }}>{props.children}</div>
      </section>
    </Layout>
  )
}
