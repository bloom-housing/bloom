import React from "react"
import Layout from "../layouts/application"
import Redirect from "../src/auth/Redirect"
import { useRouter } from "next/router"
import { RequestState } from "../src/auth/AuthProvider"

const AuthRedirectPage = () => {
  const router = useRouter()

  const handleLogin = (state: RequestState) => {
    const { redirectPath } = state
    router.push(redirectPath)
  }

  return (
    <Layout>
      <Redirect onLogin={handleLogin} />
    </Layout>
  )
}

export default AuthRedirectPage
