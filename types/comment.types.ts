export interface Comment {
    id: string
    reflection_id: string
    user_id: string
    content: string
    created_at: string
    author_name?: string // Joined from profiles
}
