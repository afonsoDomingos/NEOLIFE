// Test script for lead creation and email notification

async function testLeadCreation() {
  console.log('🧪 Testing lead creation and email notification...\n');

  const testData = {
    country: 'mz',
    name: 'Test Lead',
    phone: '+258 84 123 4567',
    email: 'ofelia.josemachado@gmail.com',
    whatsapp: '+258 84 123 4567',
    theme: 'test-notification',
    source: 'test-script',
    campaign: 'email-test',
    notes: 'This is a test lead to verify email notifications are working',
  };

  console.log('📝 Sending test lead data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  try {
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Lead created successfully!');
      console.log('Lead ID:', data.leadId);
      console.log('\n📧 Check your email (ofelia.josemachado@gmail.com) for:');
      console.log('   - Admin notification email');
      console.log('   - Lead confirmation email');
      console.log('\n⏰ Emails may take 10-30 seconds to arrive.');
      console.log('📂 Also check spam/junk folders.');
    } else {
      console.log('❌ Failed to create lead:');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.log('\nMake sure the development server is running:');
    console.log('   npm run dev');
  }
}

// Run test
testLeadCreation();
