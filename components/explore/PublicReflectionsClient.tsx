'use client'

import { Reflection } from '@/types/reflection.types'
import ReflectionCard from '@/components/dashboard/ReflectionCard'

interface PublicReflectionsClientProps {
    reflections: Reflection[]
}

export default function PublicReflectionsClient({ reflections }: PublicReflectionsClientProps) {
    return (
        <div>
            <div className="dashboard-header">
                <div>
                    <h1>Explore Reflections</h1>
                    <p>Learn from the shared experiences of the nursing community.</p>
                </div>
            </div>

            {reflections.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🌏</div>
                    <h3>No public reflections yet</h3>
                    <p>Be the first to share your reflection with the community!</p>
                </div>
            ) : (
                <div className="reflections-grid">
                    {reflections.map((reflection, index) => (
                        <ReflectionCard
                            key={reflection.id}
                            reflection={reflection}
                            index={index}
                            showAuthor={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
