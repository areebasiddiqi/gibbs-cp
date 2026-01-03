import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GibbsCycle from '@/components/GibbsCycle'

export default function Home() {
    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <span>One-on-One Nursing Mentorship</span>
                        </div>
                        <h1 className="hero-title">
                            Grow with <span className="highlight">Gibbs&apos; Reflective Cycle</span>
                        </h1>
                        <p className="hero-description">
                            Deepen your clinical insight, strengthen your skills, and grow with confidence through personalized
                            nursing mentorship grounded in evidence-based reflection.
                        </p>
                        <div className="hero-buttons">
                            <Link href="/login" className="btn btn-primary btn-lg">
                                Start Your Reflection
                                <span>→</span>
                            </Link>
                            <a href="#phases" className="btn btn-secondary btn-lg">
                                Learn More
                            </a>
                        </div>
                    </div>

                    <GibbsCycle />
                </div>
            </section>

            {/* Phases Section */}
            <section className="section" id="phases">
                <div className="container">
                    <div className="section-header">
                        <h2>The Six Phases of Reflection</h2>
                        <p>Each phase guides you through a structured approach to learning from clinical experiences, helping
                            you become a more thoughtful and effective nurse.</p>
                    </div>

                    <div className="phases-grid">
                        {[
                            { num: 1, title: 'Description', desc: 'What happened? Describe the clinical experience objectively, including the context, people involved, and your actions.' },
                            { num: 2, title: 'Feelings', desc: 'What were you thinking and feeling? Explore your emotional responses, concerns, and initial reactions to the situation.' },
                            { num: 3, title: 'Evaluation', desc: 'What was good and bad? Assess what went well and what could have been done differently in the experience.' },
                            { num: 4, title: 'Analysis', desc: 'What sense can you make of it? Connect your experience to nursing theory, evidence-based practice, and pathophysiology.' },
                            { num: 5, title: 'Conclusion', desc: 'What else could you have done? Identify learning points, skill gaps, and alternative approaches you could take.' },
                            { num: 6, title: 'Action Plan', desc: 'What will you do next time? Create SMART goals and specific actions for professional development.' }
                        ].map(phase => (
                            <div key={phase.num} className="glass-card phase-card">
                                <div className="phase-card-number">{phase.num}</div>
                                <h4>{phase.title}</h4>
                                <p>{phase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section" id="benefits">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Reflective Practice Matters</h2>
                        <p>Transform your clinical experiences into opportunities for growth and continuous improvement.</p>
                    </div>

                    <div className="benefits-grid">
                        {[
                            { icon: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z M5 19l1 3 1-3M18 5l1 3 1-3', title: 'Meaningful Reflection', desc: 'Move beyond surface-level thinking to develop deep insights from every clinical encounter.' },
                            { icon: 'M9 12l2 2 4-4 M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0', title: 'Identify Strengths', desc: 'Recognize what you do well and build on your existing competencies as a nursing professional.' },
                            { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4l-10 10.01l-3-3', title: 'Build Confidence', desc: 'Develop greater confidence in clinical decision-making through structured self-assessment.' },
                            { icon: 'M12 20v-10 M18 20V4 M6 20v-4', title: 'Professional Growth', desc: 'Create actionable plans to achieve your career goals with supportive guidance.' }
                        ].map((benefit, i) => (
                            <div key={i} className="glass-card benefit-card">
                                <div className="benefit-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d={benefit.icon} />
                                    </svg>
                                </div>
                                <div className="benefit-content">
                                    <h4>{benefit.title}</h4>
                                    <p>{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="cta-section">
                        <h2>Ready to Begin Your Reflective Journey?</h2>
                        <p>Start your first reflection session today and take the next step in your professional development.</p>
                        <Link href="/login" className="btn btn-lg">
                            Start Your First Reflection
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <img src="/logo.png" alt="Nursing Mentorship Logo" style={{ height: '32px', width: 'auto' }} />
                            <span>Nursing Mentorship</span>
                        </div>
                        <div className="footer-links">
                            <a href="#phases">The 6 Phases</a>
                            <a href="#benefits">Benefits</a>
                            <Link href="/dashboard">Dashboard</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Nursing Mentorship. Empowering nurses through reflective practice.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
