import { useState } from "react"
import { BetSelection } from "@/components/ui/BetSelection/BetSelection"
import { BettingSlip } from "@/components/ui/BettingSlip/BettingSlip"
import type { Bet, BetOption } from "@/lib/betManager"

export default function HomePage() {
  const [bets, setBets] = useState<Bet[]>([])

  const addBet = (newBetOption: BetOption) => {
    const newBet: Bet = {
      ...newBetOption,
      stake: newBetOption.stake ?? 0,
      placedAt: Date.now(),
    }
    setBets((prevBets) => {
      const alreadyExists = prevBets.some((bet) => bet.gameId === newBet.gameId)
      if (!alreadyExists) {
        const updatedBets = [...prevBets, newBet]
        localStorage.setItem("bettingSlip", JSON.stringify(updatedBets))
        return updatedBets
      }
      return prevBets
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">NFL Betting</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <BetSelection 
            gameId="1"
            homeTeam="New England Patriots"
            awayTeam="Buffalo Bills"
            odds={{ homeWin: 1.50, awayWin: 2.50 }}
            addBet={addBet} 
          />
        </div>
        <div>
          <BettingSlip />
        </div>
      </div>
    </div>
  )
}

