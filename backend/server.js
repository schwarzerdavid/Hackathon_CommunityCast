import express from 'express';
import 'dotenv/config';
import { addAd, getAdsSnapshot } from './store.js';

const app = express();
app.use(express.json());

app.post('/ads', (req, res) => {
  const ad = addAd(req.body);
  res.json({ ok: true, ad });
});

app.get('/ads', (_req, res) => {
  res.json(getAdsSnapshot());
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(3001, () =>
  console.log('Backend running on http://localhost:3001')
);
