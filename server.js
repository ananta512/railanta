const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Handling requests and passing Base64 string as path
app.get('/', (req, res) => {
    res.send('WebSocket Proxy Server is running');
});

// Upgrade the HTTP connection to WebSocket
app.server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
    const path = request.url;  // The Base64 string will be in the URL path
    console.log(`Received WebSocket request with path: ${path}`);
    
    // Decode Base64 string from path
    const decodedData = Buffer.from(path.substring(1), 'base64').toString('utf-8');
    console.log('Decoded data:', decodedData);  // Outputs the original data

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
