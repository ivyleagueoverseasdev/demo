const fs = require('fs');

async function checkUrls() {
  const content = fs.readFileSync('lib/data.ts', 'utf8');
  const urls = [...content.matchAll(/https:\/\/[^'\" ]+/g)].map(m => m[0]);
  const uniqueUrls = [...new Set(urls)].filter(u => u.startsWith('https://'));

  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        console.log('Failed:', url, res.status);
      }
    } catch(e) {
      console.log('Error:', url, e.message);
    }
  }
}
checkUrls();
