import React from "react"
import Layout from "./application"
import { ApplicationTimeout } from "../components/applications/ApplicationTimeout"
import styles from "./forms.module.scss"

interface FormLayoutProps {
  children?: React.ReactNode
  className?: string
}
const FormLayout = (props: FormLayoutProps) => {
  const classNames = [styles["form-layout"]]
  if (props.className) classNames.push(props.className)
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className={styles["form-layout-container"]}>
          <div className={classNames.join(" ")}>{props.children}</div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
