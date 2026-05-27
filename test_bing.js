import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function testBing(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
  const html = await res.text();
  const $ = cheerio.load(html);
  const images = [];
  $('a.iusc').each((i, el) => {
    const m = $(el).attr('m');
    if (m) {
      try {
        const data = JSON.parse(m);
        if (data.murl) images.push(data.murl);
      } catch(e) {}
    }
  });
  console.log(images.slice(0, 5));
}
testBing('ice cream');
