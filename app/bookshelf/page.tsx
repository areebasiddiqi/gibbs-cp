'use client'

import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BookshelfPage() {
    const [loading, setLoading] = useState(true)

    // Placeholder URL - User should replace this with their actual Heyzine bookshelf URL
    const bookshelfUrl = "https://heyzine.com/shelf/1af00da1c6.html"

    return (
        <div className="bookshelf-container">
            <header className="bookshelf-header">
                <div className="container">
                    <div className="header-content">
                        <Link href="/" className="back-btn">
                            <ChevronLeft size={24} />
                            <span>Back to Home</span>
                        </Link>
                        <h1 className="page-title">Digital Bookshelf</h1>
                        <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
                    </div>
                </div>
            </header>

            <main className="bookshelf-main">
                {loading && (
                    <div className="loader-overlay">
                        <Loader2 className="animate-spin" size={48} />
                        <p>Loading Bookshelf...</p>
                    </div>
                )}
                <div className="iframe-wrapper">
                    <iframe
                        src={bookshelfUrl}
                        title="Heyzine Bookshelf"
                        onLoad={() => setLoading(false)}
                        allowFullScreen
                        className="bookshelf-iframe"
                    ></iframe>
                </div>
            </main>

            <style jsx>{`
                .bookshelf-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: #f8fafc;
                }
                .bookshelf-header {
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 1rem 0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    z-index: 10;
                }
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .back-btn:hover {
                    color: #3b82f6;
                }
                .page-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }
                .bookshelf-main {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                }
                .loader-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    z-index: 5;
                    gap: 1rem;
                    color: #64748b;
                }
                .iframe-wrapper {
                    width: 100%;
                    height: 100%;
                }
                .bookshelf-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 640px) {
                    .page-title {
                        font-size: 1.25rem;
                    }
                    .back-btn span {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}
