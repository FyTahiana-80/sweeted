const os = require('os');
const fs = require('fs');
const path = require('path');

function getActiveWifiIp() {
  const interfaces = os.networkInterfaces();

  // 1. Chercher d'abord spécifiquement l'interface Wi-Fi
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (/wi-fi|wifi|wlan|wireless/i.test(name)) {
      for (const addr of addrs) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return { ip: addr.address, iface: name };
        }
      }
    }
  }

  // 2. Si pas de Wi-Fi, chercher une interface Ethernet / LAN physique
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (/virtual|vmware|vethernet|loopback|pseudo/i.test(name)) continue;
    for (const addr of addrs) {
      if (
        addr.family === 'IPv4' &&
        !addr.internal &&
        !addr.address.startsWith('169.254.') &&
        !addr.address.startsWith('192.168.56.')
      ) {
        return { ip: addr.address, iface: name };
      }
    }
  }

  return { ip: 'localhost', iface: 'fallback' };
}

function updateEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  const { ip, iface } = getActiveWifiIp();
  const port = process.env.PORT || 3000;
  const newApiUrl = `http://${ip}:${port}/api`;

  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
  }

  const regex = /^EXPO_PUBLIC_API_URL=.*$/m;
  const newLine = `EXPO_PUBLIC_API_URL=${newApiUrl}`;

  let newContent;
  if (regex.test(content)) {
    newContent = content.replace(regex, newLine);
  } else {
    newContent = content ? `${content.trim()}\n${newLine}\n` : `${newLine}\n`;
  }

  fs.writeFileSync(envPath, newContent, 'utf8');
  console.log(`\x1b[32m[Sweeted]\x1b[0m IP Wi-Fi active (${iface}) : \x1b[36m${ip}\x1b[0m`);
  console.log(`\x1b[32m[Sweeted]\x1b[0m EXPO_PUBLIC_API_URL mis à jour -> \x1b[33m${newApiUrl}\x1b[0m\n`);
}

updateEnv();
