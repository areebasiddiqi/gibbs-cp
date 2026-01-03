import Link from 'next/link'
import { Reflection, PHASES } from '@/types/reflection.types'
import { calculateProgress, getCurrentPhaseIndex, formatDate } from '@/lib/utils/reflection'

interface ReflectionCardProps {
    reflection: Reflection
    index: number
    onDelete?: (id: string) => void
    showAuthor?: boolean
}

export default function ReflectionCard({ reflection, index, onDelete, showAuthor = false }: ReflectionCardProps) {
    const progress = calculateProgress(reflection)
    const currentPhaseIndex = getCurrentPhaseIndex(reflection)
    const isComplete = currentPhaseIndex >= PHASES.length
    const currentPhaseLabel = isComplete
        ? 'Completed'
        : `Phase ${currentPhaseIndex + 1}: ${PHASES[currentPhaseIndex].label}`

    return (
        <div
            className="glass-card reflection-card"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="reflection-card-header">
                <div>
                    <h4 className="reflection-title">{reflection.title}</h4>
                    {showAuthor && reflection.author_name && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 'var(--space-1)' }}>
                            by {reflection.author_name}
                        </p>
                    )}
                </div>
                <span className="reflection-date">{formatDate(reflection.updated_at)}</span>
            </div>

            <div className="reflection-progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{currentPhaseLabel} • {progress}% complete</span>
            </div>

            <div className="reflection-actions">
                <Link
                    href={`/reflection/${reflection.id}`}
                    className={`btn ${isComplete ? 'btn-secondary' : 'btn-primary'}`}
                >
                    {isComplete ? 'Review' : 'Continue'}
                </Link>
                {onDelete && (
                    <button
                        className="btn btn-icon"
                        onClick={() => onDelete(reflection.id)}
                        title="Delete"
                        style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}
