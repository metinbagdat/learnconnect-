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
    console.error('✗ Database connection failed:', error.message);
    if (error.message.includes('disabled')) {
      console.error('\n⚠️  DATABASE ENDPOINT IS MANUALLY DISABLED');
      console.error('\nThis requires manual re-enabling:');
      console.error('Visit: https://console.neon.tech/');
      console.error('Sign in with the account that created this database');
      console.error('Find project "neondb" → Settings → Resume endpoint');
    }
    process.exit(1);
  }
}

wakeDatabase();
