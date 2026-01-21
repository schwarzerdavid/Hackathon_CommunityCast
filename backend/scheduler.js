import crypto from 'crypto';
import { pushToNoviSign } from './novisign.js';
import Advertisement from './models/Advertisement.js';

let currentAdIndex = 0;

/**
 * Get all currently active advertisements from database
 */
async function getActiveAds() {
  const now = new Date();

  const ads = await Advertisement.find({
    start_time: { $lte: now },
    end_time: { $gt: now },
    $or: [
      { stop_time: null },
      { stop_time: { $gt: now } }
    ]
  }).populate('business_id', 'name').sort({ created_at: 1 }); // Sort by creation time for consistent order

  return ads;
}

setInterval(async () => {
  try {
    const ads = await getActiveAds();
    console.log(`📊 Found ${ads.length} active ads at ${new Date().toISOString()}`);
    if (ads.length > 0) {
      console.log('Active ad IDs:', ads.map(a => a._id));
    }

    // Always send to NoviSign every 5 seconds
    if (!ads || ads.length === 0) {
      console.log('ℹ️  No active ads - sending empty payload');
      // No active ads - send empty payload
      const payload = {
        ad: {
          imageUrl: 'uploads/no-ad.png',
        }
      };

      await pushToNoviSign(payload);
      console.log('ℹ️  Sent to NoviSign: No active ads (empty payload)');
      currentAdIndex = 0; // Reset index when no ads
    } else {
      // Rotate through ads - send one at a time
      // Reset index if it's out of bounds (in case ads were deleted)
      if (currentAdIndex >= ads.length) {
        currentAdIndex = 0;
      }

      const currentAd = ads[currentAdIndex];

      const payload = {
        ad: {
          id: currentAd._id,
          businessId: currentAd.business_id._id,
          businessName: currentAd.business_id.name,
          title: currentAd.title,
          imageUrl: currentAd.image_path,
          startAt: currentAd.start_time,
          endAt: currentAd.end_time
        }
      };

      console.log(`✅ Pusing to NoviSign [${currentAdIndex + 1}/${ads.length}]: ${currentAd.title}`);
      await pushToNoviSign(payload);
      console.log(`✅ Pushed to NoviSign [${currentAdIndex + 1}/${ads.length}]: ${currentAd.title}`);

      // Move to next ad (loop back to start if at end)
      currentAdIndex = (currentAdIndex + 1) % ads.length;
    }
  } catch (err) {
    console.error('❌ Scheduler error:', err?.response?.data || err.message);
  }
}, 5000);

console.log('⏰ Scheduler started - checking for active ads every 5 seconds');
