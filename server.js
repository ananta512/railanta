const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = 3000;

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    ws.on('close', () => {
        console.log('Connection closed');
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket Proxy Server is running');
});

app.server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
