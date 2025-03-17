"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NFL_TEAMS } from "@/lib/constants"
import type { NFLGame } from "@/lib/types"

interface MatchListProps {
  games: NFLGame[]
}

export function MatchList({ games }: MatchListProps) {
  const [selectedBets, setSelectedBets] = useState<Record<string, "home" | "away" | null>>({})

  useEffect(() => {
    try {
      const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")
      const betSelections: Record<string, "home" | "away" | null> = {}

      storedBets.forEach((bet: any) => {
        if (bet.gameId && bet.type) {
          betSelections[bet.gameId] = bet.type
        }
      })

      setSelectedBets(betSelections)
    } catch (error) {
      console.error("Error loading betting slip:", error)
    }
  }, [])

  const handleBetClick = (e: React.MouseEvent, game: NFLGame, team: string, odds: number, type: "home" | "away") => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")

      const existingBetIndex = storedBets.findIndex((bet: any) => bet.gameId === game.GameKey)

      if (selectedBets[game.GameKey] === type) {
        if (existingBetIndex !== -1) {
          storedBets.splice(existingBetIndex, 1)
        }

        setSelectedBets((prev) => ({
          ...prev,
          [game.GameKey]: null,
        }))
      } else {
        const newBet = {
          gameId: game.GameKey,
          team,
          odds,
          type,
          stake: 0,
        }

        if (existingBetIndex !== -1) {
          storedBets[existingBetIndex] = newBet
        } else {
          storedBets.push(newBet)
        }

        setSelectedBets((prev) => ({
          ...prev,
          [game.GameKey]: type,
        }))
      }

      localStorage.setItem("bettingSlip", JSON.stringify(storedBets))

      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error handling bet click:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold">NFL Games</h2>
        </div>
        <div className="divide-y">
          {games.map((game) => {
            const gameDate = new Date(game.DateTime)
            const homeTeamName = NFL_TEAMS[game.HomeTeam] || game.HomeTeam
            const awayTeamName = NFL_TEAMS[game.AwayTeam] || game.AwayTeam
            const selectedBet = selectedBets[game.GameKey]

            return (
              <div key={game.GameKey} className="p-4 hover:bg-gray-50">
                <Link href={`/match/${game.GameKey}`} className="block">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">
                      Week {game.Week} • {gameDate.toLocaleDateString()} at{" "}
                      {gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {game.Channel && <div className="text-sm text-gray-600">{game.Channel}</div>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{homeTeamName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{awayTeamName}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={(e) => handleBetClick(e, game, game.HomeTeam, game.odds.homeWin, "home")}
                    className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
                      selectedBet === "home" ? "bg-[#1e3a8a] text-white" : "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                    }`}
                  >
                    {game.odds.homeWin.toFixed(2)}
                  </button>
                  <button
                    onClick={(e) => handleBetClick(e, game, game.AwayTeam, game.odds.awayWin, "away")}
                    className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
                      selectedBet === "away" ? "bg-[#1e3a8a] text-white" : "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                    }`}
                  >
                    {game.odds.awayWin.toFixed(2)}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

