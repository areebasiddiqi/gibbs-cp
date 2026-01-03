'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Reflection } from '@/types/reflection.types'
import ReflectionCard from './ReflectionCard'
import NewReflectionModal from './NewReflectionModal'

interface DashboardClientProps {
    initialReflections: Reflection[]
    userId: string
}

export default function DashboardClient({ initialReflections, userId }: DashboardClientProps) {
    const router = useRouter()
    const [reflections, setReflections] = useState<Reflection[]>(initialReflections)
    const [showNewModal, setShowNewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(null)
    const supabase = createClient()

    const handleCreateReflection = async (title: string) => {
        const { data, error } = await supabase
            .from('reflections')
            .insert([
                {
                    user_id: userId,
                    title,
                    progress: 0,
                    is_complete: false,
                },
            ] as any)
            .select()
            .single()

        if (error) {
            console.error('Error creating reflection:', error)
            return
        }

        if (data) {
            router.push(`/reflection/${(data as any).id}`)
        }
    }

    const handleDeleteClick = (id: string) => {
        setReflectionToDelete(id)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        if (!reflectionToDelete) return

        const { error } = await supabase
            .from('reflections')
            .delete()
            .eq('id', reflectionToDelete)

        if (error) {
            console.error('Error deleting reflection:', error)
            return
        }

        setReflections(reflections.filter(r => r.id !== reflectionToDelete))
        setShowDeleteModal(false)
        setReflectionToDelete(null)
    }

    return (
        <>
            <div className="dashboard-header">
                <div>
                    <h1>Community Reflections</h1>
                    <p style={{ marginTop: 'var(--space-2)' }}>
                        Explore reflections from the entire nursing community
                    </p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => setShowNewModal(true)}>
                    <span>+</span>
                    <span>New Reflection</span>
                </button>
            </div>

            {reflections.length === 0 ? (
                <div className="glass-card empty-state">
                    <div className="empty-state-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <h3>No Reflections Yet</h3>
                    <p>Be the first to share your reflection with the community!</p>
                    <button className="btn btn-primary btn-lg" onClick={() => setShowNewModal(true)}>
                        Start Your First Reflection
                    </button>
                </div>
            ) : (
                <div className="reflections-grid">
                    {reflections.map((reflection, index) => (
                        <ReflectionCard
                            key={reflection.id}
                            reflection={reflection}
                            index={index}
                            // Only pass onDelete if the reflection belongs to the current user
                            onDelete={reflection.user_id === userId ? handleDeleteClick : undefined}
                            showAuthor={true}
                        />
                    ))}
                </div>
            )}

            <NewReflectionModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onCreate={handleCreateReflection}
            />

            {/* Delete Confirmation Modal */}
            <div className={`modal-overlay ${showDeleteModal ? 'active' : ''}`}>
                <div className="modal">
                    <div className="modal-header">
                        <h3>Delete Reflection?</h3>
                        <button className="modal-close" onClick={() => setShowDeleteModal(false)}>&times;</button>
                    </div>
                    <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
                        Are you sure you want to delete this reflection? This action cannot be undone.
                    </p>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </>
    )
}
