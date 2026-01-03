'use client'

export default function GibbsCycle() {
    return (
        <div className="gibbs-cycle">
            <div className="cycle-ring"></div>
            <div className="cycle-center">
                <div className="cycle-center-text">
                    Gibbs'<br />Reflective<br />Cycle
                </div>
            </div>

            {/* Phase 1: Description */}
            <div className="phase-node phase-1" title="Description">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </span>
                <span className="phase-node-label">Description</span>
            </div>

            {/* Phase 2: Feelings */}
            <div className="phase-node phase-2" title="Feelings">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                </span>
                <span className="phase-node-label">Feelings</span>
            </div>

            {/* Phase 3: Evaluation */}
            <div className="phase-node phase-3" title="Evaluation">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3v18M3 7l3 9a5 5 0 0 0 4 0l3-9M15 7l3 9a5 5 0 0 0 4 0l-3-9M3 7h6M15 7h6" />
                    </svg>
                </span>
                <span className="phase-node-label">Evaluation</span>
            </div>

            {/* Phase 4: Analysis */}
            <div className="phase-node phase-4" title="Analysis">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <span className="phase-node-label">Analysis</span>
            </div>

            {/* Phase 5: Conclusion */}
            <div className="phase-node phase-5" title="Conclusion">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.9V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.1A7 7 0 0 0 12 2z" />
                    </svg>
                </span>
                <span className="phase-node-label">Conclusion</span>
            </div>

            {/* Phase 6: Action Plan */}
            <div className="phase-node phase-6" title="Action Plan">
                <span className="phase-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                </span>
                <span className="phase-node-label">Action Plan</span>
            </div>
        </div>
    )
}
