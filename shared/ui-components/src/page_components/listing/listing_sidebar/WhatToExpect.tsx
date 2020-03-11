import * as React from "react"

const WhatToExpect = () => {
  return (
    <section className="border-b border-gray-400 py-3 my-2 md:py-5 md:my-0 md:px-5 mx-5 md:mx-0">
      <h4 className="text-caps-underline">What to Expect</h4>

      <p className="text-tiny text-gray-800">
        Applicants will be contacted by the property agent in waitlist order until vacancies are
        filled.
      </p>

      <details className="disclosure">
        <summary>read more</summary>

        <p className="text-tiny text-gray-800">
          All of the information that you have provided will be verified and your eligibility
          confirmed. Your application will be removed from the waitlist if you have made any
          fraudulent statements, or if any household member appears on more than one application for
          this listing. If we cannot verify a housing preference that you have claimed, you will not
          receive the preference but will not be otherwise penalized.
        </p>

        <p className="text-tiny text-gray-800">
          Should your application be chosen from the waitlist, be prepared to fill out a more
          detailed application and provide required supporting documents within 5 business days of
          being contacted.
        </p>
      </details>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
