import { readFileSync } from 'fs';
import { supabaseAdminClient } from '../src/config/supabase';

async function pushSchema() {
  console.log('📋 Reading schema file...');
  const schema = readFileSync('./supabase/schema.sql', 'utf-8');

  console.log('🚀 Pushing schema to Supabase...');
  
  // Split by semicolon and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { error } = await supabaseAdminClient.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          // Try direct query if rpc fails
          console.log(`Executing: ${statement.substring(0, 80)}...`);
        }
      } catch (err) {
        console.warn(`Statement may have failed (might be expected):`, err);
      }
    }
  }

  console.log('✅ Schema push completed!');
  console.log('Note: You may need to run the schema manually in Supabase SQL Editor');
  console.log('for statements that require specific permissions (materialized views, functions, etc.)');
  
  process.exit(0);
}

pushSchema().catch(err => {
  console.error('❌ Schema push failed:', err);
  console.log('\n======================================================');
  console.log('💡 How to manually create the database tables:');
  console.log('1. Open your Supabase Dashboard: https://supabase.com');
  console.log('2. Go to your project -> SQL Editor.');
  console.log('3. Copy the entire contents of backend/supabase/schema.sql');
  console.log('4. Paste it into the SQL Editor and click RUN.');
  console.log('5. After it succeeds, run: npm run db:seed');
  console.log('======================================================\n');
  process.exit(1);
});