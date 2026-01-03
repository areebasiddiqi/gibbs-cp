import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import PublicReflectionsClient from '@/components/explore/PublicReflectionsClient'

export default async function ExplorePage() {
  const supabase = await createClient()

  // Fetch public reflections with author names
  const { data: reflections, error } = await supabase
    .from('reflections')
    .select(`
      *,
      profiles!reflections_user_id_fkey(full_name)
    `)
    .eq('is_public', true)
    .eq('is_complete', true)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching public reflections:', error)
  }

  // Transform the data to include author_name
  const transformedReflections = reflections?.map((r: any) => ({
    ...r,
    author_name: r.profiles?.full_name || 'Anonymous'
  })) || []

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(80px + var(--space-8))', minHeight: '100vh' }}>
        <div className="container">
          <PublicReflectionsClient reflections={transformedReflections} />
        </div>
      </main>
    </>
  )
}
