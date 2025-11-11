const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing HireWise Backend API...\n');
    console.log('Make sure the server is running with: npm run dev\n');

    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/`, { timeout: 5000 });
    console.log('Health check:', healthResponse.data.message);

    console.log('\n2. Testing user signup...');
    const signupData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };
    
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, signupData);
    console.log('Signup successful:', signupResponse.data.message);
    
    const token = signupResponse.data.data.token;

    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: signupData.email,
      password: signupData.password
    });
    console.log('Login successful:', loginResponse.data.message);

    console.log('\n4. Testing protected route...');
    const profileResponse = await axios.get(`${BASE_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Profile fetch successful:', profileResponse.data.data.name);

    console.log('\n5. Testing CRUD operations...');
    const crudResponse = await axios.post(`${BASE_URL}/api/test/crud`, {
      title: 'Test Document',
      description: 'This is a test document'
    });
    console.log('CRUD create successful:', crudResponse.data.message);

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Server is not running!');
      console.log('💡 Start the server first: npm run dev');
    } else {
      console.error('Test failed:', error.response?.data?.message || error.message);
    }
  }
}

testAPI();