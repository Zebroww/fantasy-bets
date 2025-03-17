export interface NFLGame {
    GameKey: string
    SeasonType: number
    Season: number
    Week: number
    Date: string
    AwayTeam: string
    HomeTeam: string
    Channel: string
    StadiumID: number
    Status: string
    DateTime: string
    odds: {
      homeWin: number
      awayWin: number
    }
  }
  
  export interface BettingOdds {
    homeWin: number
    awayWin: number
    draw: number
  }
  
  