"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/ui/Header/Header"
import { getNFLSchedule, getNFLOdds, formatOdds } from "@/lib/api"
import { NFL_TEAMS } from "@/lib/constants"
import type { NFLGame } from "@/lib/types"

export default function Matches() {
  const [games, setGames] = useState<NFLGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGames() {
      try {
        const [fetchedGames, nflOdds] = await Promise.all([getNFLSchedule(), getNFLOdds()])
        const formattedOdds = formatOdds(nflOdds)
        const gamesWithOdds = fetchedGames.map((game) => ({
          ...game,
          odds: formattedOdds[game.GameKey] || { homeWin: 0, awayWin: 0 },
        }))
        setGames(gamesWithOdds)
        setLoading(false)
      } catch (err) {
        setError("Failed to load matches. Please try again later.")
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Matches</h1>
          <p>Loading matches...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Matches</h1>
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Matches</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const gameDate = new Date(game.DateTime)
            const homeTeamName = NFL_TEAMS[game.HomeTeam] || game.HomeTeam
            const awayTeamName = NFL_TEAMS[game.AwayTeam] || game.AwayTeam

            return (
              <Link href={`/match/${game.GameKey}`} key={game.GameKey} className="block h-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="text-xl font-semibold mb-2 truncate">
                      {homeTeamName} vs {awayTeamName}
                    </h2>
                    <p className="text-sm">Week {game.Week}</p>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">
                        {gameDate.toLocaleDateString()} at{" "}
                        {gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {game.Channel && <p className="text-gray-600 mb-2">Watch on: {game.Channel}</p>}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-semibold text-blue-600">View Details</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

