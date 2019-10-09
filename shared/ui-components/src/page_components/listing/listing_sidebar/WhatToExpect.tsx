import * as React from "react"

const WhatToExpect = () => {
  return (
    <>
      <h4 className="font-alt-sans uppercase mb-5 pb-2 border-0 border-b-4 border-blue-600 font-semibold text-gray-700 tracking-wider">
        What to Expect
      </h4>

      <p>
        Applicants will be contacted by the property agent in waitlist order until vacancies are
        filled.
      </p>

      <details className="disclosure">
        <summary>read more</summary>

        <p>
          All of the information that you have provided will be verified and your eligibility
          confirmed. Your application will be removed from the waitlist if you have made any
          fraudulent statements, or if any household member appears on more than one application for
          this listing. If we cannot verify a housing preference that you have claimed, you will not
          receive the preference but will not be otherwise penalized.
        </p>

        <p>
          Should your application be chosen from the waitlist, be prepared to fill out a more
          detailed application and provide required supporting documents within 5 business days of
          being contacted.
        </p>
      </details>
    </>
  )
}

export default WhatToExpect
