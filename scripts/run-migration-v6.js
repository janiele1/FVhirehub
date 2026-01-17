const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function runMigration() {
    console.log('Reading migration_v6_application_statuses.sql...');
    const sqlPath = path.join(__dirname, '..', 'migration_v6_application_statuses.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing migration via RPC...');
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
        console.error('Migration FAILED:', error);
        console.log('Note: If exec_sql RPC is not available, you must run the SQL manually in Supabase SQL Editor.');
    } else {
        console.log('Migration SUCCESSFUL!');
    }
}

runMigration();
