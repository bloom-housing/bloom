import Layout from "../layouts/application"
import { PageHeader } from "@bloom-housing/ui-components"
import "./AdditionalResources.scss"

const Card = (props) => {
  return (
    <div className="info-card">
      <h4 className="info-card__title">
        <a href={props.link} target="_blank">
          {props.title}
        </a>
      </h4>
      {props.children}
    </div>
  )
}

export default () => {
  const pageTitle = <>Additional Housing Opportunities</>

  return (
    <Layout>
      <PageHeader
        inverse={true}
        subtitle="We encourage you to browse other affordable housing resources."
      >
        {pageTitle}
      </PageHeader>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <div className="content">
              <section>
                <h2 className="primary">Rentals</h2>
                <h3>Lists developed each month by community nonprofit agencies.</h3>
                <ul className="flex-none md:flex">
                  <li className="flex-1">
                    <Card
                      title="SMCHousingSearch"
                      link="http://www.socialserve.com/dbh/ViewUnit/663044?ch=SMC&hm=kt9oO6pN"
                    >
                      <p>Rental and Shared Housing Opportunities</p>
                      <p>San Mateo County</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card title="Haven Connect" link="https://apply.havenconnect.com/">
                      <p>Affordable Housing</p>
                      <p>San Mateo County, Bay Area, and Beyond</p>
                    </Card>
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="primary">Shared Housing</h2>
                <h3>Home Sharing is a living arrangement among two or more unrelated people.</h3>
                <ul className="flex-none md:flex">
                  <li className="flex-1 md:w-1/2 md:flex-none">
                    <Card
                      title="HIP Housing"
                      link="https://hiphousing.org/programs/home-sharing-program/"
                    >
                      <p>Shared Housing Opportunities</p>
                      <p>San Mateo County</p>
                    </Card>
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="primary">Other Resources</h2>
                <h3>Tenant Resources, Crisis and Health Services, and Legal Assistance</h3>
                <h3>Support with rent payments.</h3>
                <ul className="flex-none md:flex">
                  <li className="flex-1">
                    <Card
                      title="Housing Authority of the County of San Mateo"
                      link="https://www.smchousingwaitlist.org/landing"
                    >
                      <p>Housing Choice Vouchers/ Section 8 program</p>
                      <p>San Mateo County</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card
                      title="Community Infomation Handbook"
                      link="https://hsa.smcgov.org/sites/hsa.smcgov.org/files/documents/files/CIH2019_English_020719.pdf"
                    >
                      <p>Community Services</p>
                      <p>San Mateo County</p>
                    </Card>
                  </li>
                </ul>
                <ul className="flex-none md:flex">
                  <li className="flex-1">
                    <Card
                      title="211 United Way Bay Area"
                      link="https://www.211bayarea.org/sanmateo/"
                    >
                      <p>Health and Human Services Information, including crisis services</p>
                      <p>San Mateo County and Bay Area</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card title="Project Sentinel" link="https://www.housing.org/tenants">
                      <p>Services for tenants experiencing housing discrimination</p>
                      <p>San Mateo County and Bay Area</p>
                    </Card>
                  </li>
                </ul>
              </section>
            </div>
          </div>
          <aside className="sidebar">
            <div>
              <h2 className="primary">Contact</h2>
              <h3>San Mateo County's Department of Housing</h3>
              <a href="mailto:housing@smchousing.org">housing@smchousing.org</a>
              <h3 className="mt-2">Foster City Community Development</h3>
              <a href="mailto:planning@fostercity.org">planning@fostercity.org</a>
              <p className="mt-2">
                For general program inquiries in Foster City, you may call 650-286-3227
              </p>
              <p className="mt-2">
                For listing and application questions, please contact the Property Agent displayed
                on the listing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  )
}
