"use client"

import { useEffect, useState, useCallback } from "react"
import type { Bet } from "@/lib/betManager"
import { NFL_TEAMS } from "@/lib/constants"

interface BettingSlipProps {
  bets?: Bet[]
  onRemoveBet?: (gameId: string) => void
  onAddBet?: (gameId: string, stake: number) => void
  onPlaceBets?: (bets: Bet[]) => void
}

export function BettingSlip({ bets: propBets, onRemoveBet, onAddBet, onPlaceBets }: BettingSlipProps) {
  const [localBets, setLocalBets] = useState<Bet[]>([])
  const [newStake, setNewStake] = useState<string>("")

  useEffect(() => {
    if (propBets) {
      setLocalBets(propBets)
    } else {
      const storedBets = localStorage.getItem("bettingSlip")
      if (storedBets) {
        try {
          const parsedBets = JSON.parse(storedBets)
          const validatedBets = parsedBets.map((bet: any) => ({
            ...bet,
            stake: typeof bet.stake === "number" ? bet.stake : 0,
            type: bet.type || "home",
            team: bet.team || (bet.type === "home" ? bet.homeTeam : bet.awayTeam),
          }))
          setLocalBets(validatedBets)
        } catch (error) {
          console.error("Error parsing betting slip:", error)
          setLocalBets([])
        }
      }
    }
  }, [propBets])

  useEffect(() => {
    const handleStorageChange = () => {
      const storedBets = localStorage.getItem("bettingSlip")
      if (storedBets) {
        try {
          const parsedBets = JSON.parse(storedBets)
          const validatedBets = parsedBets.map((bet: any) => ({
            ...bet,
            stake: typeof bet.stake === "number" ? bet.stake : 0,
            type: bet.type || "home",
            team: bet.team || (bet.type === "home" ? bet.homeTeam : bet.awayTeam), 
          }))
          setLocalBets(validatedBets)
        } catch (error) {
          console.error("Error parsing betting slip:", error)
        }
      } else {
        setLocalBets([])
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleUpdateStake = useCallback((gameId: string, stakeValue: string) => {
    const stake = stakeValue === "" ? 0 : Number(stakeValue)

    setLocalBets((prevBets) =>
      prevBets.map((bet) => {
        if (bet.gameId === gameId) {
          return { ...bet, stake }
        }
        return bet
      }),
    )

    const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")
    const updatedBets = storedBets.map((b: any) => (b.gameId === gameId ? { ...b, stake } : b))
    localStorage.setItem("bettingSlip", JSON.stringify(updatedBets))
  }, [])

  useEffect(() => {
    if (!propBets && onAddBet && localBets.length > 0) {
      const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")
      localBets.forEach((bet) => {
        const storedBet = storedBets.find((b: any) => b.gameId === bet.gameId)
        if (storedBet && storedBet.stake !== bet.stake) {
          onAddBet(bet.gameId, bet.stake)
        }
      })
    }
  }, [localBets, onAddBet, propBets])

  const handleRemoveBet = useCallback(
    (gameId: string) => {
      setLocalBets((prevBets) => prevBets.filter((bet) => bet.gameId !== gameId))

      const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")
      const filteredBets = storedBets.filter((bet: any) => bet.gameId !== gameId)
      localStorage.setItem("bettingSlip", JSON.stringify(filteredBets))

      if (onRemoveBet) {
        onRemoveBet(gameId)
      }

      window.dispatchEvent(new Event("storage"))
    },
    [onRemoveBet],
  )

  const distributeStake = useCallback(() => {
    const stakeAmount = Number.parseFloat(newStake)
    if (stakeAmount > 0 && localBets.length > 0) {
      const stakePerBet = stakeAmount / localBets.length
      setLocalBets((prevBets) =>
        prevBets.map((bet) => ({
          ...bet,
          stake: stakePerBet,
        })),
      )

      const storedBets = JSON.parse(localStorage.getItem("bettingSlip") || "[]")
      const updatedStoredBets = storedBets.map((bet: any) => ({
        ...bet,
        stake: stakePerBet,
      }))
      localStorage.setItem("bettingSlip", JSON.stringify(updatedStoredBets))

      setNewStake("")

      window.dispatchEvent(new Event("storage"))
    }
  }, [newStake, localBets.length])

  const totalStake = localBets.reduce((sum, bet) => sum + (bet.stake || 0), 0)
  const totalPotentialWinnings = localBets.reduce((sum, bet) => sum + (bet.stake || 0) * bet.odds, 0)

  const handlePlaceBets = useCallback(() => {
    if (localBets.length > 0 && totalStake > 0) {
      const betsToPlace = localBets.map((bet) => ({
        ...bet,
        placedAt: Date.now(),
      }))

      if (onPlaceBets) {
        onPlaceBets(betsToPlace)
      } else {
        try {
          const existingBets = JSON.parse(localStorage.getItem("nflBets") || "[]")

          const updatedBets = [...existingBets, ...betsToPlace]

          localStorage.setItem("nflBets", JSON.stringify(updatedBets))

          localStorage.setItem("bettingSlip", "[]")
          setLocalBets([])

          alert("Bets placed successfully! Check 'My Bets' to see all your active bets.")
        } catch (error) {
          console.error("Error placing bets:", error)
          alert("Failed to place bets. Please try again.")
        }
      }
    }
  }, [localBets, onPlaceBets, totalStake])

  const getTeamName = (teamCode: string) => {
    return NFL_TEAMS[teamCode] || teamCode
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Betting Slip</h2>
      </div>
      {localBets.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">No bets placed yet.</div>
      ) : (
        <div className="divide-y">
          {localBets.map((bet) => (
            <div key={bet.gameId} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{getTeamName(bet.team)}</div>
                  <div className="text-sm text-gray-600">Odds: {bet.odds.toFixed(2)}</div>
                </div>
                <button onClick={() => handleRemoveBet(bet.gameId)} className="text-red-500 hover:text-red-700">
                  ✕
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Stake:</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bet.stake || ""}
                      onChange={(e) => handleUpdateStake(bet.gameId, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-right appearance-none"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm mb-1">Distribute Stake</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newStake}
                  onChange={(e) => setNewStake(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded appearance-none"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />
                <button
                  onClick={distributeStake}
                  className="bg-[#3b82f6] text-white px-3 py-1 rounded hover:bg-[#2563eb]"
                  disabled={Number.parseFloat(newStake) <= 0 || localBets.length === 0}
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Total Stake:</span>
                <span className="font-semibold">${totalStake.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="font-semibold">${totalPotentialWinnings.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceBets}
              className="w-full bg-[#1e3a8a] text-white py-2 rounded font-medium hover:bg-[#2c4f9e]"
              disabled={totalStake <= 0 || localBets.length === 0}
            >
              Place Bets
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

