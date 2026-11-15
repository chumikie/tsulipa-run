'use strict';
// Composição vetorial com o mapa original do próprio jogo. Uso: node tools/og/gerar.cjs
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.join(__dirname,'../..');
const map=fs.readFileSync(path.join(root,'mapa-mundo.svg')).toString('base64');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#29114f"/><stop offset="1" stop-color="#6438a5"/></linearGradient><clipPath id="map"><rect x="490" y="158" width="680" height="434" rx="32"/></clipPath></defs>
<rect width="1200" height="630" fill="url(#bg)"/><circle cx="1100" cy="60" r="240" fill="#9161d0" opacity=".2"/>
<path d="M48 46H1152" stroke="#d3ff88" stroke-width="6"/>
<text x="48" y="124" fill="#fff" font-family="DejaVu Sans,sans-serif" font-size="66" font-weight="bold">TsuLiPa<tspan fill="#ffd65d">★</tspan>World</text>
<text x="51" y="176" fill="#dbcaff" font-family="DejaVu Sans,sans-serif" font-size="22">O seu mundo de Idol</text>
<g font-family="DejaVu Sans,sans-serif" fill="#fff"><text x="50" y="280" font-size="36" font-weight="bold">Crie. Cante.</text><text x="50" y="328" font-size="36" font-weight="bold">Jogue. Conviva.</text>
<text x="50" y="398" font-size="21" fill="#e9ddff">Seu Idol, seu pet, seu camarim.</text><text x="50" y="435" font-size="21" fill="#e9ddff">Uma cidade para se encontrar.</text>
<text x="50" y="540" font-size="18" fill="#d3ff88">GRÁTIS · SEM ANÚNCIOS</text><text x="50" y="580" font-size="19">tsulipa-world.vercel.app</text></g>
<rect x="483" y="151" width="694" height="448" rx="39" fill="#d7b9ff"/>
<image href="data:image/svg+xml;base64,${map}" x="490" y="158" width="680" height="434" preserveAspectRatio="xMidYMid slice" clip-path="url(#map)"/>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root,'og-world.png'));
