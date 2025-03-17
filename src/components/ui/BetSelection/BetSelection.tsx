"use client"

import { useState, useEffect } from "react"

interface BetOption {
  gameId: string
  team: string
  odds: number
  type: "home" | "away"
  stake?: number
}

interface BetSelectionProps {
  gameId: string
  homeTeam: string
  awayTeam: string
  odds: {
    homeWin: number
    awayWin: number
  }
  addBet?: (bet: BetOption) => void
  onSelectBet?: (bet: BetOption | null) => void
}

export function BetSelection({ gameId, homeTeam, awayTeam, odds, addBet, onSelectBet }: BetSelectionProps) {
  const [selectedBet, setSelectedBet] = useState<"home" | "away" | null>(null)

  useEffect(() => {
    const storedBets = localStorage.getItem("bettingSlip")
    if (storedBets) {
      try {
        const bets = JSON.parse(storedBets)
        const existingBet = bets.find((bet: BetOption) => bet.gameId === gameId)
        if (existingBet) {
          setSelectedBet(existingBet.type)
        }
      } catch (error) {
        console.error("Error parsing betting slip:", error)
      }
    }
  }, [gameId])

  const handleBetClick = (team: string, oddsValue: number, type: "home" | "away") => {
    try {
      const existingBets: BetOption[] = JSON.parse(localStorage.getItem("bettingSlip") || "[]")

      if (selectedBet === type) {
        const updatedBets = existingBets.filter((bet) => bet.gameId !== gameId)
        localStorage.setItem("bettingSlip", JSON.stringify(updatedBets))
        setSelectedBet(null)

        if (onSelectBet) {
          onSelectBet(null)
        }

        window.dispatchEvent(new Event("storage"))
      } else {
        const filteredBets = existingBets.filter((bet) => bet.gameId !== gameId)

        const newBet: BetOption = {
          gameId,
          team,
          odds: oddsValue,
          type,
          stake: 0,
        }
        const updatedBets = [...filteredBets, newBet]

        localStorage.setItem("bettingSlip", JSON.stringify(updatedBets))
        setSelectedBet(type)

        if (addBet) {
          addBet(newBet)
        }

        if (onSelectBet) {
          onSelectBet(newBet)
        }

        window.dispatchEvent(new Event("storage"))
      }
    } catch (error) {
      console.error("Error handling bet click:", error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => handleBetClick(homeTeam, odds.homeWin, "home")}
        className={`p-4 rounded-lg transition-colors flex flex-col items-center ${
          selectedBet === "home" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 hover:bg-blue-50"
        }`}
      >
        <span className="text-lg font-semibold mb-2">{homeTeam}</span>
        <span className="text-2xl font-bold">{odds.homeWin.toFixed(2)}</span>
      </button>
      <button
        onClick={() => handleBetClick(awayTeam, odds.awayWin, "away")}
        className={`p-4 rounded-lg transition-colors flex flex-col items-center ${
          selectedBet === "away" ? "bg-blue-500 text-white" : "bg-white border border-gray-200 hover:bg-blue-50"
        }`}
      >
        <span className="text-lg font-semibold mb-2">{awayTeam}</span>
        <span className="text-2xl font-bold">{odds.awayWin.toFixed(2)}</span>
      </button>
    </div>
  )
}

