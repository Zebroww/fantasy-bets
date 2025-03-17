"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/Header/Header"
import { type Bet, loadBets, removeBet } from "@/lib/betManager"
import { NFL_TEAMS } from "@/lib/constants"

export default function MyBets() {
  const [bets, setBets] = useState<Bet[]>([])

  useEffect(() => {
    setBets(loadBets())
  }, [])

  const handleRemoveBet = (gameId: string) => {
    removeBet(gameId)
    setBets(loadBets())
  }

  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0)
  const totalPotentialWinnings = bets.reduce((sum, bet) => sum + bet.stake * bet.odds, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Bets</h1>
        {bets.length === 0 ? (
          <p className="text-gray-500">You haven't placed any bets yet.</p>
        ) : (
          <div className="space-y-6">
            {bets.map((bet) => (
              <div key={`${bet.gameId}-${bet.placedAt}`} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{bet.team}</h2>
                  <button onClick={() => handleRemoveBet(bet.gameId)} className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
                <p className="text-gray-600 mb-2">
                  {bet.type === "home" ? "Home" : "Away"} team: {NFL_TEAMS[bet.team] || bet.team}
                </p>
                <p className="text-gray-600 mb-2">Odds: {bet.odds.toFixed(2)}</p>
                <p className="text-gray-600 mb-2">Stake: ${bet.stake.toFixed(2)}</p>
                <p className="mt-2 font-semibold">Potential Winnings: ${(bet.stake * bet.odds).toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-2">Placed on: {new Date(bet.placedAt).toLocaleString()}</p>
              </div>
            ))}
            <div className="bg-white shadow-md rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <p className="text-lg">Total Stake: ${totalStake.toFixed(2)}</p>
              <p className="text-lg">Total Potential Winnings: ${totalPotentialWinnings.toFixed(2)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

