import { useState } from "react"

const useMutate = () => {
  const [data, setData] = useState<unknown>()
  const [isSuccess, setSuccess] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(null)

  const mutate = async (mutateFn: (args?: unknown) => unknown) => {
    try {
      setLoading(true)
      const response = await mutateFn()
      setData(response)
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setSuccess(false)
      setLoading(false)
      setError(err)
      console.error(err)
    }
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
