"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCurrentUser, signOut } from "@/lib/auth"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const handleStorageChange = () => {
      const updatedUser = getCurrentUser()
      setUser(updatedUser)
    }

    window.addEventListener("storage", handleStorageChange)

    const handleBalanceUpdate = () => {
      const updatedUser = getCurrentUser()
      setUser(updatedUser)
    }

    window.addEventListener("balanceUpdated", handleBalanceUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("balanceUpdated", handleBalanceUpdate)
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    setUser(null)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-[#1e3a8a] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              NFL Bets
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:bg-[#2c4f9e] px-3 py-2 rounded">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:bg-[#2c4f9e] px-3 py-2 rounded">
                    Bets
                  </Link>
                </li>
                <li>
                  <Link href="/my-bets" className="hover:bg-[#2c4f9e] px-3 py-2 rounded">
                    My Bets
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center bg-[#2c4f9e] rounded px-3 py-1">
                  <span className="mr-1">Balance:</span>
                  <span className="font-semibold">${user.balance.toFixed(2)}</span>
                  <Link
                    href="/add-balance"
                    className="ml-2 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded"
                  >
                    + Add
                  </Link>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 hover:bg-[#2c4f9e] px-3 py-2 rounded"
                  >
                    <span>{user.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/add-balance"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add Balance
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hover:bg-[#2c4f9e] px-3 py-2 rounded">
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-white text-[#1e3a8a] px-4 py-1 rounded font-medium hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

