import { useState } from "react"

export type UseMutateOptions = {
  onSuccess?: () => void
  onError?: (err: any) => void
}

const useMutate = <UseMutateResponse>() => {
  const [data, setData] = useState<UseMutateResponse | undefined>(undefined)
  const [isSuccess, setSuccess] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState<unknown>(null)

  const mutate = async (
    mutateFn: (args?: unknown) => Promise<UseMutateResponse>,
    options?: UseMutateOptions
  ) => {
    let response: UseMutateResponse | undefined = undefined

    try {
      setLoading(true)
      response = await mutateFn()
      setData(response)
      setSuccess(true)
      options?.onSuccess?.()
      setLoading(false)
    } catch (err) {
      setSuccess(false)
      setLoading(false)
      setError(err)
      options?.onError?.(err)
    }

    return response
  }

  const reset = () => {
    setData(undefined)
    setSuccess(false)
    setLoading(false)
    setError(null)
  }

  return {
    mutate,
    reset,
    data,
    isSuccess,
    isLoading,
    isError,
  }
}

export { useMutate as default, useMutate }
