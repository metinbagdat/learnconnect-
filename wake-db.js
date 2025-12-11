import pg from 'pg';
const { Client } = pg;

async function wakeDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('✓ Database connected successfully!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✓ Database is AWAKE and ready!');
    console.log('Current time:', result.rows[0].current_time);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Database connection failed');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message || 'No error message');
    console.error('Error code:', error.code || 'No error code');
    
    if (error.message && error.message.includes('disabled')) {
      console.error('\n⚠️  DATABASE ENDPOINT IS MANUALLY DISABLED');
      console.error('\nThis requires manual re-enabling:');
      console.error('Visit: https://console.neon.tech/');
      console.error('Sign in with the account that created this database');
      console.error('Find project "neondb" → Settings → Resume endpoint');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('\n⚠️  NETWORK CONNECTION ISSUE');
      console.error('Check your internet connection and Neon endpoint status');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  CONNECTION REFUSED');
      console.error('The database endpoint may be paused or unavailable');
      console.error('Check Neon console: https://console.neon.tech/');
    } else {
      console.error('\nFull error:', error);
    }
    process.exit(1);
  }
}

wakeDatabase();
