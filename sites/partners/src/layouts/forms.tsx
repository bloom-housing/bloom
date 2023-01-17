import Layout from "."

type FormsProps = {
  children: React.ReactNode
}

const Forms = (props: FormsProps) => (
  <Layout>
    <section className="p-px bg-gray-300">
      <div className="md:mb-20 md:mt-12 mx-auto print:my-0 print:max-w-full max-w-lg">
        {props.children}
      </div>
    </section>
  </Layout>
)
export default Forms
