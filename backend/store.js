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
  return ads.find(
    a =>
      new Date(a.startAt).getTime() <= now &&
      now < new Date(a.endAt).getTime()
  );
}
