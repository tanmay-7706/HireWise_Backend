// Start server and run tests
const { spawn } = require('child_process');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function waitForServer(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${BASE_URL}/`, { timeout: 2000 });
      return true;
    } catch (error) {
      console.log(`⏳ Waiting for server... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

async function runTests() {
  console.log('🚀 Starting server and running tests...\n');

  // Start the server
  const server = spawn('node', ['server.js'], {
    stdio: 'pipe',
    detached: false
  });

  server.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  server.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  // Wait for server to be ready
  console.log('\n⏳ Waiting for server to start...');
  const serverReady = await waitForServer();

  if (!serverReady) {
    console.error('❌ Server failed to start');
    server.kill();
    process.exit(1);
  }

  console.log('\n✅ Server is ready! Running tests...\n');

  // Run the test
  try {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };

    console.log('1. Testing signup...');
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, testUser);
    console.log('✅ Signup successful');

    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }

  // Clean up
  server.kill();
  process.exit(0);
}

runTests();