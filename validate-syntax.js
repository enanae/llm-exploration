#!/usr/bin/env node

/**
 * Syntax Validation Script
 * Run this before committing to ensure all JavaScript files have valid syntax
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating JavaScript syntax...\n');

const jsFiles = [
  'script.js',
  'utils.js'
];

let allValid = true;
let totalErrors = 0;

jsFiles.forEach(file => {
  console.log(`📁 Checking ${file}...`);
  
  try {
    // Read and parse the file to check syntax
    const content = fs.readFileSync(file, 'utf8');
    
    // Basic syntax check using eval (safe for syntax validation only)
    eval('(function() { ' + content + ' })');
    
    console.log(`✅ ${file} - Syntax OK`);
  } catch (error) {
    console.log(`❌ ${file} - Syntax Error:`);
    console.log(`   ${error.message}`);
    console.log('');
    allValid = false;
    totalErrors++;
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 All files passed syntax validation!');
  console.log('✅ Ready to commit');
  process.exit(0);
} else {
  console.log(`💥 ${totalErrors} file(s) failed syntax validation`);
  console.log('❌ Please fix syntax errors before committing');
  process.exit(1);
}