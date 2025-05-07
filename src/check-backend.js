import axios from 'axios';

// En funktion för att kontrollera om backend-servern är tillgänglig
async function checkBackendConnection() {
  try {
    console.log('Kontrollerar backend-anslutning på http://localhost:8000/api...');
    
    // Försök ansluta till backend health check endpoint (eller liknande)
    const response = await axios.get('http://localhost:8000/api/health', {
      timeout: 5000 // 5 sekunder timeout
    });
    
    if (response.status === 200) {
      console.log('✅ Backend-anslutning OK!');
      console.log('Svar från servern:', response.data);
      return true;
    } else {
      console.log('❌ Backend-anslutning misslyckades med status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Kunde inte ansluta till backend:');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend-servern kör inte eller är inte tillgänglig på port 8000.');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') {
      console.log('   Nätverksfel - kan inte nå servern.');
    } else {
      console.log('   Fel:', error.message);
    }
    return false;
  }
}

// Testa med att logga in med testanvändare
async function testLogin() {
  try {
    console.log('\nTestar inloggning med testanvändare...');
    
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      username: 'testuser',
      password: 'password123'
    });
    
    if (response.data.token) {
      console.log('✅ Inloggning lyckades!');
      console.log('JWT Token:', response.data.token);
      return response.data.token;
    } else {
      console.log('⚠️ Inloggning misslyckades - ingen token returnerades');
      return null;
    }
  } catch (error) {
    console.log('❌ Inloggning misslyckades:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else {
      console.log('   Fel:', error.message);
    }
    return null;
  }
}

// Testa om vi kan hämta analytikdata
async function testAnalytics(token) {
  if (!token) return;
  
  try {
    console.log('\nTestar hämtning av analytikdata...');
    
    const response = await axios.get('http://localhost:8000/api/analytics/overview', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Analytikdata hämtades:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Kunde inte hämta analytikdata:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else {
      console.log('   Fel:', error.message);
    }
  }
}

// Huvudfunktion
async function main() {
  console.log('==== Backend Connection Test ====');
  
  const isConnected = await checkBackendConnection();
  
  if (isConnected) {
    const token = await testLogin();
    await testAnalytics(token);
  }
  
  console.log('\n==== Test avslutad ====');
}

// Kör testet
main().catch(console.error);