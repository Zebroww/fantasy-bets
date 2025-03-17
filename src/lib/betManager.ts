export interface Bet {
    gameId: string
    team: string
    odds: number
    type: "home" | "away"
    stake: number
    placedAt: number
  }
  
  export interface BetOption {
    gameId: string
    team: string
    odds: number
    type: "home" | "away"
    stake?: number
  }
  
  
  export function saveBets(bets: Bet[]) {
    localStorage.setItem("nflBets", JSON.stringify(bets))
  }
  
  export function loadBets(): Bet[] {
    const betsJson = localStorage.getItem("nflBets")
    return betsJson ? JSON.parse(betsJson) : []
  }
  
  export function addBet(bet: Bet) {
    const bets = loadBets()
    const existingBetIndex = bets.findIndex((b) => b.gameId === bet.gameId)
    if (existingBetIndex !== -1) {
      bets[existingBetIndex] = bet
    } else {
      bets.push(bet)
    }
    saveBets(bets)
  }
  
  export function removeBet(gameId: string) {
    const bets = loadBets()
    const updatedBets = bets.filter((bet) => bet.gameId !== gameId)
    saveBets(updatedBets)
  }
  
  export function addBetStake(gameId: string, additionalStake: number) {
    const bets = loadBets()
    const betIndex = bets.findIndex((bet) => bet.gameId === gameId)
    if (betIndex !== -1) {
      bets[betIndex].stake += additionalStake
      saveBets(bets)
    }
  }
  
  export function placeBets(betsToPlace: Bet[]) {
    const existingBets = loadBets()
    const newBets = betsToPlace.map((bet) => ({
      ...bet,
      placedAt: Date.now(),
    }))
    const updatedBets = [...existingBets, ...newBets]
    saveBets(updatedBets)
    return updatedBets
  }
  
  