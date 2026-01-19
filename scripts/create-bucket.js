/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createBucket() {
    console.log('Checking for "videos" bucket...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const bucketExists = buckets.find(b => b.name === 'videos');

    if (!bucketExists) {
        console.log('Creating "videos" bucket...');
        const { data, error } = await supabase.storage.createBucket('videos', {
            public: true
        });

        if (error) {
            console.error('Error creating bucket:', error);
        } else {
            console.log('Successfully created "videos" bucket.');
        }
    } else {
        console.log('"videos" bucket already exists.');
    }
}

createBucket();
