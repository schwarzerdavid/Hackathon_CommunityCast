import { getActiveAd } from './store.js';
import { pushToNoviSign } from './novisign.js';
import crypto from 'crypto';

let lastHash = null;

setInterval(async () => {
  const ad = getActiveAd();

  // Build a hash ONLY for change detection
  const stateKey = ad ? JSON.stringify(ad) : 'NO_ACTIVE_AD';
  const hash = crypto.createHash('sha1').update(stateKey).digest('hex');

  // No change → do nothing
  if (hash === lastHash) return;

  lastHash = hash;

  // 🚫 CRITICAL: never call NoviSign when no ad exists
  if (!ad) {
    console.log('ℹ️ No active ad — nothing sent to NoviSign');
    return;
  }

  // ✅ Only here do we push
  try {
    await pushToNoviSign(ad);
    console.log('✅ Pushed to NoviSign:', ad.title);
  } catch (err) {
    console.error('❌ NoviSign push error:', err?.response?.data || err.message);
  }

}, 5000);
