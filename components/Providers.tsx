"use client"

import { SessionProvider } from "next-auth/react"
import LoadingProvider from "./LoadingProvider"
import RouteChangeHandler from "./RouteChangeHandler"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <RouteChangeHandler />
        {children}
      </LoadingProvider>
    </SessionProvider>
  )
}
