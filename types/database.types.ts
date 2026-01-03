export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            reflections: {
                Row: {
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
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    feelings?: string | null
                    evaluation?: string | null
                    analysis?: string | null
                    conclusion?: string | null
                    action_plan?: string | null
                    progress?: number
                    is_complete?: boolean
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    feelings?: string | null
                    evaluation?: string | null
                    analysis?: string | null
                    conclusion?: string | null
                    action_plan?: string | null
                    progress?: number
                    is_complete?: boolean
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
