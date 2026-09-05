import { query } from '../../db';
import https from 'https';

export const getGroqApiKey = async (): Promise<string> => {
  try {
    const result = await query(`
      SELECT api_key FROM groq_api_keys
      WHERE is_active = 1 OR is_active = true
      ORDER BY error_count ASC, last_used_at ASC
      LIMIT 1
    `);
    if (result.rows.length > 0) {
      const bestKey = result.rows[0].api_key;
      await query(
        'UPDATE groq_api_keys SET last_used_at = NOW() WHERE api_key = ?',
        [bestKey]
      );
      return bestKey;
    }
  } catch (e) {
    console.error('Gagal mengambil groq_api_keys:', e);
  }

  try {
    const fallback = await query("SELECT value FROM app_config WHERE `key` = 'groq_api_key'");
    if (fallback.rows.length > 0) {
      return fallback.rows[0].value;
    }
  } catch (_) {}
  return '';
};

export const markGroqApiKeyFailed = async (apiKey: string) => {
  try {
    await query(
      'UPDATE groq_api_keys SET error_count = error_count + 1 WHERE api_key = ?',
      [apiKey]
    );
  } catch (e) {
    console.error('Gagal update error_count:', e);
  }
};

export const callGroqApiWithRotation = (promptInstruction: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let result: string | null = null;
    let retryCount = 0;

    while (retryCount < 3 && result === null) {
      const apiKey = await getGroqApiKey();
      if (!apiKey || apiKey.startsWith('gsk_YOUR_GROQ_API_KEY')) {
        return reject(new Error('Groq API Key belum dikonfigurasi di database.'));
      }

      try {
        const payload = JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: promptInstruction }],
          temperature: 0.72,
        });

        const options = {
          hostname: 'api.groq.com',
          port: 443,
          path: '/openai/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          timeout: 18000,
        };

        const resPromise = new Promise<{ statusCode?: number; body: string }>((resResolve, resReject) => {
          const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resResolve({ statusCode: res.statusCode, body }));
          });

          req.on('timeout', () => {
            req.destroy();
            resReject(new Error('Request Timeout'));
          });

          req.on('error', (err) => resReject(err));
          req.write(payload);
          req.end();
        });

        const response = await resPromise;

        if (response.statusCode === 200) {
          const data = JSON.parse(response.body);
          result = data.choices[0].message.content as string;
        } else {
          await markGroqApiKeyFailed(apiKey);
          retryCount++;
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (e) {
        await markGroqApiKeyFailed(apiKey);
        retryCount++;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    if (result) {
      resolve(result);
    } else {
      reject(new Error('Gagal memanggil Groq API setelah rotasi key.'));
    }
  });
};

export const callGroqVisionApiWithRotation = (
  messages: any[],
  customModel?: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let result: string | null = null;
    let retryCount = 0;
    let modelToUse = customModel || 'llama-3.2-11b-vision-preview';
    if (modelToUse === 'llama-4-scout-17b-16e-instruct') {
      modelToUse = 'llama-3.2-11b-vision-preview';
    }

    while (retryCount < 3 && result === null) {
      const apiKey = await getGroqApiKey();
      if (!apiKey || apiKey.startsWith('gsk_YOUR_GROQ_API_KEY')) {
        return reject(new Error('Groq API Key belum dikonfigurasi di database.'));
      }

      try {
        const payload = JSON.stringify({
          model: modelToUse,
          messages: messages,
          temperature: 0.72,
        });

        const options = {
          hostname: 'api.groq.com',
          port: 443,
          path: '/openai/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          timeout: 25000,
        };

        const resPromise = new Promise<{ statusCode?: number; body: string }>((resResolve, resReject) => {
          const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resResolve({ statusCode: res.statusCode, body }));
          });

          req.on('timeout', () => {
            req.destroy();
            resReject(new Error('Request Timeout'));
          });

          req.on('error', (err) => resReject(err));
          req.write(payload);
          req.end();
        });

        const response = await resPromise;

        if (response.statusCode === 200) {
          const data = JSON.parse(response.body);
          result = data.choices[0].message.content as string;
        } else {
          const parsedBody = JSON.parse(response.body || '{}');
          const errorMsg = parsedBody.error?.message || '';
          if (modelToUse === customModel && (response.statusCode === 400 || response.statusCode === 404 || errorMsg.includes('model') || errorMsg.includes('not found'))) {
            console.warn(`Model ${customModel} tidak tersedia di Groq, beralih ke llama-3.2-11b-vision-preview...`);
            modelToUse = 'llama-3.2-11b-vision-preview';
          } else {
            await markGroqApiKeyFailed(apiKey);
          }
          retryCount++;
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (e) {
        await markGroqApiKeyFailed(apiKey);
        retryCount++;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    if (result) {
      resolve(result);
    } else {
      reject(new Error('Gagal memanggil Groq Vision API setelah rotasi key.'));
    }
  });
};
