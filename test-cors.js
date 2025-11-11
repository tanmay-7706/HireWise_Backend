// Quick CORS and API test
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testCORS() {
  try {
    console.log('🧪 Testing CORS and API endpoints...\n');
    console.log('⚠️  Make sure the server is running with: npm run dev\n');

    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/`, {
      timeout: 5000
    });
    console.log('✅ Health check successful:', health.data.message);

    // Test signup
    console.log('\n2. Testing signup...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };

    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, testUser);
    console.log('✅ Signup successful:', signupResponse.data.message);
    
    const token = signupResponse.data.data.token;

    // Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test protected route
    console.log('\n4. Testing protected route...');
    const profileResponse = await axios.get(`${BASE_URL}/api/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Profile fetch successful:', profileResponse.data.data.name);

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused - Server is not running!');
      console.log('💡 Start the server first: npm run dev');
    } else {
      console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
  }
}

testCORS();