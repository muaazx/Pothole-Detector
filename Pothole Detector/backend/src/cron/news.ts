import cron from 'node-cron';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pool from '../db/index';

const insertNewsAlert = async (headline: string, source_name: string, source_url: string, published_at: string | Date, matched_keywords: string) => {
  try {
    const textToAnalyze = headline.toLowerCase();

    // Strict Pothole Keyword Filter
    const potholeKeywords = ['pothole', 'potholes', 'road crater', 'road craters', 'crater', 'craters', 'road cavity', 'asphalt hole', 'road pit', 'road damage'];
    const isPotholeRelated = potholeKeywords.some(kw => textToAnalyze.includes(kw));

    if (!isPotholeRelated) {
      return false;
    }

    let alarm_level = 'informational';
    if (
      textToAnalyze.includes('death') || 
      textToAnalyze.includes('fatal') || 
      textToAnalyze.includes('injury') || 
      textToAnalyze.includes('crash') || 
      textToAnalyze.includes('tragedy') || 
      textToAnalyze.includes('killed') ||
      textToAnalyze.includes('died')
    ) {
      alarm_level = 'alarming';
    }

    const checkQuery = 'SELECT id FROM news_alerts WHERE source_url = $1 OR headline = $2';
    const checkResult = await pool.query(checkQuery, [source_url, headline]);
    
    if (checkResult.rows.length === 0) {
      const insertQuery = `
        INSERT INTO news_alerts (headline, source_name, source_url, published_at, alarm_level, matched_keywords)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(insertQuery, [headline, source_name, source_url, published_at, alarm_level, matched_keywords]);
      return true;
    }
  } catch (error) {
    console.error('Error inserting news:', error);
  }
  return false;
};

const scrapeGoogleNews = async () => {
  console.log('Scraping Google News RSS for Potholes...');
  try {
    const query = 'potholes OR pothole OR "road crater" OR "pothole accident"';
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    // Add User-Agent to avoid immediate blocking
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    // Load as XML
    const $ = cheerio.load(response.data, { xmlMode: true });
    const articles: any[] = [];
    
    $('item').each((i, el) => {
      if (i >= 20) return; // Limit to top 20 results
      
      const itemEl = $(el);
      const headline = itemEl.find('title').text().trim();
      const source_url = itemEl.find('link').text().trim();
      const source_name = itemEl.find('source').text().trim() || 'Google News';
      const pubDateStr = itemEl.find('pubDate').text().trim();
      
      if (headline && source_url) {
        articles.push({ headline, source_url, source_name, published_at: pubDateStr ? new Date(pubDateStr) : new Date() });
      }
    });

    let newCount = 0;
    for (const article of articles) {
      const inserted = await insertNewsAlert(article.headline, article.source_name, article.source_url, article.published_at, 'scraped_pothole');
      if (inserted) newCount++;
    }
    console.log(`Scraped ${articles.length} pothole articles from Google News RSS. Inserted ${newCount} new alerts.`);
  } catch (error) {
    console.error('Error scraping Google News:', (error as any).message);
  }
};

const fetchNewsAPI = async () => {
  try {
    console.log('Fetching pothole news from GNews API...');
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) return;

    const query = 'pothole OR potholes OR "road crater"';
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&apikey=${apiKey}&max=15`;

    const response = await axios.get(url);
    const articles = response.data.articles || [];

    let newCount = 0;
    for (const article of articles) {
      const inserted = await insertNewsAlert(
        article.title, 
        article.source.name, 
        article.url, 
        article.publishedAt, 
        'api_pothole'
      );
      if (inserted) newCount++;
    }
    console.log(`Fetched ${articles.length} pothole articles from API. Inserted ${newCount} new alerts.`);
  } catch (error) {
    console.error('Error in news API fetch:', (error as any).message);
  }
};

export const scrapeAlJazeeraNews = async () => {
  console.log('Scraping Al Jazeera News specifically for Potholes & Road Craters...');
  try {
    // Strict query targeting Al Jazeera pothole reports
    const query = 'site:aljazeera.com (potholes OR pothole OR "road crater" OR "road damage")';
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data, { xmlMode: true });
    const articles: any[] = [];

    $('item').each((i, el) => {
      if (i >= 15) return;
      const itemEl = $(el);
      const headline = itemEl.find('title').text().trim().replace(/ - Al Jazeera$/, '');
      const source_url = itemEl.find('link').text().trim();
      const pubDateStr = itemEl.find('pubDate').text().trim();

      if (headline && source_url) {
        articles.push({
          headline,
          source_name: 'Al Jazeera',
          source_url,
          published_at: pubDateStr ? new Date(pubDateStr) : new Date(),
        });
      }
    });

    let newCount = 0;
    for (const article of articles) {
      const inserted = await insertNewsAlert(
        article.headline,
        article.source_name,
        article.source_url,
        article.published_at,
        'aljazeera_potholes'
      );
      if (inserted) newCount++;
    }
    console.log(`Scraped ${articles.length} Al Jazeera articles. Inserted ${newCount} new pothole alerts.`);
    return newCount;
  } catch (error) {
    console.error('Error scraping Al Jazeera:', (error as any).message);
    return 0;
  }
};

export const fetchAllNews = async () => {
  await scrapeAlJazeeraNews();
  await fetchNewsAPI();
  await scrapeGoogleNews();
};

// Run every 6 hours
cron.schedule('0 */6 * * *', fetchAllNews);

export const startNewsCron = () => {
  console.log('News cron job scheduled (Pothole-Strict Al Jazeera + API + Scraping).');
  // Fetch immediately on startup
  fetchAllNews();
};


