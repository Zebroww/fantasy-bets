import Link from "next/link"
import type { NFLGame } from "@/lib/types"

const NFL_TEAMS: { [key: string]: string } = {
  ARI: "Arizona Cardinals",
  ATL: "Atlanta Falcons",
  BAL: "Baltimore Ravens",
  BUF: "Buffalo Bills",
  CAR: "Carolina Panthers",
  CHI: "Chicago Bears",
  CIN: "Cincinnati Bengals",
  CLE: "Cleveland Browns",
  DAL: "Dallas Cowboys",
  DEN: "Denver Broncos",
  DET: "Detroit Lions",
  GB: "Green Bay Packers",
  HOU: "Houston Texans",
  IND: "Indianapolis Colts",
  JAX: "Jacksonville Jaguars",
  KC: "Kansas City Chiefs",
  LV: "Las Vegas Raiders",
  LAC: "Los Angeles Chargers",
  LAR: "Los Angeles Rams",
  MIA: "Miami Dolphins",
  MIN: "Minnesota Vikings",
  NE: "New England Patriots",
  NO: "New Orleans Saints",
  NYG: "New York Giants",
  NYJ: "New York Jets",
  PHI: "Philadelphia Eagles",
  PIT: "Pittsburgh Steelers",
  SF: "San Francisco 49ers",
  SEA: "Seattle Seahawks",
  TB: "Tampa Bay Buccaneers",
  TEN: "Tennessee Titans",
  WAS: "Washington Commanders",
}

export function UpcomingMatches({ games }: { games: NFLGame[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => {
        const gameDate = new Date(game.DateTime)
        const homeTeamName = NFL_TEAMS[game.HomeTeam] || game.HomeTeam
        const awayTeamName = NFL_TEAMS[game.AwayTeam] || game.AwayTeam

        return (
          <div key={game.GameKey} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="bg-blue-50 -mx-4 -mt-4 p-4 mb-4">
                <p className="text-sm text-blue-600">Week {game.Week}</p>
                <p className="text-sm text-gray-600">
                  {gameDate.toLocaleDateString()} at{" "}
                  {gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate mr-2">{homeTeamName}</p>
                  <span className="text-green-600 font-bold">{game.odds.homeWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate mr-2">{awayTeamName}</p>
                  <span className="text-green-600 font-bold">{game.odds.awayWin.toFixed(2)}</span>
                </div>
              </div>

              {game.Channel && <p className="text-sm text-gray-600 mt-2">Watch on: {game.Channel}</p>}

              <Link href={`/match/${game.GameKey}`}>
                <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Place Bet
                </button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

