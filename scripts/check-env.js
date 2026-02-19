#!/usr/bin/env node

/**
 * Simple script to check if Supabase environment variables are set
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Checking Supabase environment variables...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('   Create it by copying .env.example:');
  console.log('   cp .env.example .env.local\n');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

let hasUrl = false;
let hasKey = false;
let urlValue = '';
let keyValue = '';

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    hasUrl = true;
    urlValue = line.split('=')[1]?.trim() || '';
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    hasKey = true;
    keyValue = line.split('=')[1]?.trim() || '';
  }
}

console.log('📋 Environment variables status:\n');

if (hasUrl && urlValue) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
  console.log(`   Value: ${urlValue.substring(0, 30)}...`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty');
}

if (hasKey && keyValue) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
  console.log(`   Value: ${keyValue.substring(0, 30)}...`);
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty');
}

console.log('\n');

if (!hasUrl || !urlValue || !hasKey || !keyValue) {
  console.log('⚠️  Please add your Supabase credentials to .env.local');
  console.log('   See SETUP.md for detailed instructions\n');
  process.exit(1);
}

console.log('✅ All environment variables are configured!\n');
console.log('💡 Remember to restart your dev server if you just added these values.\n');
