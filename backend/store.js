import crypto from 'crypto';

const ads = [];

export function addAd({ businessId, title, imageUrl, startAt, endAt }) {
  const ad = {
    id: crypto.randomUUID(),
    businessId,
    title,
    imageUrl,
    startAt,
    endAt,
    createdAt: new Date().toISOString(),
  };
  ads.push(ad);
  console.log("addAd: saved ad: " + JSON.stringify(ad, null, 2));
  console.log("addAd: Number of ads: " + ads.length);

  return ad;
}

export function getAdsSnapshot() {
  const now = Date.now();
  return {
    active: ads.filter(
      a =>
        new Date(a.startAt).getTime() <= now &&
        now < new Date(a.endAt).getTime()
    ),
    upcoming: ads.filter(a => new Date(a.startAt).getTime() > now),
  };
}

export function getActiveAd() {
  const now = Date.now();
  console.log("getActiveAd: Number of ads: " + ads.length);
  return ads.find(
    a =>
      new Date(a.startAt).getTime() <= now &&
      now < new Date(a.endAt).getTime()
  );
}
