'use client'

import { useState } from 'react'

interface NewReflectionModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (title: string) => void
}

export default function NewReflectionModal({ isOpen, onClose, onCreate }: NewReflectionModalProps) {
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onCreate(title.trim())
            setTitle('')
            onClose()
        }
    }

    const handleClose = () => {
        setTitle('')
        onClose()
    }

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
        }}>
            <div className="modal">
                <div className="modal-header">
                    <h3>Start a New Reflection</h3>
                    <button className="modal-close" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="session-title">Reflection Title</label>
                        <input
                            type="text"
                            id="session-title"
                            className="form-input"
                            placeholder="e.g., Managing Post-Op Pain in Elderly Patient"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            autoFocus
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
                            Give your reflection a meaningful title that helps you remember the experience.
                        </p>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Begin Reflection</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
