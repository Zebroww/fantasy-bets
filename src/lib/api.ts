export interface BettingOdds {
  homeWin: number
  awayWin: number
  draw?: number
}

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
}

export async function getNFLSchedule(): Promise<NFLGame[]> {
  return [
    {
      GameKey: "1",
      SeasonType: 1,
      Season: 2024,
      Week: 1,
      Date: "2024-09-08T13:00:00",
      AwayTeam: "BUF",
      HomeTeam: "NE",
      Channel: "CBS",
      StadiumID: 1,
      Status: "Scheduled",
      DateTime: "2024-09-08T13:00:00",
    },
    {
      GameKey: "2",
      SeasonType: 1,
      Season: 2024,
      Week: 1,
      Date: "2024-09-08T16:00:00",
      AwayTeam: "MIA",
      HomeTeam: "LAC",
      Channel: "CBS",
      StadiumID: 2,
      Status: "Scheduled",
      DateTime: "2024-09-08T16:00:00",
    },
  ]
}

export async function getNFLOdds(): Promise<any[]> {
  return [
    {
      GameKey: "1",
      HomeTeam: "NE",
      AwayTeam: "BUF",
      HomeWinOdds: 1.5,
      AwayWinOdds: 2.5,
    },
    {
      GameKey: "2",
      HomeTeam: "LAC",
      AwayTeam: "MIA",
      HomeWinOdds: 1.8,
      AwayWinOdds: 2.0,
    },
  ]
}

export function formatOdds(odds: any[]): Record<string, BettingOdds> {
  const formattedOdds: Record<string, BettingOdds> = {}

  odds.forEach((gameOdds) => {
    formattedOdds[gameOdds.GameKey] = {
      homeWin: gameOdds.HomeWinOdds,
      awayWin: gameOdds.AwayWinOdds,
    }
  })

  return formattedOdds
}

