
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getLink() {
    // Get the first interview
    const { data: interviews, error } = await supabase
        .from('interviews')
        .select('id, title')
        .limit(1)

    if (error || !interviews || interviews.length === 0) {
        console.log('No interviews found. Please create one in the admin dashboard first, or I can create a dummy one.')
        // Create a dummy one for convenience
        const { data: newInterview, error: createError } = await supabase
            .from('interviews')
            .insert([{ title: 'Test Interview', description: 'Auto-generated for testing' }])
            .select()
            .single()

        if (createError) {
            console.error('Failed to create test interview:', createError)
            return
        }

        console.log('Created new test interview.')
        console.log(`TEST LINK: http://localhost:3000/interview/${newInterview.id}`)

        // Also ensure it has questions
        await supabase.from('questions').insert([
            { interview_id: newInterview.id, question_text: 'Test Question 1', time_limit_seconds: 60, thinking_time_seconds: 10 }
        ])

    } else {
        const interview = interviews[0]
        console.log(`Found interview: "${interview.title}"`)
        console.log(`TEST LINK: http://localhost:3000/interview/${interview.id}`)
    }
}

getLink()
