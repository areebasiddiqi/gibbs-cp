import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Nursing Mentorship | Gibbs\' Reflective Cycle',
    description: 'One-on-One Nursing Mentorship using Gibbs\' Reflective Cycle. Deepen your clinical insight, strengthen your skills, and grow with confidence.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body>{children}</body>
        </html>
    )
}
