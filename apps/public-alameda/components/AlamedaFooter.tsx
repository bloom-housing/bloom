import * as React from "react"
import Link from "next/link"

const AlamedaFooter = () => (
  <footer className="site-footer w-full bg-gray-800 text-white text-center pt-12">
    <div className="max-w-5xl m-auto pb-8">
      <p>
        Alameda County Housing Portal is a project of the
        <br />
        <a href="https://www.acgov.org/cda/hcd/" target="_blank">
          Alameda County - Housing and Community Development (HCD) Department
        </a>
      </p>

      <p className="mt-10 text-sm">
        For listing and application questions, please contact the Property Agent displayed on the
        LISTING
      </p>

      <p className="text-sm">
        For general program inquiries, you may call the Alameda County HCD at 510-670-5404.
      </p>

      <p className="text-sm">
        For additional Bay Area opportunities, please visit:
        <br />
        <a href="https://housing.sfgov.org" target="_blank">
          San Francisco Housing Portal
        </a>
      </p>
    </div>

    <section className="bg-gray-950 py-8">
      <p>Alameda County © 2020 • All Rights Reserved</p>

      <nav className="mt-5">
        <Link href="/disclaimer">
          <a className="ml-5 text-white">Disclaimer</a>
        </Link>
        <Link href="/privacy">
          <a className="ml-5 text-white">Privacy Policy</a>
        </Link>
      </nav>
    </section>

    <section className="footer-sole bg-black py-5 text-sm">
      <span>
        made with ❤️ by{" "}
        <a href="http://exygy.com" target="_blank" aria-label="Opens in new window">
          exygy
        </a>
      </span>
    </section>
  </footer>
)

export default AlamedaFooter
