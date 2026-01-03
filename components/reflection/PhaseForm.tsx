'use client'

import { useState, useEffect } from 'react'
import { PhaseInfo, ReflectionPhase } from '@/types/reflection.types'

interface PhaseFormProps {
    phase: PhaseInfo
    value: string
    onSave: (phaseKey: ReflectionPhase, content: string) => void
    saving: boolean
    onNext: () => void
    onPrevious: () => void
    isFirst: boolean
    isLast: boolean
    readOnly?: boolean
}

export default function PhaseForm({
    phase,
    value,
    onSave,
    saving,
    onNext,
    onPrevious,
    isFirst,
    isLast,
    readOnly = false
}: PhaseFormProps) {
    const [content, setContent] = useState(value)
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setContent(value)
    }, [value, phase.key])

    const handleChange = (newContent: string) => {
        if (readOnly) return

        setContent(newContent)

        // Auto-save after 1 second of inactivity
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout)
        }

        const timeout = setTimeout(() => {
            onSave(phase.key, newContent)
        }, 1000)

        setAutoSaveTimeout(timeout)
    }

    const handleManualSave = () => {
        if (readOnly) return
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout)
        }
        onSave(phase.key, content)
    }

    const handleNextClick = () => {
        if (!readOnly) handleManualSave()
        setTimeout(onNext, 300)
    }

    const handlePreviousClick = () => {
        if (!readOnly) handleManualSave()
        setTimeout(onPrevious, 300)
    }

    return (
        <div className="phase-content">
            <div className="phase-header">
                <span className={`phase-tag ${phase.key.replace('_', '')}`}>
                    Phase {phase.number}
                </span>
                <h2>{phase.label}</h2>
                <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                    {phase.prompt}
                </p>
            </div>

            <div className="form-group">
                <textarea
                    className="form-textarea"
                    placeholder={readOnly ? "No content provided for this phase." : phase.placeholder}
                    value={content}
                    onChange={(e) => handleChange(e.target.value)}
                    style={{ minHeight: '300px' }}
                    disabled={readOnly}
                />
                {!readOnly && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'var(--space-2)',
                        fontSize: '0.875rem',
                        color: 'var(--gray-500)'
                    }}>
                        <span>{saving ? 'Saving...' : 'Auto-saved'}</span>
                        <span>{content.length} characters</span>
                    </div>
                )}
            </div>

            <div className="phase-navigation">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePreviousClick}
                    disabled={isFirst}
                    style={{ visibility: isFirst ? 'hidden' : 'visible' }}
                >
                    ← Previous Phase
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextClick}
                    disabled={isLast}
                    style={{ visibility: isLast ? 'hidden' : 'visible' }}
                >
                    Next Phase →
                </button>
            </div>
        </div>
    )
}
