import axios from 'axios';

const DOMAIN = process.env.NOVISIGN_STUDIO_DOMAIN;
const API_KEY = process.env.NOVISIGN_API_KEY;
const GROUP = process.env.NOVISIGN_ITEMS_GROUP;

export async function pushToNoviSign(ad) {
 const payload = {
  data: {
    update: {
      title: ad.title,
      imageUrl: ad.imageUrl,
      businessId: ad.businessId,
      validUntil: ad.endAt
    }
  }
};
const bodyJson = JSON.stringify(payload);
  const url = `https://${DOMAIN}/catalog/items/${GROUP}`;
console.log('➡️ Sending to NoviSign payload:', JSON.stringify(payload));
  const res = await axios.post(url, bodyJson, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    timeout: 8000
  }
);

  return res.status;
}
