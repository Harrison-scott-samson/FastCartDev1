const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function testConnection(password) {
  try {
    console.log(`Testing with password: "${password}"...`);
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
      multipleStatements: true
    });
    console.log(`SUCCESS! Connected with password: "${password}"`);
    
    // Create schema
    console.log('Applying schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    await connection.query(schemaSql);
    console.log('Schema applied successfully!');
    
    await connection.end();
    return true;
  } catch (err) {
    console.log(`FAILED with password: "${password}" -`, err.message);
    return false;
  }
}

async function main() {
  const passwordsToTest = ['annaADMIN#123s', '', 'root', 'password'];
  
  for (const pwd of passwordsToTest) {
    const success = await testConnection(pwd);
    if (success) {
      console.log(`\n--- DB INITIALIZED SUCCESSFULLY ---`);
      console.log(`THE CORRECT PASSWORD IS: "${pwd}"`);
      process.exit(0);
    }
  }
  
  console.log('\n--- ERROR: All attempted passwords failed ---');
  process.exit(1);
}

main();
