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

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingBottom: 'var(--space-8)' }}>
                <ReflectionClient reflection={reflection} isOwner={isOwner} />
                <CommentSection reflectionId={(reflection as any).id} currentUserId={user.id} />
            </div>
        </>
    )
}
