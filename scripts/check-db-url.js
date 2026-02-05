/**
 * Checks DATABASE_URL format without printing the actual URL.
 * Run: node scripts/check-db-url.js
 */
require('dotenv').config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

try {
  const parsed = new URL(url);
  const pathname = parsed.pathname || '';
  const dbName = pathname.replace(/^\//, '').split('/')[0];

  if (!dbName || dbName.length === 0) {
    console.error('❌ Database name is missing in the URL.');
    console.error(
      '   The URL must have a path like: ...mongodb.net/YOUR_DB_NAME?retryWrites=...'
    );
    console.error(
      '   Example: ...mongodb.net/text_enrichment?retryWrites=true&w=majority'
    );
    process.exit(1);
  }

  if (url.includes('mongodb+srv') || url.includes('mongodb://')) {
    console.log('✅ DATABASE_URL is set and includes a database name:', dbName);
  } else {
    console.error(
      '❌ DATABASE_URL does not look like a MongoDB URL (expected mongodb+srv:// or mongodb://)'
    );
    process.exit(1);
  }
} catch (e) {
  console.error('❌ DATABASE_URL is not a valid URL:', e.message);
  console.error('');
  console.error('   Most often this is caused by SPECIAL CHARACTERS IN YOUR PASSWORD.');
  console.error(
    '   If your MongoDB password contains any of:  @  #  :  /  ?  %  &  +  ='
  );
  console.error('   you must URL-encode them in the connection string:');
  console.error('   @ → %40   # → %23   : → %3A   / → %2F   ? → %3F   % → %25');
  console.error('');
  console.error(
    '   Or create a new Atlas user with a password that only uses letters and numbers.'
  );
  process.exit(1);
}
