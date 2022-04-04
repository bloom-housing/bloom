import Layout from "."

type FormsProps = {
  children: React.ReactNode
  wide?: boolean
}

const Forms = (props: FormsProps) => {
  const innerClasses = []

  if (props.wide) {
    innerClasses.push("max-w-5xl")
  } else {
    innerClasses.push("max-w-lg")
  }

  return (
    <Layout>
      <section className="p-px bg-gray-300">
        <div
          className={`md:mb-20 md:mt-12 mx-auto print:my-0 print:max-w-full ${innerClasses.join(
            " "
          )}`}
        >
          {props.children}
        </div>
      </section>
    </Layout>
  )
}

export default Forms
