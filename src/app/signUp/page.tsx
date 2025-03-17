"use client"

import { useState } from "react"
import { Header } from "@/components/ui/Header/Header"
import { AuthForm } from "@/components/ui/AuthForm/AuthForm"
import { signUp } from "@/lib/auth"

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (data: any) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
          <AuthForm type="sign-up" onSubmit={handleSignUp} />
        </div>
      </main>
    </div>
  )
}

