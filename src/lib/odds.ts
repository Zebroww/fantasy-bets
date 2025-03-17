/**
 * @file odds.ts
 * 
 * Zawiera funkcje związane z przeliczaniem kursów (odds) na podstawie
 * prawdopodobieństwa wygranej drużyny A (np. z Elo).
 */

import { expectedScore } from "./elo"

/**
 * Funkcja obliczająca kurs dziesiętny (decimal odds) dla drużyny A
 * na podstawie jej ratingu i ratingu przeciwnika.
 * 
 * @param ratingA - Rating drużyny A
 * @param ratingB - Rating drużyny B
 * @param margin  - Opcjonalna marża bukmacherska (domyślnie 1 = brak marży)
 * @returns Kurs dziesiętny (decimal odds)
 */
export function calculateOdds(ratingA: number, ratingB: number, margin: number = 1): number {
  // Obliczamy prawdopodobieństwo zwycięstwa drużyny A
  const probabilityA = expectedScore(ratingA, ratingB)

  // Inwersja prawdopodobieństwa daje nam kurs "fair"
  // Następnie możemy go skorygować o marżę (np. 1.05, 1.10 itp.)
  const odds = (1 / probabilityA) * margin

  // Zaokrąglamy do dwóch miejsc po przecinku (opcjonalnie)
  return parseFloat(odds.toFixed(2))
}
