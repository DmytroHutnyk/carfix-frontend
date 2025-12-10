'use client'

import Header from "@/components/header/header";
import { useAuth } from "@/util/authContext/auth-context";
import { OrbitProgress } from "react-loading-indicators";

export default function Home() {
  const { isLoading } = useAuth();

  return (
    <div>
      <Header/>
      {isLoading && (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <OrbitProgress
            color="hsl(var(--primary))"
            size="large"
            text=""
            textColor=""
          />
        </div>
      )}
    </div>
  )
}

