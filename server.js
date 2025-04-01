const http = require('http');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const os = require('os');

const PORT = 5000;

// Get server IP address for local network access
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0'; // Default if no IP found
}

// Generate QR code SVG 
async function generateQRCode(text) {
    try {
        return await QRCode.toString(text, {
            type: 'svg',
            margin: 1,
            color: {
                dark: '#5C6BC0',
                light: '#ffffff'
            }
        });
    } catch (err) {
        console.error('QR Code generation error:', err);
        return '<svg width="100" height="100"><text x="10" y="50" fill="red">QR Error</text></svg>';
    }
}

// Determine the server URL
let serverUrl = `http://${getLocalIPAddress()}:${PORT}`;
// When running on Replit, use the Replit URL
if (process.env.REPLIT_SLUG) {
    serverUrl = `https://${process.env.REPLIT_SLUG}.${process.env.REPLIT_OWNER}.repl.co`;
}

// Create and start the server
const server = http.createServer(async (req, res) => {
    console.log(`Request received: ${req.url}`);
    
    if (req.url === '/' || req.url === '/index.html') {
        // Serve index.html
        fs.readFile(path.join(__dirname, 'index.html'), async (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Error loading index.html: ${err.message}`);
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/qrcode') {
        // Serve QR code
        try {
            const qrSvg = await generateQRCode(serverUrl);
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(qrSvg);
        } catch (err) {
            res.writeHead(500);
            res.end(`QR code generation error: ${err.message}`);
        }
    } else if (req.url === '/qrcode.html') {
        // Serve QR code page
        const qrSvg = await generateQRCode(serverUrl);
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Face Analysis App - QR Code</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background-color: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    width: 100%;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                .qr-container {
                    margin: 20px 0;
                }
                .url {
                    margin-top: 15px;
                    background-color: #eef2ff;
                    padding: 10px;
                    border-radius: 4px;
                    word-break: break-all;
                }
                .button {
                    background-color: #5C6BC0;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                    text-decoration: none;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Scan QR Code to Access the Face Analysis App</h1>
                <div class="qr-container">
                    ${qrSvg}
                </div>
                <div class="url">
                    ${serverUrl}
                </div>
                <a href="/" class="button">Back to App</a>
            </div>
        </body>
        </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
    console.log(`Access QR code at http://0.0.0.0:${PORT}/qrcode.html`);
});