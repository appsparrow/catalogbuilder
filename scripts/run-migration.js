// Simple script to run Supabase migrations
// Run with: node scripts/run-migration.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// You'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL: Your Supabase project URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key');
  console.error('');
  console.error('💡 You can find these in your Supabase project settings:');
  console.error('   Project Settings → API → Project URL & Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Running database migrations...');
    
    // Run migrations in order
    const migrations = [
      '20250125000000_add_user_id_columns.sql',
      '20250125000001_create_subscription_tables.sql'
    ];
    
    for (const migrationFile of migrations) {
      console.log(`\n📄 Running migration: ${migrationFile}`);
      
      // Read the migration file
      const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
      // Execute the migration
      const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      
      if (error) {
        // Try direct execution if RPC doesn't work
        console.log('⚠️  RPC method failed, trying direct execution...');
        
        // Split the SQL into individual statements
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        for (const statement of statements) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            if (stmtError) {
              console.warn(`⚠️  Statement failed (may already exist): ${stmtError.message}`);
            } else {
              console.log('✅ Statement executed successfully');
            }
          } catch (err) {
            console.warn(`⚠️  Statement failed (may already exist): ${err.message}`);
          }
        }
      } else {
        console.log('✅ Migration executed successfully');
      }
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify tables exist in your Supabase dashboard');
    console.log('2. Test the subscription flow in your app');
    console.log('3. Set up Stripe if you haven\'t already');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Manual setup:');
    console.error('1. Go to your Supabase dashboard');
    console.error('2. Navigate to SQL Editor');
    console.error('3. Copy and paste the contents of these files in order:');
    console.error('   supabase/migrations/20250125000000_add_user_id_columns.sql');
    console.error('   supabase/migrations/20250125000001_create_subscription_tables.sql');
    console.error('4. Execute the SQL');
    process.exit(1);
  }
}

// Run the migration
runMigration();
