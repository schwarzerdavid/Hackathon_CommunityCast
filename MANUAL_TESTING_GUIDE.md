# Manual Testing Guide

## Setup Steps

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd /home/schwarzer/projects/CommunityCast/backend
npm start
```

You should see:
```
📁 File storage initialized at: /home/schwarzer/projects/CommunityCast/backend/data
✅ File storage ready
✅ File-based storage connected successfully
⏰ Scheduler started - checking for active ads every 5 seconds
🚀 Backend + Scheduler started
✅ Server running on http://localhost:3001
📂 Environment: development
```

### 2. Start the Frontend (Optional)

If you want to use the web UI instead of curl commands, open a **new terminal** and run:

```bash
cd /home/schwarzer/projects/CommunityCast/frontend
npm start
```

You should see:
```
Compiled successfully!

You can now view communitycast-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

**Open your browser** to http://localhost:3000 and you'll see the CommunityCast UI with two buttons:
- **הוסף עסק** (Add Business)
- **הוסף פרסומת** (Add Advertisement)

**Note:** The backend uses **file-based storage** - all data is saved to JSON files in `backend/data/`:
- `backend/data/businesses.json` - All businesses
- `backend/data/advertisements.json` - All advertisements

Data persists between server restarts!

### 3. Configure NoviSign Credentials (Optional)

If you want to test the NoviSign integration, update these fields in `backend/.env`:
```env
NOVISIGN_STUDIO_DOMAIN=your-domain.novisign.com
NOVISIGN_API_KEY=your-api-key
NOVISIGN_ITEMS_GROUP=your-group-id
```

Without these, the scheduler will log errors when trying to push to NoviSign, but the rest of the system will work fine.

### 4. (Optional) Set Up ngrok for Public Image Access

If you need to make uploaded images publicly accessible (for NoviSign or testing):

1. Sign up at https://dashboard.ngrok.com/signup
2. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure ngrok: `ngrok config add-authtoken YOUR_TOKEN`
4. Start ngrok in a new terminal: `ngrok http 3001`
5. Copy the `https://` URL (e.g., `https://abc123.ngrok-free.app`)

See **NGROK_SETUP.md** for detailed instructions.

---

## Testing with Web UI (Recommended for Manual Testing)

