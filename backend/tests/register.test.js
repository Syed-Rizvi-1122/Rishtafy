import fetch from 'node-fetch';

const testRegistration = async () => {
  const testUser = {
    email: `rishtafy_test_${Date.now()}@gmail.com`,
    password: 'password123',
    full_name: 'Test Candidate',
    role: 'candidate'
  };

  console.log(`Attempting to register: ${testUser.email}`);

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();

    if (response.status === 201) {
      console.log('✅ Success: API returned 201 Created');
      console.log('User ID:', data.user.id);
    } else {
      console.error('❌ Failed: API returned', response.status, data.error);
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
};

testRegistration();
