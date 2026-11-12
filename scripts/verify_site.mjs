import http from 'http';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

const routes = [
  '/',
  '/mlt/',
  '/mad2/',
  '/bdm/',
  '/mlt/week-1/',
  '/mad2/week-1/',
  '/bdm/week-1/',
  '/mlt/week-1/lecture-1/',
  '/mad2/week-1/lecture-1/',
  '/bdm/week-1/lecture-1/',
  '/search-index.json',
  '/images/mlt/gradient_descent_contour.svg',
  '/images/bdm/relational_schema.svg',
];

function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          route,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          length: data.length,
          preview: data.slice(0, 300),
          data,
        });
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('Verifying all routes on localhost:3000...\n');
  let hasErrors = false;

  for (const r of routes) {
    try {
      const res = await fetchRoute(r);
      if (res.statusCode === 200) {
        console.log(`✓ [200 OK] ${r} (${res.length} bytes, ${res.contentType})`);
        
        // Specific checks
        if (r === '/mlt/week-1/lecture-1/') {
          const hasKatex = res.data.includes('katex');
          const hasKeyIdea = res.data.includes('Key Idea');
          const hasTutor = res.data.includes('Added by tutor');
          const hasCheck = res.data.includes('check:');
          const hasSvg = res.data.includes('gradient_descent_contour.svg');
          console.log(`   └─ MLT checks: KaTeX=${hasKatex}, KeyIdea=${hasKeyIdea}, AddedByTutor=${hasTutor}, CheckBadge=${hasCheck}, SVG=${hasSvg}`);
        }
        if (r === '/mad2/week-1/lecture-1/') {
          const hasFastApi = res.data.includes('FastAPI');
          const hasCodeBlock = res.data.includes('backend/app/main.py');
          const hasVue = res.data.includes('TaskList.vue');
          console.log(`   └─ MAD 2 checks: FastAPI=${hasFastApi}, CodeBlock=${hasCodeBlock}, Vue=${hasVue}`);
        }
        if (r === '/bdm/week-1/lecture-1/') {
          const hasOltp = res.data.includes('OLTP');
          const hasAcid = res.data.includes('ACID');
          const hasTable = res.data.includes('<table');
          const hasSvg = res.data.includes('relational_schema.svg');
          console.log(`   └─ BDM checks: OLTP=${hasOltp}, ACID=${hasAcid}, Table=${hasTable}, SVG=${hasSvg}`);
        }
        if (r === '/search-index.json') {
          const items = JSON.parse(res.data);
          console.log(`   └─ Search index items: ${items.length} records indexed`);
        }
      } else {
        console.error(`✗ [${res.statusCode}] ${r}`);
        hasErrors = true;
      }
    } catch (err) {
      console.error(`✗ [ERROR] ${r}:`, err.message);
      hasErrors = true;
    }
  }

  // Also verify out/ directory
  console.log('\nVerifying static export directory `out/`...');
  const outFiles = [
    'out/index.html',
    'out/mlt/index.html',
    'out/mad2/index.html',
    'out/bdm/index.html',
    'out/mlt/week-1/index.html',
    'out/mlt/week-1/lecture-1/index.html',
    'out/mad2/week-1/lecture-1/index.html',
    'out/bdm/week-1/lecture-1/index.html',
    'out/search-index.json',
    'out/images/mlt/gradient_descent_contour.svg',
    'out/images/bdm/relational_schema.svg',
  ];

  for (const f of outFiles) {
    if (fs.existsSync(f)) {
      const stats = fs.statSync(f);
      console.log(`✓ [FILE EXISTS] ${f} (${stats.size} bytes)`);
    } else {
      console.error(`✗ [MISSING FILE] ${f}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL ROUTES AND STATIC ASSETS VERIFIED WITH 100% SUCCESS!');
  }
}

verifyAll();

