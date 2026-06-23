/**
 * Leveling system — tied to current streak length.
 * Each level has a name, threshold (min streak days), and a color scheme.
 */
export interface Level {
  rank: number
  name: string
  title: string
  threshold: number
  color: string       // tailwind color name for the ring/accent
  bgGradient: string  // CSS gradient for the level card
  icon: string        // lucide icon name
}

export const LEVELS: Level[] = [
  { rank: 1, name: 'Scout',        title: 'Eyes open, blade sheathed',    threshold: 0,   color: 'gray',   bgGradient: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)',           icon: 'lucide:eye' },
  { rank: 2, name: 'Grunt',        title: 'Blood and thunder',            threshold: 3,   color: 'amber',  bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #b45309 100%)',           icon: 'lucide:sword' },
  { rank: 3, name: 'Sergeant',     title: 'Leading the charge',           threshold: 7,   color: 'orange', bgGradient: 'linear-gradient(135deg, #fed7aa 0%, #ea580c 100%)',           icon: 'lucide:shield' },
  { rank: 4, name: 'Champion',     title: 'Honor above all',              threshold: 14,  color: 'red',    bgGradient: 'linear-gradient(135deg, #fecaca 0%, #dc2626 100%)',           icon: 'lucide:flame' },
  { rank: 5, name: 'Warlord',      title: 'Fear and respect',             threshold: 30,  color: 'purple', bgGradient: 'linear-gradient(135deg, #e9d5ff 0%, #7c3aed 100%)',           icon: 'lucide:crown' },
  { rank: 6, name: 'High Warlord', title: 'Supreme commander',            threshold: 60,  color: 'red',    bgGradient: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)',           icon: 'lucide:trophy' },
  { rank: 7, name: 'Overlord',     title: 'Beyond the battlefield',       threshold: 100, color: 'emerald',bgGradient: 'linear-gradient(135deg, #fbbf24 0%, #92400e 100%)',           icon: 'lucide:skull' },
]

export function getLevelForStreak(streak: number): Level {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (streak >= level.threshold) current = level
    else break
  }
  return current
}

export function getNextLevel(streak: number): Level | null {
  for (const level of LEVELS) {
    if (level.threshold > streak) return level
  }
  return null
}

export function getLevelProgress(streak: number): { current: Level; next: Level | null; progress: number; daysToNext: number } {
  const current = getLevelForStreak(streak)
  const next = getNextLevel(streak)
  if (!next) return { current, next: null, progress: 100, daysToNext: 0 }
  const range = next.threshold - current.threshold
  const done = streak - current.threshold
  return { current, next, progress: Math.round((done / range) * 100), daysToNext: next.threshold - streak }
}
