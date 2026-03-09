import Head from "next/head"
import Layout from "."
import styles from "./forms.module.scss"

type FormsProps = {
  children: React.ReactNode
  title: string
}

const FormsLayout = (props: FormsProps) => (
  <Layout>
    <Head>
      <title>{props.title}</title>
    </Head>
    <section className={styles["forms-layout"]}>
      <div className={styles["content"]}>{props.children}</div>
    </section>
  </Layout>
)
export default FormsLayout
