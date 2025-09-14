// Simple test script to verify the visual aid API endpoint
const testVisualAidAPI = async () => {
  try {
    const response = await fetch('/api/generate-visual-aid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Water Cycle',
        language: 'en',
        grade: '5'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
    
    if (result.success && result.data) {
      console.log('✅ Visual Aid API is working correctly!');
      console.log('Topic:', result.data.topic);
      console.log('Description length:', result.data.description?.length || 0);
      console.log('Example length:', result.data.example?.length || 0);
      console.log('Image path:', result.data.image_path);
    } else {
      console.log('❌ API returned error status:', result.error);
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

// Run the test
testVisualAidAPI(); 