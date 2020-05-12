import React, { useContext } from "react"
import { Button, ButtonProps } from "@bloom-housing/ui-components"

import { AuthContext } from "./AuthProvider"

export interface LoginButtonProps {
  redirectPath?: string
  buttonProps?: ButtonProps
}

const LoginButton = ({ redirectPath, buttonProps }: LoginButtonProps) => {
  const { accessToken, login } = useContext(AuthContext)
  if (accessToken) { return null }
  return <Button onClick={() => login(redirectPath)} {...buttonProps}>Sign In</Button>
}

export { LoginButton as default, LoginButton }
