export interface Reflection {
    id: string
    user_id: string
    title: string
    description: string | null
    feelings: string | null
    evaluation: string | null
    analysis: string | null
    conclusion: string | null
    action_plan: string | null
    progress: number
    is_complete: boolean
    is_public: boolean
    created_at: string
    updated_at: string
    author_name?: string // Joined from profiles table
}

export type ReflectionPhase =
    | 'description'
    | 'feelings'
    | 'evaluation'
    | 'analysis'
    | 'conclusion'
    | 'action_plan'

export interface PhaseInfo {
    key: ReflectionPhase
    label: string
    number: number
    color: string
    prompt: string
    placeholder: string
}

export const PHASES: PhaseInfo[] = [
    {
        key: 'description',
        label: 'Description',
        number: 1,
        color: 'var(--phase-description)',
        prompt: 'What happened?',
        placeholder: 'Describe the clinical experience objectively, including the context, people involved, and your actions...'
    },
    {
        key: 'feelings',
        label: 'Feelings',
        number: 2,
        color: 'var(--phase-feelings)',
        prompt: 'What were you thinking and feeling?',
        placeholder: 'Explore your emotional responses, concerns, and initial reactions to the situation...'
    },
    {
        key: 'evaluation',
        label: 'Evaluation',
        number: 3,
        color: 'var(--phase-evaluation)',
        prompt: 'What was good and bad?',
        placeholder: 'Assess what went well and what could have been done differently in the experience...'
    },
    {
        key: 'analysis',
        label: 'Analysis',
        number: 4,
        color: 'var(--phase-analysis)',
        prompt: 'What sense can you make of it?',
        placeholder: 'Connect your experience to nursing theory, evidence-based practice, and pathophysiology...'
    },
    {
        key: 'conclusion',
        label: 'Conclusion',
        number: 5,
        color: 'var(--phase-conclusion)',
        prompt: 'What else could you have done?',
        placeholder: 'Identify learning points, skill gaps, and alternative approaches you could take...'
    },
    {
        key: 'action_plan',
        label: 'Action Plan',
        number: 6,
        color: 'var(--phase-action)',
        prompt: 'What will you do next time?',
        placeholder: 'Create SMART goals and specific actions for professional development...'
    }
]
