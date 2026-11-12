import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, length: data.length, preview: data.slice(0, 400) }));
    }).on('error', reject);
  });
}

async function main() {
  const r = '/mlt/week-1/lecture-1/';
  const res = await get(r);
  console.log(`${res.status === 200 ? '✓' : '✗'} ${res.path} -> ${res.status} (${res.length} bytes)`);
}

main();

