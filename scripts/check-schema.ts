
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
    console.log('Checking "videos" table schema...')

    // Check Columns by trying to select them (dirty check since we can't easily access pg_catalog via client without rpc)
    // Actually, we can just try to insert a dummy record and see if it ignores unknown columns or fails.
    // OR better, assuming the user has direct SQL access via tools is one thing, but here I'm using the JS client.
    // I can try to select `video_type` from an existing row or just `count`.

    // Let's try to query the table definition if possible? No.
    // Let's try to simple select of the columns we expect.

    const { data, error } = await supabase
        .from('videos')
        .select('id, video_type, application_id, question_id')
        .limit(1)

    if (error) {
        console.error('Error selecting columns:', error.message)
        if (error.message.includes('column "video_type" does not exist')) {
            console.error('CRITICAL: "video_type" column is missing! Migration v5 not applied.')
        }
    } else {
        console.log('Successfully selected columns including "video_type".')
    }

    // Check constraints via an intentionally conflicting insert?
    // That's risky. 
    // Let's rely on the previous error: "Error on uploading". 
    // If it was a constraint error, the new logging I added will reveal it.

    console.log('Schema check complete (basic column verification).')
}

checkSchema()
