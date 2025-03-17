/**
 * @file elo.ts
 * 
 * Zawiera logikę związaną z algorytmem Elo:
 * - interfejs Team (opcjonalnie),
 * - funkcje do obliczania oczekiwanego wyniku,
 * - funkcję do aktualizacji ratingów drużyn po meczu.
 */

// Opcjonalnie, jeśli chcesz przechowywać więcej danych o drużynie
export interface Team {
  name: string
  rating: number
  wins: number
  losses: number
  draws: number
}

// Współczynnik K określa szybkość zmian ratingów
export const K = 20

/**
 * Oblicza oczekiwany wynik (expected score) dla drużyny A
 * w starciu z drużyną B.
 * 
 * @param ratingA - Rating drużyny A
 * @param ratingB - Rating drużyny B
 * @returns Oczekiwane prawdopodobieństwo wygranej drużyny A
 */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

/**
 * Aktualizuje ratingi dwóch drużyn po rozegranym meczu,
 * na podstawie zdobytych punktów (scoreA, scoreB).
 * 
 * @param teamA - Obiekt drużyny A (z ratingiem)
 * @param teamB - Obiekt drużyny B (z ratingiem)
 * @param scoreA - Punkty drużyny A (np. liczba zdobytych punktów w meczu)
 * @param scoreB - Punkty drużyny B
 */
export function updateRatings(teamA: Team, teamB: Team, scoreA: number, scoreB: number): void {
  // Zamieniamy wynik punktowy na 1/0/0.5 (wygrana/przegrana/remis)
  const actualA = scoreA > scoreB ? 1 : scoreA < scoreB ? 0 : 0.5
  const actualB = 1 - actualA

  // Oczekiwany wynik (prob. zwycięstwa) dla drużyny A i B
  const expA = expectedScore(teamA.rating, teamB.rating)
  const expB = 1 - expA // albo expectedScore(teamB.rating, teamA.rating)

  // Aktualizacja ratingów
  teamA.rating = teamA.rating + K * (actualA - expA)
  teamB.rating = teamB.rating + K * (actualB - expB)

  // Aktualizacja statystyk (opcjonalnie)
  if (actualA === 1) {
    teamA.wins++
    teamB.losses++
  } else if (actualA === 0) {
    teamB.wins++
    teamA.losses++
  } else {
    teamA.draws++
    teamB.draws++
  }
}
