import * as React from "react"
import Address from "./address"
class Apply extends React.Component<any> {
  constructor(props: any) {
    super(props)
    this.state = { showDownload: false }
    this.toggleDownload = this.toggleDownload.bind(this)
  }

  toggleDownload() {
    this.setState({ showDownload: !this.state["showDownload"] })
  }

  applicationPickupSection() {
    const listing = this.props.listing
    if (!listing.blank_paper_application_can_be_picked_up) return ""

    const leasingAgentAddress = {
      streetAddress: listing.leasing_agent_street,
      city: listing.leasing_agent_city,
      state: listing.leasing_agent_state,
      zipCode: listing.leasing_agent_zip
    }
    return (
      <>
        <div className="m-6"></div>
        <div className="-mx-5 border-t border-gray-400 text-center">
          <span className="bg-white relative -top px-1 uppercase text-blue-700 font-semibold">
            or
          </span>
        </div>
        <h3 className="mb-4 text-gray-600 uppercase t-sans font-bold text-sm">
          Pick up an application
        </h3>
        <Address address={leasingAgentAddress} officeHours={listing.leasing_agent_office_hours} />
      </>
    )
  }

  downloadOptions() {
    if (!this.state["showDownload"]) return ""

    const listing = this.props.listing
    return (
      <>
        <p className="text-center mt-2 mb-4 text-sm">
          <a href={listing.application_download_url} title="Download Application" target="_blank">
            English
          </a>
        </p>
      </>
    )
  }

  dropOffOrSend() {
    const listing = this.props.listing
    const body = []
    let header

    if (listing.accepting_applications_by_po_box) {
      const address = {
        streetAddress: listing.application_street_address,
        city: listing.application_city,
        state: listing.application_state,
        zipCode: listing.application_postal_code
      }
      header = "Send Application by US Mail"
      body.push(
        <>
          <p className="text-gray-700">{listing.application_organization}</p>
          <Address address={address} />
          <p className="mt-4 text-sm text-gray-600">
            Applications must be received by the deadline and postmarks will not be considered.
          </p>
        </>
      )
      if (listing.accepting_applications_at_leasing_agent) {
        body.push(
          <>
            <div className="-mx-5 border-t border-gray-400 text-center">
              <span className="bg-white relative -top px-1 uppercase text-blue-700 font-semibold">
                or
              </span>
            </div>
          </>
        )
      }
    } else {
      if (listing.accepting_applications_at_leasing_agent) {
        const leasingAgentAddress = {
          streetAddress: listing.leasing_agent_street,
          city: listing.leasing_agent_city,
          state: listing.leasing_agent_state,
          zipCode: listing.leasing_agent_zip
        }
        body.push(
          <>
            <Address
              address={leasingAgentAddress}
              officeHours={listing.leasing_agent_office_hours}
            />
          </>
        )
        if (listing.accepting_applications_by_po_box) {
          header = "Drop Off Application"
        } else {
          header = "Drop Off Application or Send by US Mail"
          body.push(
            <>
              <p className="text-sm text-gray-700 mt-2">
                Applications must be received by the deadline and postmarks will not be considered.
              </p>
            </>
          )
        }
      }
    }
    header = (
      <>
        <div className="-mx-5 border-t border-gray-400 text-center my-4"></div>
        <h3 className="text-gray-600 uppercase t-sans font-bold text-sm mb-4">{header}</h3>
      </>
    )

    return [header, body]
  }

  render() {
    return (
      <>
        <section className="border border-gray-400 border-b-0 p-5">
          <h2 className="t-alt-sans uppercase mb-5 pb-2 border-0 border-b-4 border-blue-600 font-semibold text-gray-700 tracking-wider inline-block">
            How to apply
          </h2>
          <div className="t-serif text-xl mb-4">
            <span className="text-blue-600 pr-1">1</span>
            Get a Paper Application
          </div>
          <button className="btn btn-blue w-full mb-2" onClick={this.toggleDownload}>
            Download application
          </button>
          {this.downloadOptions()}
          {this.applicationPickupSection()}
        </section>
        <section className="border border-gray-400 border-b-0 p-5 bg-gray-100">
          <div className="t-serif text-xl">
            <span className="text-blue-600 pr-1 mb-4">2</span>
            Submit a Paper Application
          </div>
          {this.dropOffOrSend()}
        </section>
      </>
    )
  }
}

export default Apply
