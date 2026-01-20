
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing Supabase Storage Connection...')
console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('ERROR: Missing environment variables.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testStorage() {
    try {
        // 1. List Buckets
        console.log('\n--- Listing Buckets ---')
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()
        
        if (listError) {
            console.error('FAILED to list buckets:', listError)
            return
        }

        console.log('Buckets found:', buckets.map(b => b.name))

        const videoBucket = buckets.find(b => b.name === 'videos')
        
        if (!videoBucket) {
            console.error('ERROR: "videos" bucket NOT found!')
            // Try to create it?
            console.log('Attempting to create "videos" bucket...')
            const { data, error: createError } = await supabase.storage.createBucket('videos', {
                public: false
            })
            if (createError) {
                console.error('FAILED to create bucket:', createError)
            } else {
                console.log('Successfully created "videos" bucket')
            }
        } else {
            console.log('SUCCESS: "videos" bucket exists.')
        }

        // 2. Test Upload (Small File)
        console.log('\n--- Testing Upload ---')
        const dummyContent = new Blob(['Hello World'], { type: 'text/plain' })
        const fileName = `test_upload_${Date.now()}.txt`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, dummyContent)

        if (uploadError) {
            console.error('FAILED to upload file:', uploadError)
        } else {
            console.log('SUCCESS: File uploaded:', uploadData.path)
            
            // Cleanup
            const { error: removeError } = await supabase.storage
                .from('videos')
                .remove([fileName])
            
            if (removeError) console.warn('Warning: Failed to cleanup test file', removeError)
            else console.log('Cleanup successful')
        }

    } catch (err) {
        console.error('Unexpected error during test:', err)
    }
}

testStorage()
