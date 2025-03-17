"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/ui/Header/Header"
import { BettingSlip } from "@/components/ui/BettingSlip/BettingSlip"
import { BetSelection } from "@/components/ui/BetSelection/BetSelection"
import { getNFLOdds, formatOdds } from "@/lib/api"
import { type Bet, loadBets, placeBets } from "@/lib/betManager"
import { NFL_TEAMS } from "@/lib/constants"

interface BettingOdds {
  homeWin: number
  awayWin: number
}

export default function MatchDetails({ params }: { params: { id: string } }) {
  const [odds, setOdds] = useState<BettingOdds>({ homeWin: 0, awayWin: 0 })
  const [placedBets, setPlacedBets] = useState<Bet[]>([])

  useEffect(() => {
    setPlacedBets(loadBets())
  }, [])

  useEffect(() => {
    async function fetchOdds() {
      const nflOdds = await getNFLOdds()
      const formattedOdds = formatOdds(nflOdds)
      if (formattedOdds[params.id]) {
        setOdds(formattedOdds[params.id])
      }
    }
    fetchOdds()
  }, [params.id])

  const game = {
    GameKey: params.id,
    HomeTeam: "NE",
    AwayTeam: "BUF",
    DateTime: "2025-09-07T13:00:00",
    Week: 1,
    Channel: "CBS",
  }

  const gameDate = new Date(game.DateTime)
  const homeTeamName = NFL_TEAMS[game.HomeTeam] || game.HomeTeam
  const awayTeamName = NFL_TEAMS[game.AwayTeam] || game.AwayTeam

  const handleSelectBet = useCallback((bet: any) => {
    console.log("Bet selected:", bet)
  }, [])

  const handlePlaceBets = useCallback((betsToPlace: Bet[]) => {
    placeBets(betsToPlace)

    localStorage.setItem("bettingSlip", "[]")

    setPlacedBets(loadBets())

    alert("Bets placed successfully! Check 'My Bets' to see all your active bets.")
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Match Details</h1>
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {homeTeamName} vs {awayTeamName}
                </h2>
                <p>Week {game.Week}</p>
                <p>
                  {gameDate.toLocaleDateString()} at{" "}
                  {gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                {game.Channel && <p>Watch on: {game.Channel}</p>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Match Odds</h3>
                <BetSelection
                  gameId={params.id}
                  homeTeam={homeTeamName}
                  awayTeam={awayTeamName}
                  odds={odds}
                  onSelectBet={handleSelectBet}
                />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Match Statistics</h3>
              <p className="text-gray-600">Match statistics and additional information will be displayed here.</p>
            </div>
          </div>
          <BettingSlip onPlaceBets={handlePlaceBets} />
        </div>
      </main>
    </div>
  )
}

