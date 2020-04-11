import { Button, MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import PageContent from "../../page_content/new_application.mdx"
import { useForm } from "react-hook-form"

export default () => {
  const { register, handleSubmit, errors } = useForm() // initialize the hook
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

      <article className="max-w-5xl m-auto mb-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="field">
              <label htmlFor="firstname">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="firstname"
                  name="firstname"
                  ref={register}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="lastname">Last Name</label>
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
          </div>

          <div className="field max-w-xs">
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
            <label htmlFor="stuff">Some Stuff</label>
            <div className="control">
              <select id="stuff" name="stuff" ref={register}>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>

          <div className="field">
            <input type="checkbox" id="remember" name="remember" ref={register} />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div className="field field--inline">
            <input type="radio" id="option1" name="radiotest" value="first" ref={register} />
            <label htmlFor="option1">Radio Button 1</label>
          </div>
          <div className="field field--inline">
            <input type="radio" id="option2" name="radiotest" value="second" ref={register} />
            <label htmlFor="option2">Radio Button 1</label>
          </div>

          <div className="flex max-w-2xl">
            <div className="field">
              <label htmlFor="city">City</label>
              <div className="control">
                <input className="input" type="text" id="city" name="city" ref={register} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="stuff">State</label>
              <div className="control">
                <select id="State" name="State" ref={register}>
                  <option>California</option>
                  <option>North Carolina</option>
                  <option>New Hampshire</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="zip">Zip</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="zip"
                  name="zip"
                  ref={register({ pattern: /\d+/ })}
                />
              </div>
            </div>
            {errors.zip && "Zipcode should be a number"}
          </div>

          <div className="mt-6">
            <Button
              onClick={() => {
                console.info("button has been clicked!")
              }}
            >
              Save Form
            </Button>
          </div>
        </form>
      </article>
    </Layout>
  )
}
