// API configuration
const API_URL = 'http://localhost:5000/api';

async function sendContactForm(data) {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    return { 
      success: false, 
      message: 'Koneksi ke server gagal' 
    };
  }
}