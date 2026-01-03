import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ReflectionClient from '@/components/reflection/ReflectionClient'
import CommentSection from '@/components/reflection/CommentSection'

export default async function ReflectionPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the reflection
    const { data: reflection, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !reflection) {
        redirect('/dashboard')
    }

    const isOwner = (reflection as any).user_id === user.id

    // Check if user is an invited mentor with edit permission
    let canEdit = isOwner
    if (!isOwner) {
        const { data: share } = await supabase
            .from('reflection_shares')
            .select('permission')
            .eq('reflection_id', params.id)
            .eq('email', user.email)
            .single()

        if (share && share.permission === 'edit') {
            canEdit = true
        }
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingBottom: 'var(--space-8)' }}>
                <ReflectionClient reflection={reflection} isOwner={isOwner} canEdit={canEdit} />
                <CommentSection reflectionId={(reflection as any).id} currentUserId={user.id} />
            </div>
        </>
    )
}
