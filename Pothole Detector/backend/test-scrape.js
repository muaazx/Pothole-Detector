const pool = require('./src/db/index').default || require('./src/db/index');

async function cleanDatabase() {
  try {
    const res = await pool.query(
      `DELETE FROM news_alerts 
       WHERE LOWER(headline) NOT LIKE '%pothole%' 
         AND LOWER(headline) NOT LIKE '%crater%' 
         AND LOWER(headline) NOT LIKE '%road damage%'`
    );
    console.log(`Deleted ${res.rowCount} non-pothole news articles.`);

    const remaining = await pool.query(`SELECT headline FROM news_alerts ORDER BY published_at DESC`);
    console.log('Remaining articles count:', remaining.rows.length);
    console.log('Remaining headlines:', remaining.rows.map(r => r.headline));
  } catch (err) {
    console.error('Error cleaning database:', err);
  }
}

cleanDatabase();
