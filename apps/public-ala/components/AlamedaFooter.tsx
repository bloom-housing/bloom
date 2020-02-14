import * as React from "react"
import Link from "next/link"

const AlamedaFooter = () => (
  <footer className="site-footer">
    <div>
      <img src="/images/Alameda-County-seal.png" alt="Alameda County" />
    </div>
    <div className="footer-credits">
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

      <p className="mt-10 text-sm">
        For additional Bay Area opportunities, please visit:
        <br />
        <a href="https://housing.sfgov.org" target="_blank">
          San Francisco Housing Portal
        </a>
      </p>
    </div>

    <section className="footer-sock">
      <div className="footer-sock-inner">
        <p className="footer-copyright">Alameda County © 2020 • All Rights Reserved</p>

        <nav className="footer-nav">
          <a href="#">Give Feedback</a>
          <a href="#">Contact</a>
          <Link href="/disclaimer">
            <a>Disclaimer</a>
          </Link>
          <Link href="/privacy">
            <a>Privacy Policy</a>
          </Link>
        </nav>
      </div>
    </section>

    <section className="footer-sole">
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
