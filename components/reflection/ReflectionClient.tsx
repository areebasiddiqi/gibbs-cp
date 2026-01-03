'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Reflection, PHASES, ReflectionPhase } from '@/types/reflection.types'
import { calculateProgress } from '@/lib/utils/reflection'
import PhaseForm from './PhaseForm'

interface ReflectionClientProps {
    reflection: Reflection
    isOwner?: boolean
}

export default function ReflectionClient({ reflection: initialReflection, isOwner = false }: ReflectionClientProps) {
    const router = useRouter()
    const [reflection, setReflection] = useState<Reflection>(initialReflection)
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    // Find the first incomplete phase on mount
    useEffect(() => {
        for (let i = 0; i < PHASES.length; i++) {
            const phase = PHASES[i]
            if (!reflection[phase.key] || reflection[phase.key]!.trim() === '') {
                setCurrentPhaseIndex(i)
                return
            }
        }
        // All phases complete, show last phase
        setCurrentPhaseIndex(PHASES.length - 1)
    }, [reflection])

    const handleSave = async (phaseKey: ReflectionPhase, content: string) => {
        if (!isOwner) return // Prevent saving if not owner

        setSaving(true)

        const updatedReflection = {
            ...reflection,
            [phaseKey]: content,
            updated_at: new Date().toISOString(),
        }

        // Calculate new progress
        const progress = calculateProgress(updatedReflection as Reflection)
        const isComplete = progress === 100

        const { error } = await supabase
            .from('reflections')
            // @ts-ignore
            .update({
                [phaseKey]: content,
                progress,
                is_complete: isComplete,
                updated_at: new Date().toISOString(),
            } as any)
            .eq('id', reflection.id)

        if (error) {
            console.error('Error saving reflection:', error)
            setSaving(false)
            return
        }

        setReflection({ ...updatedReflection, progress, is_complete: isComplete } as Reflection)
        setSaving(false)
    }

    const handleNext = () => {
        if (currentPhaseIndex < PHASES.length - 1) {
            setCurrentPhaseIndex(currentPhaseIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentPhaseIndex > 0) {
            setCurrentPhaseIndex(currentPhaseIndex - 1)
        }
    }

    const handlePhaseClick = (index: number) => {
        setCurrentPhaseIndex(index)
    }

    const currentPhase = PHASES[currentPhaseIndex]
    const progress = calculateProgress(reflection)

    return (
        <div className="reflection-layout">
            <div className="reflection-main">
                {/* Phase Indicator */}
                <div className="phase-indicator">
                    {PHASES.map((phase, index) => {
                        const isCompleted = reflection[phase.key] && reflection[phase.key]!.trim() !== ''
                        const isActive = index === currentPhaseIndex

                        return (
                            <div
                                key={phase.key}
                                className={`phase-dot ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                                onClick={() => handlePhaseClick(index)}
                                style={{ cursor: 'pointer' }}
                                title={phase.label}
                            >
                                {phase.number}
                            </div>
                        )
                    })}
                </div>

                {/* Phase Content */}
                <PhaseForm
                    phase={currentPhase}
                    value={reflection[currentPhase.key] || ''}
                    onSave={handleSave}
                    saving={saving}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirst={currentPhaseIndex === 0}
                    isLast={currentPhaseIndex === PHASES.length - 1}
                    readOnly={!isOwner}
                />
            </div>

            {/* Sidebar */}
            <div className="glass-card reflection-sidebar">
                <div className="sidebar-section">
                    <h5>Reflection Progress</h5>
                    <div className="progress-bar" style={{ marginTop: 'var(--space-3)' }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 'var(--space-2)' }}>
                        {progress}% Complete
                    </p>
                </div>

                <div className="sidebar-section">
                    <h5>Reflection Title</h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginTop: 'var(--space-2)' }}>
                        {reflection.title}
                    </p>
                    {reflection.author_name && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 'var(--space-1)' }}>
                            By: {reflection.author_name}
                        </p>
                    )}
                </div>

                <div className="sidebar-section">
                    <h5>All Phases</h5>
                    <div style={{ marginTop: 'var(--space-3)' }}>
                        {PHASES.map((phase, index) => {
                            const isCompleted = reflection[phase.key] && reflection[phase.key]!.trim() !== ''
                            const isActive = index === currentPhaseIndex

                            return (
                                <div
                                    key={phase.key}
                                    onClick={() => handlePhaseClick(index)}
                                    style={{
                                        padding: 'var(--space-3)',
                                        marginBottom: 'var(--space-2)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: isActive ? 'var(--primary-50)' : 'transparent',
                                        border: `1px solid ${isActive ? 'var(--primary-300)' : 'var(--gray-200)'}`,
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: isCompleted ? 'var(--success)' : 'var(--gray-200)',
                                                color: isCompleted ? 'white' : 'var(--gray-500)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {isCompleted ? '✓' : phase.number}
                                        </div>
                                        <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}>
                                            {phase.label}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="sidebar-section">
                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={() => router.push('/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
