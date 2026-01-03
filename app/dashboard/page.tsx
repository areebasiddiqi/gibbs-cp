import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch ALL reflections with author name (removed user_id filter)
    const { data: reflections, error } = await supabase
        .from('reflections')
        .select(`
      *,
      profiles!reflections_user_id_fkey(full_name)
    `)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching reflections:', error)
    }

    // Transform the data to include author_name
    const transformedReflections = reflections?.map(r => ({
        ...r,
        author_name: r.profiles?.full_name || 'Unknown'
    })) || []

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 'calc(80px + var(--space-8))', minHeight: '100vh' }}>
                <div className="container">
                    <DashboardClient initialReflections={transformedReflections} userId={user.id} />
                </div>
            </main>
        </>
    )
}