If you started the frontend (http://localhost:3000), you can test using the visual interface:

### Create a Business via UI

1. Open http://localhost:3000 in your browser
2. Click **"הוסף עסק"** (Add Business) button
3. Fill in the form:
   - **שם העסק** (Business Name): e.g., "Test Bakery"
   - **פרטי קשר** (Contact Info): e.g., "test@bakery.com, 050-1234567"
4. Click **"שמור"** (Save)
5. You'll see an alert with the auto-generated business code - **save this code!**

### Create an Advertisement via UI

1. Click **"הוסף פרסומת"** (Add Advertisement) button
2. Fill in the form:
   - **מזהה עסק** (Business ID): Paste the business_id from the previous step
   - **כותרת הפרסומת** (Title): e.g., "Summer Sale"
   - **טקסט תמציתי** (Short Text): e.g., "50% off all items"
   - **פירוט המבצע** (Promo Text): e.g., "Visit us today for amazing discounts!"
   - **תמונה** (Image): Optionally upload an image (JPG, PNG, GIF, WebP - max 5MB)
   - **תאריך ושעת התחלה** (Start Time): Select start date/time
   - **תאריך ושעת סיום** (End Time): Select end date/time
   - **סטטוס** (Status): Leave as "פעיל" (Active)
3. Click **"שמור"** (Save)
4. You'll see a success message

### Watch the Scheduler

Check the backend terminal - if the ad is currently active (current time is between start and end time), you'll see:
```
✅ Pushed to NoviSign: Summer Sale
```

Every 5 seconds, the scheduler will send the active ad to NoviSign!

---

## Testing with curl Commands (Alternative)

If you prefer command-line testing, you can use curl commands instead of the UI:

## Testing Flow 1: Create a Business

### Using curl:

```bash
curl -X POST http://localhost:3001/api/businesses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bakery",
    "contact_info": "test@bakery.com, 050-1234567"
  }'
```

### Expected Response:

```json
{
  "ok": true,
  "business": {
    "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
    "business_code": "WU7RB6KX",
    "name": "Test Bakery",
    "contact_info": "test@bakery.com, 050-1234567",
    "created_at": "2026-01-15T10:52:00.000Z"
  }
}
```

**Save the `business_id` and `business_code` for the next steps!**

**Check the data file:**
```bash
cat backend/data/businesses.json
```

You'll see your business stored in JSON format!

---

## Testing Flow 2: Create an Advertisement (without image)

### Using curl:

```bash
# Replace BUSINESS_ID with the business_id from step 1
curl -X POST http://localhost:3001/api/advertisements \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "BUSINESS_ID",
    "title": "Summer Sale",
    "short_text": "50% off all items",
    "promo_text": "Visit us today for amazing summer discounts on all bakery items!",
    "start_time": "2026-01-15T11:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "status": "active"
  }'
```

### Expected Response:

```json
{
  "ok": true,
  "advertisement": {
    "ad_id": "97270eea-8269-4bf4-865c-00a3c8de59ea",
    "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
    "title": "Summer Sale",
    "short_text": "50% off all items",
    "promo_text": "Visit us today for amazing summer discounts on all bakery items!",
    "image_path": null,
    "start_time": "2026-01-15T11:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "status": "active",
    "created_at": "2026-01-15T10:55:00.000Z"
  }
}
```

**Check the data file:**
```bash
cat backend/data/advertisements.json
```

---

## Testing Flow 3: Create an Advertisement (with image upload)

### Using curl with multipart/form-data:

```bash
# Replace BUSINESS_ID and /path/to/image.jpg
curl -X POST http://localhost:3001/api/advertisements \
  -F "business_id=BUSINESS_ID" \
  -F "title=Weekend Special" \
  -F "short_text=Fresh bread 30% off" \
  -F "promo_text=Get fresh baked bread at 30% discount this weekend only!" \
  -F "start_time=2026-01-15T11:00:00.000Z" \
  -F "end_time=2026-01-15T23:59:59.000Z" \
  -F "status=active" \
  -F "image=@/path/to/image.jpg"
```

### Expected Response:

The response will be similar to Flow 2, but `image_path` will contain the uploaded file path:

```json
{
  "ok": true,
  "advertisement": {
    ...
    "image_path": "uploads/image-1705318800000-a1b2c3d4e5f6.jpg",
    ...
  }
}
```

**Check the uploaded image:**
```bash
ls -la backend/uploads/
```

**Access the image via HTTP:**
```bash
# Locally
curl http://localhost:3001/uploads/image-1705318800000-a1b2c3d4e5f6.jpg --output test.jpg

# Or open in browser
# http://localhost:3001/uploads/image-1705318800000-a1b2c3d4e5f6.jpg

# Via ngrok (if configured)
# https://your-ngrok-url.app/uploads/image-1705318800000-a1b2c3d4e5f6.jpg
```

---

## Testing Flow 4: Verify Scheduler Pushes to NoviSign

If the current time is between `start_time` and `end_time` of an active advertisement, the scheduler should automatically detect it and push to NoviSign every 5 seconds (only when there's a change).

### Watch the server console output:

```
ℹ️  No active ad — nothing sent to NoviSign
# ... wait until start_time ...
✅ Pushed to NoviSign: Summer Sale
```

If NoviSign credentials are not configured, you'll see:
```
❌ Scheduler error: <NoviSign API error>
```

This is expected - the rest of the system still works!

---

## Testing Flow 5: List All Businesses

```bash
curl http://localhost:3001/api/businesses
```

### Expected Response:

```json
{
  "ok": true,
  "count": 1,
  "businesses": [
    {
      "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
      "business_code": "WU7RB6KX",
      "name": "Test Bakery",
      "contact_info": "test@bakery.com, 050-1234567",
      "created_at": "2026-01-15T10:52:00.000Z"
    }
  ]
}
```

---

## Testing Flow 6: List All Advertisements

```bash
curl http://localhost:3001/api/advertisements
```

Or filter by business:

```bash
curl "http://localhost:3001/api/advertisements?business_id=BUSINESS_ID"
```

Or filter by status:

```bash
curl "http://localhost:3001/api/advertisements?status=active"
```

---

## Testing Flow 7: Get Active/Upcoming Snapshot

This endpoint is used by the scheduler to get the current active ad:

```bash
curl http://localhost:3001/api/advertisements/snapshot
```

### Expected Response:

```json
{
  "ok": true,
  "active": [
    {
      "ad_id": "97270eea-8269-4bf4-865c-00a3c8de59ea",
      "business_id": "20064b53-4e12-4ab6-a60f-a6b08e40ae4c",
      "business_name": "Test Bakery",
      "title": "Summer Sale",
      "image_path": null,
      "start_time": "2026-01-15T11:00:00.000Z",
      "end_time": "2026-01-15T23:59:59.000Z"
    }
  ],
  "upcoming": []
}
```

---

## Testing Flow 8: Stop Advertisement Early

```bash
# Replace AD_ID with the ad_id from previous responses
curl -X DELETE http://localhost:3001/api/advertisements/AD_ID/stop
```

### Expected Response:

```json
{
  "ok": true,
  "message": "Advertisement stopped successfully",
  "advertisement": {
    "ad_id": "97270eea-8269-4bf4-865c-00a3c8de59ea",
    "stop_time": "2026-01-15T12:30:00.000Z",
    "status": "disabled"
  }
}
```

---

## Data Management

### View Your Data

All data is stored in human-readable JSON files:

```bash
# View all businesses
cat backend/data/businesses.json

# View all advertisements
cat backend/data/advertisements.json

# Pretty print with Python
python3 -m json.tool backend/data/businesses.json
python3 -m json.tool backend/data/advertisements.json
```

### Reset All Data

To start fresh:

```bash
cd backend
rm data/*.json
# Files will be recreated empty on next server start
```

### Backup Your Data

```bash
# Backup
cp backend/data/businesses.json backend/data/businesses.backup.json
cp backend/data/advertisements.json backend/data/advertisements.backup.json

# Restore
cp backend/data/businesses.backup.json backend/data/businesses.json
cp backend/data/advertisements.backup.json backend/data/advertisements.json
```

---

## Troubleshooting

### Port 3001 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
```

### Data Files Not Found

**Error:**
```
Error reading businesses.json
```

**Solution:**
The files are created automatically on first run. If missing:
```bash
mkdir -p backend/data
npm start
```

### NoviSign Push Errors

**Error:**
```
❌ Scheduler error: getaddrinfo ENOTFOUND
```

**Solution:**
This is expected if NoviSign credentials are not configured. The rest of the system still works fine.

### Validation Errors

**Error:**
```json
{
  "ok": false,
  "error": "Validation failed",
  "details": [...]
}
```

**Solution:**
Check that all required fields are provided and meet validation requirements:
- Dates in ISO format (e.g., `2026-01-15T11:00:00.000Z`)
- Proper field lengths (name: 2-100 chars, etc.)
- `end_time` must be after `start_time`

### File Upload Errors

**Error:**
```json
{
  "ok": false,
  "error": "File too large. Maximum size is 5MB."
}
```

**Solution:**
- Maximum file size is 5MB
- Only image types allowed: JPEG, PNG, GIF, WebP
- Make sure you're using `-F` flag with curl for multipart/form-data

---

## What's Been Implemented

✅ **Backend Infrastructure**
- File-based storage (JSON files in `backend/data/`)
- Express server with CORS
- File upload with Multer (images only, max 5MB)
- Request validation with Joi
- Error handling middleware
- Environment configuration

✅ **Business Management**
- POST /api/businesses - Create business (auto-generates 8-char code)
- GET /api/businesses - List all businesses
- GET /api/businesses/:id - Get single business
- PUT /api/businesses/:id - Update business
- DELETE /api/businesses/:id - Delete business (prevents deletion if has ads)

✅ **Advertisement Management**
- POST /api/advertisements - Create ad with optional image upload
- GET /api/advertisements - List ads with filters (business_id, status)
- GET /api/advertisements/snapshot - Get active/upcoming ads
- DELETE /api/advertisements/:id/stop - Stop ad early
- DELETE /api/advertisements/:id - Delete ad

✅ **Scheduler**
- Polls file storage every 5 seconds for active ads
- Uses SHA-1 hash to detect changes
- Only pushes to NoviSign when there's an active ad
- Handles errors gracefully

✅ **Data Models**
- Business: business_code (8-char unique), name, contact_info, timestamps
- Advertisement: business_id, title, short_text, promo_text, image_path, start_time, end_time, stop_time, status, timestamps
- Field validation (required fields, date ranges, status enum)
- Date validation (end_time must be after start_time)

✅ **File Storage Features**
- All data persists between server restarts
- Human-readable JSON format
- Easy to backup/restore
- Can inspect data directly in files

---

## Next Steps

1. ✅ **Server is ready!** Just run `npm start`
2. **Test the flows** using the curl commands above
3. **Optionally set up ngrok** to make images publicly accessible (see NGROK_SETUP.md)
4. **Optionally configure NoviSign credentials** to test the full integration
5. **View your data** in `backend/data/*.json` files

---

## Additional Documentation

- **QUICK_START.md** - Quick start guide
- **NGROK_SETUP.md** - Making images publicly accessible
- **FILE_STORAGE_README.md** - How file-based storage works
- **IMPLEMENTATION_COMPLETE.md** - Full implementation details

---

## API Endpoint Summary

### Businesses
- `POST /api/businesses` - Create business
- `GET /api/businesses` - List all businesses
- `GET /api/businesses/:id` - Get business by ID
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Advertisements
- `POST /api/advertisements` - Create advertisement (supports file upload)
- `GET /api/advertisements` - List advertisements (with optional filters)
- `GET /api/advertisements/snapshot` - Get active/upcoming ads
- `DELETE /api/advertisements/:id/stop` - Stop advertisement early
- `DELETE /api/advertisements/:id` - Delete advertisement

### Health Check
- `GET /health` - Server health check

### Static Files
- `GET /uploads/:filename` - Access uploaded images

---

**Happy Testing! 🎉**
