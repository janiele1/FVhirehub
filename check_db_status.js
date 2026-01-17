const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function testUpdate() {
    console.log('Fetching one application...')
    const { data: apps, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .limit(1)

    if (fetchError || !apps || apps.length === 0) {
        console.error('Fetch error:', fetchError)
        return
    }

    const app = apps[0]
    console.log(`Testing update for ID: ${app.id}, Current Status: ${app.status}`)

    const { data: result, error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', app.id)
        .select()

    if (updateError) {
        console.error('Update FAILED:', updateError)
    } else {
        console.log('Update SUCCESSFUL! Result:', result)
    }
}

testUpdate()
