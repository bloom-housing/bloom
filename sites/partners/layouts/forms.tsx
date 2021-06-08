import Layout from "."

export default (props) => {
  return (
    <Layout>
      <section className="p-px bg-gray-300">
        <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
          {props.children}
        </div>
      </section>
    </Layout>
  )
}
