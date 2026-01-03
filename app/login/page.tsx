'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/dashboard')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            {/* Left Panel - Login Form */}
            <div className="login-panel">
                {/* Logo */}
                <div className="logo">
                    <Image src="/logo.png" alt="Nursing Mentorship Logo" width={180} height={180} className="logo-img" />
                </div>

                {/* Form */}
                <div className="form-container">
                    <form onSubmit={handleLogin}>
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>

                        <Link href="/register" className="btn btn-secondary">
                            Create an account
                        </Link>
                    </form>

                    <div className="form-links">
                        <Link href="/" className="form-link">← Back to home</Link>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="bottom-section">
                    <p>Not a member?</p>
                    <Link href="/" className="btn-outline">Learn how to join</Link>
                </div>
            </div>

            {/* Right Panel - Image */}
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
                        <h2>One-on-One Nursing Mentorship</h2>
                        <p>Let&apos;s reflect, learn, and grow together.</p>
                    </div>
                    <div className="info-card">
                        <h3>Nursing Mentorship Sessions</h3>
                        <div className="info-stats">
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Mentees</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">6</div>
                                <div className="stat-label">Phases</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">100%</div>
                                <div className="stat-label">Growth</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
