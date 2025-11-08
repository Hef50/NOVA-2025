/**
 * Stage 2 Frontend Setup Test Script
 * 
 * This script verifies that all Stage 2 requirements are met:
 * 1. React + Vite project with TypeScript
 * 2. Core dependencies installed
 * 3. Tailwind CSS configured
 * 4. shadcn/ui components added
 * 5. QueryClientProvider setup
 * 6. ChatView component created
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let allTestsPassed = true;

function testPass(message) {
  console.log(`✅ ${message}`);
}

function testFail(message) {
  console.log(`❌ ${message}`);
  allTestsPassed = false;
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function fileContains(filePath, searchString) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    return content.includes(searchString);
  } catch (error) {
    return false;
  }
}

function jsonContains(filePath, key, value) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const json = JSON.parse(content);
    
    // Navigate nested keys
    const keys = key.split('.');
    let current = json;
    for (const k of keys) {
      if (current[k] === undefined) return false;
      current = current[k];
    }
    
    if (value === undefined) return true; // Just check if key exists
    return current === value || (typeof current === 'string' && current.includes(value));
  } catch (error) {
    return false;
  }
}

console.log('\n🧪 Testing Stage 2: Frontend Setup\n');
console.log('=' .repeat(50));

// Test 1: React + Vite project structure
console.log('\n📦 Test 1: React + Vite Project Structure');
if (fileExists('package.json') && 
    fileExists('vite.config.ts') && 
    fileExists('index.html') &&
    fileExists('src/main.tsx') &&
    fileExists('src/App.tsx')) {
  testPass('React + Vite project structure exists');
} else {
  testFail('React + Vite project structure incomplete');
}

// Test 2: TypeScript configuration
console.log('\n📝 Test 2: TypeScript Configuration');
if (fileExists('tsconfig.json') && 
    fileExists('tsconfig.app.json') &&
    fileContains('tsconfig.app.json', '"@/*"')) {
  testPass('TypeScript configured with path aliases');
} else {
  testFail('TypeScript configuration incomplete');
}

// Test 3: Core dependencies
console.log('\n📚 Test 3: Core Dependencies');
const requiredDeps = [
  'react-router-dom',
  '@tanstack/react-query',
  'axios'
];

let allDepsInstalled = true;
for (const dep of requiredDeps) {
  if (jsonContains('package.json', `dependencies.${dep}`)) {
    testPass(`${dep} installed`);
  } else {
    testFail(`${dep} NOT installed`);
    allDepsInstalled = false;
  }
}

// Test 4: Tailwind CSS
console.log('\n🎨 Test 4: Tailwind CSS Setup');
if (jsonContains('package.json', 'devDependencies.tailwindcss') &&
    jsonContains('package.json', 'devDependencies.autoprefixer') &&
    jsonContains('package.json', 'devDependencies.postcss')) {
  testPass('Tailwind CSS dependencies installed');
} else {
  testFail('Tailwind CSS dependencies missing');
}

if (fileExists('tailwind.config.ts') || fileExists('tailwind.config.js')) {
  testPass('Tailwind config file exists');
} else {
  testFail('Tailwind config file missing');
}

if (fileExists('postcss.config.js') || fileExists('postcss.config.cjs')) {
  testPass('PostCSS config file exists');
} else {
  testFail('PostCSS config file missing');
}

if (fileContains('src/index.css', '@tailwind base') &&
    fileContains('src/index.css', '@tailwind components') &&
    fileContains('src/index.css', '@tailwind utilities')) {
  testPass('Tailwind directives in index.css');
} else {
  testFail('Tailwind directives missing from index.css');
}

// Test 5: shadcn/ui setup
console.log('\n🎭 Test 5: shadcn/ui Components');
if (jsonContains('package.json', 'dependencies.class-variance-authority') &&
    jsonContains('package.json', 'dependencies.clsx') &&
    jsonContains('package.json', 'dependencies.tailwind-merge') &&
    jsonContains('package.json', 'dependencies.tailwindcss-animate')) {
  testPass('shadcn/ui dependencies installed');
} else {
  testFail('shadcn/ui dependencies missing');
}

if (fileExists('src/lib/utils.ts') && fileContains('src/lib/utils.ts', 'cn')) {
  testPass('utils.ts with cn() helper exists');
} else {
  testFail('utils.ts missing or incomplete');
}

if (fileExists('src/components/ui/button.tsx')) {
  testPass('Button component exists');
} else {
  testFail('Button component missing');
}

if (fileExists('src/components/ui/input.tsx')) {
  testPass('Input component exists');
} else {
  testFail('Input component missing');
}

// Test 6: QueryClientProvider setup
console.log('\n🔄 Test 6: QueryClientProvider Setup');
if (fileContains('src/main.tsx', 'QueryClient') &&
    fileContains('src/main.tsx', 'QueryClientProvider') &&
    fileContains('src/main.tsx', 'new QueryClient()')) {
  testPass('QueryClientProvider configured in main.tsx');
} else {
  testFail('QueryClientProvider NOT configured in main.tsx');
}

// Test 7: App.tsx renders ChatView
console.log('\n📱 Test 7: App Component');
if (fileContains('src/App.tsx', 'ChatView')) {
  testPass('App.tsx imports and renders ChatView');
} else {
  testFail('App.tsx does NOT render ChatView');
}

// Test 8: ChatView component
console.log('\n💬 Test 8: ChatView Component');
if (fileExists('src/components/ChatView.tsx')) {
  testPass('ChatView.tsx exists');
  
  const chatViewChecks = [
    { check: 'useMutation', name: 'useMutation hook' },
    { check: 'axios.post', name: 'axios POST request' },
    { check: 'http://localhost:8000/chat_streaming', name: 'correct API endpoint' },
    { check: 'console.log', name: 'console.log for response' },
    { check: 'Input', name: 'Input component' },
    { check: 'Button', name: 'Button component' },
  ];
  
  for (const { check, name } of chatViewChecks) {
    if (fileContains('src/components/ChatView.tsx', check)) {
      testPass(`ChatView has ${name}`);
    } else {
      testFail(`ChatView missing ${name}`);
    }
  }
} else {
  testFail('ChatView.tsx does NOT exist');
}

// Test 9: Vite config with path aliases
console.log('\n⚙️  Test 9: Vite Configuration');
if (fileContains('vite.config.ts', 'resolve') &&
    fileContains('vite.config.ts', 'alias') &&
    fileContains('vite.config.ts', '@')) {
  testPass('Vite configured with path aliases');
} else {
  testFail('Vite path aliases NOT configured');
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('\n✅ All Stage 2 tests PASSED!');
  console.log('\n📋 Next steps to manually test:');
  console.log('   1. Start backend: cd backend && python -m uvicorn main:app --reload');
  console.log('   2. Start frontend: cd frontend && npm run dev');
  console.log('   3. Open http://localhost:5173 in your browser');
  console.log('   4. Type a message and click Send');
  console.log('   5. Open browser console (F12) and verify you see:');
  console.log('      {response: "This is a test from the backend"}');
  console.log('\n🎉 Stage 2 setup is complete!\n');
  process.exit(0);
} else {
  console.log('\n❌ Stage 2 setup is NOT complete. Please check errors above.\n');
  process.exit(1);
}

