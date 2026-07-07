const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const baseUrl = 'https://promting.apprentice.cyou';
const email = 'eka.ckp16799@gmail.com';
const password = 'INDAH1234';

const makeRequest = (method, pathUrl, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(pathUrl, baseUrl);
    const payload = body ? JSON.stringify(body) : '';

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            rawBody: data,
          });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(payload);
    }
    req.end();
  });
};

const uploadFileToImageKit = (fileBuffer, fileName, folder = '/promptstudio/styles') => {
  return new Promise((resolve, reject) => {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
    if (!privateKey) {
      return reject(new Error('IMAGEKIT_PRIVATE_KEY not found in .env'));
    }

    const auth = Buffer.from(privateKey + ':').toString('base64');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    
    const header1 = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const middle = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="fileName"\r\n\r\n${fileName}\r\n--${boundary}\r\nContent-Disposition: form-data; name="folder"\r\n\r\n${folder}\r\n--${boundary}\r\nContent-Disposition: form-data; name="useUniqueFileName"\r\n\r\ntrue\r\n--${boundary}--\r\n`;

    const payload = Buffer.concat([
      Buffer.from(header1, 'utf8'),
      fileBuffer,
      Buffer.from(middle, 'utf8')
    ]);

    const options = {
      hostname: 'upload.imagekit.io',
      port: 443,
      path: '/api/v2/files/upload',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode !== 200) {
            reject(new Error(parsed.message || 'ImageKit upload failed.'));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
};

const runMigration = async () => {
  console.log('--- STARTING REMOTE DATABASE SEED / MIGRATION (IMAGEKIT INTEGRATION) ---');
  
  let token = null;

  // 1. Try Register
  console.log('Attempting to register user...');
  const regRes = await makeRequest('POST', '/api/auth/register', {
    name: 'Eka',
    email: email,
    password: password
  });

  console.log('Register Response Status:', regRes.statusCode);

  // 2. Login to get Access Token
  console.log('Logging in...');
  const loginRes = await makeRequest('POST', '/api/auth/login', {
    email: email,
    password: password
  });

  if (loginRes.statusCode !== 200) {
    console.error('Login failed! Status:', loginRes.statusCode, loginRes.body || loginRes.rawBody);
    return;
  }

  token = loginRes.body.accessToken;
  console.log('Login successful. Obtained access token.');

  const authHeaders = {
    'Authorization': `Bearer ${token}`
  };

  // 3. Fetch existing styles
  console.log('Fetching current design styles...');
  const stylesRes = await makeRequest('GET', '/api/options/styles', null, authHeaders);
  if (stylesRes.statusCode !== 200) {
    console.error('Failed to get design styles. Status:', stylesRes.statusCode);
    return;
  }

  const existingStyles = stylesRes.body || [];
  console.log(`Found ${existingStyles.length} design styles.`);

  // 4. Delete existing styles
  for (const style of existingStyles) {
    console.log(`Deleting design style: ${style.name} (${style.id})...`);
    const delRes = await makeRequest('DELETE', `/api/options/styles/${style.id}`, null, authHeaders);
    console.log(`Delete status for "${style.name}":`, delRes.statusCode);
  }

  // 5. Upload files to ImageKit and Seed
  const stylesToSeed = [
    {
      name: 'Minimalist Modern',
      filename: 'minimalist_modern.png',
      description: 'Desain bersih dengan banyak ruang kosong, palet warna monokromatik, dan tipografi sans-serif.',
      prompt: 'Desain datar (2D) sederhana, bersih dengan banyak ruang kosong, palet warna minimalis (seperti putih, abu-abu muda, biru tua/navy), tipografi sans-serif bersih, tanpa objek 3D, tanpa efek 3D, ilustrasi datar bergaya flat art, rapi, minimalis modern, latar belakang bersih.'
    },
    {
      name: 'Vibrant & Bold',
      filename: 'vibrant_bold.png',
      description: 'Menggunakan warna kontras yang berani, elemen grafis abstrak, dan tata letak dinamis.',
      prompt: 'Menggunakan warna kontras yang sangat berani (seperti neon, kuning menyala, merah, ungu), elemen grafis abstrak, tata letak dinamis, ilustrasi modern 2D, tipografi tebal (bold) yang mencolok, tanpa objek 3D.'
    },
    {
      name: 'Corporate Elegant',
      filename: 'corporate_elegant.png',
      description: 'Gaya formal dengan warna biru/biru dongker, struktur rapi, cocok untuk presentasi bisnis.',
      prompt: 'Gaya profesional formal, warna biru navy, abu-abu, dan putih, tata letak terstruktur rapi, ikon bisnis datar, tipografi bersih, elegan dan terpercaya, tanpa objek 3D.'
    },
    {
      name: 'Playful & Colorful',
      filename: 'playful_colorful.png',
      description: 'Gaya ilustratif dengan warna-warni cerah, cocok untuk audiens muda atau edukatif.',
      prompt: 'Gaya ilustratif kartun 2D yang ceria, warna-warni cerah dan hangat, cocok untuk anak-anak atau audiens muda, ikon lucu, tipografi ramah dan mudah dibaca, tanpa objek 3D.'
    },
    {
      name: 'Retro Vintage',
      filename: 'retro_vintage.png',
      description: 'Estetika klasik 90-an dengan tekstur kertas grain, warna pastel pop, dan font serif klasik.',
      prompt: 'Estetika klasik tahun 90-an (90s retro), tekstur kertas grain/grunge halus, palet warna pastel pop hangat yang pudar, tipografi serif klasik yang elegan, gaya ilustrasi datar retro, tanpa objek 3D.'
    },
    {
      name: 'Cyberpunk',
      filename: 'cyberpunk.png',
      description: 'Tema futuristik gelap dengan aksen neon menyala (cyan, pink) dan elemen garis grid teknologi.',
      prompt: 'Tema futuristik gelap (dark cyberpunk style), latar belakang hitam/abu-abu sangat gelap, aksen lampu neon menyala terang berwarna cyan, pink, dan ungu, elemen garis grid teknologi, ilustrasi HUD digital futuristik 2D.'
    },
    {
      name: 'Neo-Brutalist',
      filename: 'neobrutalist.png',
      description: 'Desain dengan border hitam tebal, warna flat kontras, box teks bertumpuk, dan tata letak asimetris.',
      prompt: 'Desain neo-brutalisme, garis tepi (border) hitam tebal dan tegas, warna datar (flat colors) kontras tinggi yang mentah, kotak teks bertumpuk (shadow box offset), tata letak asimetris yang berani, tanpa gradasi, tanpa 3D.'
    },
    {
      name: 'Soft Pastel Dream',
      filename: 'pastel_dream.png',
      description: 'Gaya lembut dengan gradasi pastel halus (lavender, mint, cream) dan bentuk bulat yang menenangkan.',
      prompt: 'Gaya visual lembut menenangkan, gradasi warna pastel halus (seperti lavender, mint, cream, peach), bentuk geometris bulat dengan sudut melengkung halus (rounded shapes), tipografi sans-serif minimalis, bersih dan bersih, tanpa efek kasar.'
    },
    {
      name: 'Hand-Drawn Sketch',
      filename: 'handdrawn_sketch.png',
      description: 'Desain doodle sketsa tangan artistik dengan garis tinta hitam dan sapuan warna marker organik.',
      prompt: 'Ilustrasi sketsa tangan artistik (hand-drawn doodle art), garis luar (outline) tinta hitam organik, sapuan warna marker air (watercolor/marker wash) yang tidak rapi secara sengaja, tipografi bergaya tulisan tangan yang kasual.'
    },
    {
      name: 'Geometric Abstract',
      filename: 'geometric_abstract.png',
      description: 'Gaya seni abstrak Swiss dengan perpaduan lingkaran, segitiga, dan tata letak grid presisi.',
      prompt: 'Seni abstrak geometris (Swiss design style), perpaduan bentuk lingkaran, segitiga, dan persegi, tata letak grid presisi tinggi, warna solid kontras tinggi, tipografi sans-serif tebal (bold), tanpa gradasi.'
    },
    {
      name: 'Infographic Minimalist',
      filename: 'infographic_minimalist.png',
      description: 'Tata letak visual untuk menyajikan data dengan diagram bersih, timeline, dan fokus kontras tinggi.',
      prompt: 'Tata letak infografis minimalis terstruktur, diagram dan bagan bersih, garis waktu (timeline) sederhana, ikon data datar (2D), fokus pada keterbacaan informasi tinggi, warna latar belakang bersih (light background).'
    },
    {
      name: 'Manga / Comic Art',
      filename: 'manga_comic.png',
      description: 'Desain komik hitam putih bergaya Jepang dengan speed lines, tekstur dot halftone, dan panel komik.',
      prompt: 'Seni komik manga hitam putih (Japanese manga style), menggunakan tekstur dot halftone untuk bayangan, garis aksi (speed lines), garis luar tinta hitam tebal, pembagian panel komik, tipografi komik ekspresif.'
    },
    {
      name: 'Techno Sci-Fi',
      filename: 'techno_scifi.png',
      description: 'Antarmuka futuristik dengan bingkai UI berpola, HUD biru bercahaya, dan font digital teknis.',
      prompt: 'Desain antarmuka fiksi ilmiah (Sci-Fi HUD), latar belakang gelap, bingkai UI berpola sirkuit, elemen indikator bercahaya biru/cyan, tipografi digital teknis, diagram radar 2D datar.'
    },
    {
      name: 'Glassmorphism Elegant',
      filename: 'glassmorphism_elegant.png',
      description: 'Efek kartu kaca transparan blur di atas gradien warna premium, tipografi modern berkelas.',
      prompt: 'Desain glassmorphism elegan, kartu overlay kaca transparan dengan efek buram (frosted glass blur), bayangan halus di belakang kartu, latar belakang gradien warna premium yang dinamis, tipografi sans-serif modern berkelas.'
    },
    {
      name: 'Organic Nature',
      filename: 'botanical_organic.png',
      description: 'Warna bumi hangat (terracotta, olive) yang menenangkan dikombinasikan sketsa daun/bunga dan font serif.',
      prompt: 'Desain organik estetika alam (nature botanical), warna bumi hangat yang menenangkan (terracotta, olive green, beige, mustard), sketsa garis tanaman daun dan bunga yang elegan, tipografi serif klasik yang artistik.'
    }
  ];

  console.log('Uploading style images to ImageKit and seeding design styles...');
  for (const style of stylesToSeed) {
    const localImgPath = path.join(__dirname, '../assets/images/styles', style.filename);
    let imageUrl = '';

    try {
      if (fs.existsSync(localImgPath)) {
        console.log(`Uploading local asset "${style.filename}" to ImageKit...`);
        const fileBuffer = fs.readFileSync(localImgPath);
        const uniqueName = `style_${Date.now()}_${style.filename}`;
        const uploadResult = await uploadFileToImageKit(fileBuffer, uniqueName);
        imageUrl = uploadResult.url;
        console.log(`Uploaded! Remote URL: ${imageUrl}`);
      } else {
        console.warn(`Local asset not found: ${localImgPath}. Seeding without image.`);
      }
    } catch (uploadErr) {
      console.error(`Failed to upload ${style.filename}:`, uploadErr);
    }

    const payload = {
      name: style.name,
      description: style.description,
      prompt: style.prompt,
      imageUrl: imageUrl || null
    };

    console.log(`Seeding style: ${style.name}...`);
    const createRes = await makeRequest('POST', '/api/options/styles', payload, authHeaders);
    if (createRes.statusCode === 201) {
      console.log(`Successfully seeded: ${style.name}`);
    } else {
      console.error(`Failed to seed: ${style.name}. Status:`, createRes.statusCode, createRes.body || createRes.rawBody);
    }
  }

  console.log('--- REMOTE DATABASE SEED / MIGRATION COMPLETE ---');
};

runMigration();
