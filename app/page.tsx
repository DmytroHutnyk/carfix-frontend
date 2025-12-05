'use client'

import { useEffect, useState } from "react"

export default function Home() {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true)

        const response = await fetch('http://localhost:8080/actuator/health')

        if (!response.ok) {
          throw new Error(`Could not fetch the application health, status: ${response.status}`)
        }

        const responseData = await response.json()
        setData(responseData)
      } catch (err) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error("Unknown error"))
        }
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {isFetching && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {!isFetching && data && (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </>
  )
}

