const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    
    // Handling received messages
    ws.on('message', (message) => {
        console.log('Received:', message);
        // Respond to the client
        ws.send('Message received: ' + message);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

// Handling the HTTP upgrade to WebSocket
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
