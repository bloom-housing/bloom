import { Button, MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import PageContent from "../../page_content/new_application.mdx"
import { useForm } from "react-hook-form"

export default () => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const onSubmit = data => {
    alert("Form submitted!")
    console.log(data)
  }
  const pageTitle = <>Submit an Application</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>

      <article className="flex-row flex-wrap max-w-5xl m-auto mb-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label className="label" htmlFor="firstname">
              First Name
            </label>
            <div className="control">
              <input className="input" type="text" id="firstname" name="firstname" ref={register} />
            </div>
          </div>
          {/* register an input */}
          <div className="field">
            <label className="label" htmlFor="lastname">
              Last Name
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="lastname"
                name="lastname"
                ref={register({ required: true })}
              />
            </div>
          </div>
          {errors.lastname && "Last name is required."}
          <div className="field">
            <label className="label" htmlFor="age">
              Age
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="age"
                name="age"
                ref={register({ pattern: /\d+/ })}
              />
            </div>
          </div>
          {errors.age && "Please enter number for age."}
          <div className="field">
            <input type="checkbox" id="remember" name="remember" ref={register} />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Button>Save Form</Button>
        </form>
      </article>
    </Layout>
  )
}
