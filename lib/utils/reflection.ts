import { Reflection, PHASES, ReflectionPhase } from '@/types/reflection.types'

/**
 * Calculate the progress percentage of a reflection
 */
export function calculateProgress(reflection: Reflection): number {
    let completed = 0
    const phases: ReflectionPhase[] = ['description', 'feelings', 'evaluation', 'analysis', 'conclusion', 'action_plan']

    phases.forEach(phase => {
        if (reflection[phase] && reflection[phase]!.trim() !== '') {
            completed++
        }
    })

    return Math.round((completed / phases.length) * 100)
}

/**
 * Get the current phase index (0-5) for a reflection
 * Returns 6 if all phases are complete
 */
export function getCurrentPhaseIndex(reflection: Reflection): number {
    const phases: ReflectionPhase[] = ['description', 'feelings', 'evaluation', 'analysis', 'conclusion', 'action_plan']

    for (let i = 0; i < phases.length; i++) {
        if (!reflection[phases[i]] || reflection[phases[i]]!.trim() === '') {
            return i
        }
    }

    return phases.length // All complete
}

/**
 * Get the current phase info for a reflection
 */
export function getCurrentPhase(reflection: Reflection) {
    const index = getCurrentPhaseIndex(reflection)
    if (index >= PHASES.length) {
        return null // All complete
    }
    return PHASES[index]
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

/**
 * Check if a reflection is complete
 */
export function isReflectionComplete(reflection: Reflection): boolean {
    return getCurrentPhaseIndex(reflection) >= PHASES.length
}
