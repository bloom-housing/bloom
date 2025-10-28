import Head from "next/head"
import Layout from "."

type FormsProps = {
  children: React.ReactNode
  title: string
}

const Forms = (props: FormsProps) => (
  <Layout>
    <Head>
      <title>{props.title}</title>
    </Head>
    <section className="p-px bg-gray-300">
      <div className="md:mb-20 md:mt-12 mx-auto print:my-0 print:max-w-full max-w-lg">
        {props.children}
      </div>
    </section>
  </Layout>
)
export default Forms
