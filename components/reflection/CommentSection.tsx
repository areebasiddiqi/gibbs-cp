'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Comment } from '@/types/comment.types'
import { formatDate } from '@/lib/utils/reflection'

interface CommentSectionProps {
    reflectionId: string
    currentUserId: string
}

export default function CommentSection({ reflectionId, currentUserId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchComments()
    }, [reflectionId])

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles (full_name)
                `)
                .eq('reflection_id', reflectionId)
                .order('created_at', { ascending: true })

            if (error) throw error

            const formattedComments = data.map((c: any) => ({
                ...c,
                author_name: c.profiles?.full_name || 'Anonymous'
            }))

            setComments(formattedComments)
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([
                    {
                        reflection_id: reflectionId,
                        user_id: currentUserId,
                        content: newComment.trim()
                    }
                ] as any)
                .select(`
                    *,
                    profiles (full_name)
                `)
                .single()

            if (error) throw error

            const newCommentWithAuthor = {
                ...(data as any),
                author_name: (data as any).profiles?.full_name || 'Anonymous'
            }

            setComments([...comments, newCommentWithAuthor])
            setNewComment('')
        } catch (error) {
            console.error('Error posting comment:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId)

            if (error) throw error

            setComments(comments.filter(c => c.id !== commentId))
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
    }

    return (
        <div className="comments-section" style={{ marginTop: 'var(--space-8)', borderTop: '1px solid var(--gray-200)', paddingTop: 'var(--space-6)' }}>
            <h3>Comments ({comments.length})</h3>

            <div className="comments-list" style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {loading ? (
                    <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="glass-card" style={{ padding: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{comment.author_name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{formatDate(comment.created_at)}</span>
                            </div>
                            <p style={{ color: 'var(--gray-800)', lineHeight: '1.5' }}>{comment.content}</p>
                            {comment.user_id === currentUserId && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--error)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        marginTop: 'var(--space-2)',
                                        padding: 0
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: 'var(--space-6)' }}>
                <div className="form-group">
                    <label htmlFor="comment" className="form-label">Add a comment</label>
                    <textarea
                        id="comment"
                        className="form-textarea"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your feedback or encouragement..."
                        style={{ minHeight: '100px' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !newComment.trim()}
                >
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    )
}
