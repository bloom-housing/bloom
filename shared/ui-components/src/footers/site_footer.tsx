import * as React from 'react'
import Link from "next/link"

const SiteFooter = () => (
  <footer className="w-full bg-gray-700 text-white h-64 text-center pt-4">
    <div className="max-w-5xl m-auto">
      <nav className="mb-5">
        <Link href="/disclaimer"><a className="ml-5 text-white">Disclaimer</a></Link>
        <Link href="/privacy"><a className="ml-5 text-white">Privacy Policy</a></Link>
      </nav>

      This is a blank footer component, waiting to be implemented.
    </div>
  </footer>
)

export default SiteFooter
