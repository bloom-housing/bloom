import * as React from "react"
import Address from "./address";

class Apply extends React.Component<any> {

  constructor(props: any) {
    super(props)
    this.state = {show_download: false}

    this.toogleDownload = this.toogleDownload.bind(this)
  }

  toogleDownload() {
    this.setState({show_download: !this.state['show_download']})
  }

  applicationPickupSection() {
    const listing = this.props.listing
    if (!listing.blank_paper_application_can_be_picked_up) return ''

    const leasing_agent_address = {
      street_address: listing.leasing_agent_street,
      city: listing.leasing_agent_city,
      state: listing.leasing_agent_state,
      zip_code: listing.leasing_agent_zip
    }
    
    return (
      <>
        <div className="m-6"></div>
        <div className="-mx-5 border-t border-gray-400 text-center">
          <span className="bg-white relative -top px-1 uppercase text-blue-700 font-semibold">or</span>
        </div>
        <h3 className="mb-4 text-gray-600 uppercase t-sans font-bold text-sm">Pick up an application</h3>
        <Address address={leasing_agent_address} office_hours={listing.leasing_agent_office_hours} />
      </>
    )
  }

  downloadOptions () {
    if (!this.state['show_download']) return ''

    const listing = this.props.listing
    return (
      <>
        <p className="text-center mt-2 mb-4 text-sm">
          <a href={listing.application_download_url} title="Download Application" target="_blank">English</a>       
        </p>
      </>
    )
  }

  dropOffOrSend () {
    const listing = this.props.listing
    let body
    let header
  //   / Section 2a: Send by Mail
  // .content-group.bg-snow ng-if="::$ctrl.parent.listing.accepting_applications_by_po_box" ng-class="{'has-divider': $ctrl.parent.listing.accepting_applications_at_leasing_agent}"
  //   h3.content-group_title
  //     | {{'LISTINGS.APPLY.SEND_BY_US_MAIL' | translate}}
  //   p.content-group_address.no-margin
  //     | {{ ::$ctrl.parent.listing.application_organization}}
  //   p.content-group_address
  //     | {{ ::$ctrl.parent.listing.application_street_address }}
  //     br
  //     | {{ ::$ctrl.parent.listing.application_city }} {{ ::$ctrl.parent.listing.application_state }} {{ ::$ctrl.parent.listing.application_postal_code }}
  //   p.c-charcoal.t-small
  //     | {{'LISTINGS.APPLY.APPLICATIONS_MUST_BE_RECEIVED_BY_DEADLINE' | translate}}

  //   .option-divider ng-if="::$ctrl.parent.listing.accepting_applications_at_leasing_agent"
  //     span.or.bg-snow
  //       | {{'T.OR' | translate}}

  // / Section 2b: Drop Off
  // .content-group.bg-snow ng-if="::$ctrl.parent.listing.accepting_applications_at_leasing_agent"
  //   h3.content-group_title ng-if="::$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.DROP_OFF_APPLICATION' | translate}}
  //   h3.content-group_title ng-if="::!$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.DROP_OFF_APPLICATION_OR_MAIL' | translate}}
  //   ng-include src="'listings/templates/listing/_panel-apply-leasing-agent.html'"
  //   p.c-charcoal.t-small ng-if="::!$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.APPLICATIONS_MUST_BE_RECEIVED_BY_DEADLINE' | translate}}

    if (listing.accepting_applications_at_leasing_agent) {
      // h3.content-group_title ng-if="::$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.DROP_OFF_APPLICATION' | translate}}
  //   h3.content-group_title ng-if="::!$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.DROP_OFF_APPLICATION_OR_MAIL' | translate}}
  //   ng-include src="'listings/templates/listing/_panel-apply-leasing-agent.html'"
  //   p.c-charcoal.t-small ng-if="::!$ctrl.parent.listing.accepting_applications_by_po_box"
  //     | {{'LISTINGS.APPLY.APPLICATIONS_MUST_BE_RECEIVED_BY_DEADLINE' | translate}}
    }
    if (!listing.accepting_applications_by_po_box) {
      const address = {
        street_address: listing.application_street_address,
        city: listing.application_city,
        state: listing.application_state,
        zip_code: listing.application_postal_code
      }
      header = 'Send Application by US Mail'
      

      body = (
        <>
          <div className="-mx-5 border-t border-gray-400 text-center my-4"></div>
          <h3 className="text-gray-600 uppercase t-sans font-bold text-sm mb-4">Send Application by US Mail</h3>
          <p className="text-gray-700">{ listing.application_organization }</p>
          <Address address={address} />
          <p className="mt-4 text-sm text-gray-600">Applications must be received by the deadline and postmarks will not be considered.</p>

  {/* //   .option-divider ng-if="::$ctrl.parent.listing.accepting_applications_at_leasing_agent"
  //     span.or.bg-snow
  //       | {{'T.OR' | translate}} */}
        </>
      )
    }
    return body
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
          <button className="btn btn-blue w-full mb-2" onClick={this.toogleDownload}>Download application</button>
          { this.downloadOptions() }
          { this.applicationPickupSection() }
        </section>
        <section className="border border-gray-400 border-b-0 p-5 bg-gray-100">
          <div className="t-serif text-xl">
            <span className="text-blue-600 pr-1 mb-4">2</span>
            Submit a Paper Application
          </div>
          { this.dropOffOrSend() }
        </section>
      </>
    )
  }
}

export default Apply