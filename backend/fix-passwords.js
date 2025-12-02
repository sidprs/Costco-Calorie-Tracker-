// Run this script once to fix the test user passwords
// Usage: node fix-passwords.js

const bcrypt = require('bcrypt');
const pool = require('./db');

const SALT_ROUNDS = 10;

async function fixPasswords() {
  try {
    console.log('Connecting to database...');
    
    // Get all users with placeholder passwords
    const result = await pool.query("SELECT userid, email FROM Users WHERE password LIKE 'hashed_password_%'");
    
    console.log(`Found ${result.rows.length} users with placeholder passwords\n`);
    
    for (const user of result.rows) {
      // Create a simple password: "password" + their user ID
      const newPassword = `password${user.userid}`;
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      
      await pool.query({
        text: 'UPDATE Users SET password = $1 WHERE userid = $2',
        values: [hashedPassword, user.userid]
      });
      
      console.log(`Updated: ${user.email} -> password: "${newPassword}"`);
    }
    
    console.log('\n✅ All passwords updated successfully!');
    console.log('\nYou can now log in with:');
    console.log('  john.smith@email.com / password1');
    console.log('  sarah.j@email.com / password2');
    console.log('  etc...');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixPasswords();

