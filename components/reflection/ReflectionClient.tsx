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
    canEdit?: boolean
}

export default function ReflectionClient({ reflection: initialReflection, isOwner = false, canEdit = false }: ReflectionClientProps) {
    const router = useRouter()
    const [reflection, setReflection] = useState<Reflection>(initialReflection)
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
    const [saving, setSaving] = useState(false)
    const [shares, setShares] = useState<any[]>([])
    const supabase = createClient()

    const fetchShares = async () => {
        if (!isOwner) return
        const { data } = await supabase
            .from('reflection_shares')
            .select('*')
            .eq('reflection_id', reflection.id)

        if (data) {
            setShares(data)
        }
    }

    // Find the first incomplete phase on mount
    useEffect(() => {
        fetchShares()
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
        if (!canEdit) return // Prevent saving if not allowed

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

                {isOwner && (
                    <div className="sidebar-section">
                        <div className="sidebar-flex-group" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h5 style={{ marginBottom: '4px' }}>Visibility</h5>
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                    {reflection.is_public ? 'Visible to everyone' : 'Only visible to you'}
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    const newVisibility = !reflection.is_public
                                    const { error } = await supabase
                                        .from('reflections')
                                        // @ts-ignore
                                        .update({ is_public: newVisibility, updated_at: new Date().toISOString() } as any)
                                        .eq('id', reflection.id)

                                    if (!error) {
                                        setReflection({ ...reflection, is_public: newVisibility })
                                    }
                                }}
                                style={{
                                    background: reflection.is_public ? '#2bc45e' : 'var(--gray-300)',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    width: '44px',
                                    height: '24px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    padding: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: reflection.is_public ? '22px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        transition: 'left 0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {isOwner && (
                    <div className="sidebar-section">
                        <h5 style={{ marginBottom: 'var(--space-3)' }}>Invite Mentor</h5>
                        <div className="sidebar-flex-group">
                            <input
                                type="email"
                                placeholder="mentor@email.com"
                                id="invite-email"
                                style={{
                                    flex: 1,
                                    padding: 'var(--space-2)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--gray-300)',
                                    fontSize: '0.875rem',
                                    minWidth: '0', // Allow input to shrink
                                }}
                            />
                            <button
                                className="btn btn-primary"
                                style={{ padding: 'var(--space-2)', whiteSpace: 'nowrap' }}
                                onClick={async () => {
                                    const emailInput = document.getElementById('invite-email') as HTMLInputElement
                                    const email = emailInput.value
                                    if (!email) return

                                    const { error } = await supabase
                                        .from('reflection_shares')
                                        // @ts-ignore
                                        .insert({
                                            reflection_id: reflection.id,
                                            email: email,
                                            permission: 'edit'
                                        } as any)

                                    if (error) {
                                        alert('Error inviting mentor: ' + error.message)
                                    } else {
                                        alert('Mentor invited successfully!')
                                        emailInput.value = ''
                                        // Refresh shares list
                                        fetchShares()
                                    }
                                }}
                            >
                                Invite
                            </button>
                        </div>

                        {/* Share Options */}
                        <div className="sidebar-flex-group" style={{ marginTop: 'var(--space-2)' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-1)', whiteSpace: 'nowrap' }}
                                onClick={() => {
                                    const url = window.location.href
                                    navigator.clipboard.writeText(url)
                                    alert('Link copied to clipboard!')
                                }}
                            >
                                🔗 Copy Link
                            </button>
                            <a
                                href={`mailto:?subject=Review my reflection: ${reflection.title}&body=Hi,%0A%0AI invited you to review my reflection "${reflection.title}".%0A%0APlease access it here: ${typeof window !== 'undefined' ? window.location.href : ''}`}
                                className="btn btn-secondary"
                                style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-1)', textAlign: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}
                            >
                                📧 Send Email
                            </a>
                        </div>

                        {/* List of invited mentors */}
                        {shares.length > 0 && (
                            <div style={{ marginTop: 'var(--space-3)' }}>
                                <h6 style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: 'var(--space-2)' }}>INVITED MENTORS</h6>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {shares.map((share) => (
                                        <div key={share.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{share.email}</span>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Remove this mentor?')) return
                                                    const { error } = await supabase
                                                        .from('reflection_shares')
                                                        .delete()
                                                        .eq('id', share.id)

                                                    if (!error) {
                                                        fetchShares()
                                                    }
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--error)',
                                                    cursor: 'pointer',
                                                    padding: '2px',
                                                    fontSize: '1.25rem',
                                                    lineHeight: 1
                                                }}
                                                title="Remove access"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
                            Invited mentors can view and edit this reflection.
                        </p>
                    </div>
                )}

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
                    readOnly={!canEdit}
                />
            </div>
        </div>
    )
}
