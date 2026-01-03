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
                <ul className="nav-links">
                    {!user ? (
                        <>
                            <li><Link href="/#phases" className="nav-link">The 6 Phases</Link></li>
                            <li><Link href="/#benefits" className="nav-link">Benefits</Link></li>
                            <li><Link href="/login" className="btn btn-primary">Start Reflecting</Link></li>
                        </>
                    ) : (
                        <>
                            {!isDashboard && (
                                <li><Link href="/" className="nav-link">Home</Link></li>
                            )}
                            <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
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
