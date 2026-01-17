import axios from 'axios';

const DOMAIN = process.env.NOVISIGN_STUDIO_DOMAIN;
const API_KEY = process.env.NOVISIGN_API_KEY;
const GROUP = process.env.NOVISIGN_ITEMS_GROUP;

console.log('🔍 NoviSign Config:', {
  DOMAIN,
  API_KEY: API_KEY ? `${API_KEY.substring(0, 8)}...` : 'NOT SET',
  GROUP
});

export async function pushToNoviSign(payload) {
  const bodyJson = JSON.stringify({
    data: payload
  });

  const url = `https://${DOMAIN}/catalog/items/${GROUP}`;
  console.log('➡️ Sending to NoviSign payload:', JSON.stringify(payload, null, 2));

  const res = await axios.post(url, bodyJson, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    timeout: 8000
  });

  return res.status;
}
