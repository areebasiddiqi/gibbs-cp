'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/reflection')

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container">
                <Link href="/" className="nav-logo">
                    <Image
                        src="/logo.png"
                        alt="Nursing Mentorship Logo"
                        width={40}
                        height={40}
                        className="nav-logo-img"
                    />
                    <span>Nursing Mentorship</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {!user ? (
                        <>
                            <li><Link href="/#phases" className="nav-link" onClick={() => setMobileMenuOpen(false)}>The 6 Phases</Link></li>
                            <li><Link href="/#benefits" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Benefits</Link></li>
                            <li><Link href="/bookshelf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Bookshelf</Link></li>
                            <li><a href="https://calendly.com/jamilaljuaid/30min" target="_blank" rel="noopener noreferrer" className="nav-link">Consultation</a></li>
                            <li><Link href="/login" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Start Reflecting</Link></li>
                        </>
                    ) : (
                        <>
                            {!isDashboard && (
                                <li><Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                            )}
                            <li><Link href="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link></li>
                            <li><Link href="/bookshelf" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Bookshelf</Link></li>
                            <li><a href="https://calendly.com/jamilaljuaid/30min" target="_blank" rel="noopener noreferrer" className="nav-link">Consultation</a></li>
                            <li>
                                <button onClick={handleSignOut} className="btn btn-secondary">
                                    Sign Out
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}
