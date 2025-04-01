const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5000;

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
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});