"use client"

import { useState } from "react"
import { Header } from "@/components/ui/Header/Header"
import { AuthForm } from "@/components/ui/AuthForm/AuthForm"
import { signIn } from "@/lib/auth"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (data: any) => {
    try {
      await signIn({
        email: data.email,
        password: data.password,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sign In to NFL Bets</h1>
          <AuthForm type="sign-in" onSubmit={handleSignIn} />
        </div>
      </main>
    </div>
  )
}

