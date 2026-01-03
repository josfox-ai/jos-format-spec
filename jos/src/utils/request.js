const https = require('https');
const http = require('http');

/**
 * Shared HTTP Request Helper
 */
exports.apiRequest = async (url, method, body, apiKey) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'jos-cli/1.0'
            }
        };

        if (apiKey) options.headers['Authorization'] = `Bearer ${apiKey}`;

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};
