'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            if (error) throw error

            // Profile is automatically created by database trigger
            router.push('/dashboard')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'An error occurred during registration')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-panel">
                <div className="logo">
                    <Image src="/logo.png" alt="Nursing Mentorship Logo" width={180} height={180} className="logo-img" />
                </div>

                <div className="form-container">
                    <div className="form-header">
                        <h1>Create Account</h1>
                        <p>Join our nursing mentorship community</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        {error && (
                            <div style={{
                                padding: 'var(--space-3)',
                                background: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-4)',
                                color: '#c00'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                className="form-input"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="Create a password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-input"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>

                        <Link href="/login" className="btn btn-secondary">
                            Already have an account? Log in
                        </Link>
                    </form>

                    <div className="form-links">
                        <Link href="/" className="form-link">← Back to home</Link>
                    </div>
                </div>

                <div className="bottom-section">
                    <p>Already a member?</p>
                    <Link href="/login" className="btn-outline">Log in to your account</Link>
                </div>
            </div>

            <div className="image-panel">
                <div className="image-content">
                    <Image
                        src="/nursing_students.jpg"
                        alt="Nursing mentorship illustration"
                        width={650}
                        height={650}
                        style={{
                            width: '90%',
                            maxWidth: '650px',
                            height: 'auto',
                            borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                        }}
                    />
                    <div className="image-caption">
                        <h2>Start Your Reflective Journey</h2>
                        <p>Join nurses worldwide in meaningful professional development.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
