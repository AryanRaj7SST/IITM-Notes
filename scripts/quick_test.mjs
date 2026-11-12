import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, length: data.length }));
    }).on('error', reject);
  });
}

async function main() {
  const routes = [
    '/',
    '/mlt/',
    '/mad2/',
    '/bdm/',
    '/mlt/week-1/',
    '/search-index.json'
  ];

  for (const r of routes) {
    const res = await get(r);
    console.log(`${res.status === 200 ? '✓' : '✗'} ${res.path} -> ${res.status} (${res.length} bytes)`);
  }
}

main();

