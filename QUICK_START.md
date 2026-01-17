# Quick Start Guide 🚀

## Ready to Test Immediately!

No MongoDB setup needed - the backend uses file-based storage for easy testing.

## Two Ways to Test:

1. **Web UI** (Recommended) - Visual interface at http://localhost:3000
2. **curl Commands** - Command-line API testing

Both methods work with the same backend!

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd /home/schwarzer/projects/CommunityCast/backend
npm start
```

**Expected output:**
```
📁 File storage initialized at: /home/schwarzer/projects/CommunityCast/backend/data
✅ File storage ready
✅ File-based storage connected successfully
⏰ Scheduler started - checking for active ads every 5 seconds
🚀 Backend + Scheduler started
✅ Server running on http://localhost:3001
📂 Environment: development
```

## Step 2: Start the Frontend (Optional - Web UI)

If you want to use the web interface, open a **new terminal** and run:

```bash
cd /home/schwarzer/projects/CommunityCast/frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view communitycast-frontend in the browser.

  Local:            http://localhost:3000
```

**Open your browser** to http://localhost:3000

You'll see two buttons:
- **הוסף עסק** (Add Business)
- **הוסף פרסומת** (Add Advertisement)

**Skip to Step 4** if you're using the UI.

---

## Step 3: Test with curl Commands (Alternative to UI)

### Create a Business

```bash
curl -X POST http://localhost:3001/api/businesses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bakery",
    "contact_info": "test@bakery.com, 050-1234567"
  }'
```

**Response:**
```json
{
  "ok": true,
  "business": {
    "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
    "business_code": "WU7RB6KX",
    "name": "Test Bakery",
    "contact_info": "test@bakery.com, 050-1234567",
    "created_at": "2026-01-15T09:09:14.551Z"
  }
}
```

**Save the `business_id` for the next step!**

### Create an Advertisement

```bash
curl -X POST http://localhost:3001/api/advertisements \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
    "title": "Summer Sale",
    "short_text": "50% off all items",
    "promo_text": "Visit us today for amazing summer discounts!",
    "start_time": "2026-01-15T09:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "status": "active"
  }'
```

Replace the `business_id` with yours from step 1!

**Response:**
```json
{
  "ok": true,
  "advertisement": {
    "ad_id": "97270eea-8269-4bf4-865c-00a3c8de59ea",
    "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
    "title": "Summer Sale",
    "short_text": "50% off all items",
    "promo_text": "Visit us today for amazing summer discounts!",
    "image_path": null,
    "start_time": "2026-01-15T09:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "status": "active",
    "created_at": "2026-01-15T09:09:24.914Z"
  }
}
```

### Check the Scheduler

If your ad is currently active (current time is between `start_time` and `end_time`), watch the server console. You should see:

```
✅ Pushed to NoviSign: Summer Sale
```

Every 5 seconds when the ad is active!

## Step 4: Testing with Web UI

If you're using the frontend (http://localhost:3000):

1. **Create a Business**:
   - Click "הוסף עסק"
   - Fill in business name and contact info
   - Click "שמור"
   - **Save the business_id from the alert!**

2. **Create an Advertisement**:
   - Click "הוסף פרסומת"
   - Paste the business_id
   - Fill in all fields
   - Optionally upload an image
   - Click "שמור"

3. **Watch the Backend Console**:
   - If the ad is currently active, you'll see:
   ```
   ✅ Pushed to NoviSign: [Your Ad Title]
   ```

---

## Step 5: Test More Endpoints (curl)

### List All Businesses

```bash
curl http://localhost:3001/api/businesses
```

### List All Advertisements

```bash
curl http://localhost:3001/api/advertisements
```

### Get Active/Upcoming Ads (What the scheduler sees)

```bash
curl http://localhost:3001/api/advertisements/snapshot
```

### Stop an Advertisement Early

```bash
curl -X DELETE http://localhost:3001/api/advertisements/AD_ID/stop
```

Replace `AD_ID` with your advertisement ID.

## Step 6: Where is the Data Stored?

All data is in JSON files:
- `/home/schwarzer/projects/CommunityCast/backend/data/businesses.json`
- `/home/schwarzer/projects/CommunityCast/backend/data/advertisements.json`

You can open these files to see your data!

```bash
cat backend/data/businesses.json
cat backend/data/advertisements.json
```

## Step 7: Reset All Data (if needed)

To start fresh:

```bash
cd backend
rm data/*.json
# Restart the server - files will be recreated empty
```

## What's Working

✅ Create, read, update, delete businesses
✅ Create, read, update, delete advertisements
✅ Auto-generated 8-character business codes
✅ Validation (required fields, date validation)
✅ Scheduler polls for active ads every 5 seconds
✅ Scheduler pushes to NoviSign when ads are active
✅ File uploads (images saved to `backend/uploads/`)
✅ Data persists between server restarts

## What's NOT Configured Yet

⚠️ **NoviSign credentials** - The scheduler will log errors if credentials aren't set:
```env
NOVISIGN_STUDIO_DOMAIN=your-domain.novisign.com
NOVISIGN_API_KEY=your-api-key
NOVISIGN_ITEMS_GROUP=your-group-id
```

Add these to `backend/.env` if you want to test NoviSign integration.

Without NoviSign credentials, everything else works fine - you just won't see ads pushed to NoviSign.

## File Upload Test

To test with an image:

```bash
curl -X POST http://localhost:3001/api/advertisements \
  -F "business_id=YOUR_BUSINESS_ID" \
  -F "title=Test Ad with Image" \
  -F "short_text=Short description" \
  -F "promo_text=Longer promotional text" \
  -F "start_time=2026-01-15T09:00:00.000Z" \
  -F "end_time=2026-01-15T23:59:59.000Z" \
  -F "status=active" \
  -F "image=@/path/to/your/image.jpg"
```

The image will be saved to `backend/uploads/` and the path will be in the response!

## Troubleshooting

### Port 3001 already in use?

```bash
lsof -ti:3001 | xargs kill -9
npm start
```

### Can't connect to server?

Make sure you're in the backend directory:
```bash
cd /home/schwarzer/projects/CommunityCast/backend
npm start
```

### Want to see server logs?

```bash
npm start
# Server will log everything to console
```

## Next Steps

1. ✅ **You're done!** The backend is fully functional
2. Test all the endpoints with curl
3. Try creating multiple businesses and advertisements
4. Check the JSON files to see your data
5. Optionally configure NoviSign credentials for full integration

## Additional Documentation

- `MANUAL_TESTING_GUIDE.md` - Detailed testing guide with all endpoints
- `FILE_STORAGE_README.md` - How file-based storage works
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details

Happy testing! 🎉
