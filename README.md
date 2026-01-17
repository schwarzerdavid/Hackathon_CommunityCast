# CommunityCast 📺

Digital marketplace platform for small businesses to manage digital advertising on shopping center screens.

## What It Does

CommunityCast allows businesses to:
- Register and get a unique business code
- Create advertisements with images and promotional text
- Schedule ads with start/end times
- Automatically push active ads to NoviSign digital signage

## Quick Start (5 minutes)

### 1. Start Backend
```bash
cd backend
npm start
```
Server runs at: http://localhost:3001

### 2. Start Frontend (Optional - Web UI)
```bash
cd frontend
npm start
```
UI opens at: http://localhost:3000

### 3. Create Your First Ad

**Using Web UI:**
1. Open http://localhost:3000
2. Click "הוסף עסק" (Add Business) - save the generated code
3. Click "הוסף פרסומת" (Add Advertisement) - use the business code
4. Watch the backend console - ads are pushed to NoviSign every 5 seconds!

**Using curl:**
```bash
# Create business
curl -X POST http://localhost:3001/api/businesses \
  -H "Content-Type: application/json" \
  -d '{"name": "My Bakery", "contact_info": "mybakery@example.com"}'

# Create ad (use business_id from above)
curl -X POST http://localhost:3001/api/advertisements \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "PASTE_BUSINESS_ID_HERE",
    "title": "Summer Sale",
    "short_text": "50% off",
    "promo_text": "Amazing discounts!",
    "start_time": "2026-01-15T09:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "status": "active"
  }'
```

## Architecture

```
Frontend (React)           Backend (Node.js/Express)        NoviSign
    Port 3000      →→→→         Port 3001           →→→→    Digital Signage
                              File Storage (JSON)
```

## Key Components

- **Frontend (React):** Web UI for managing businesses and advertisements
- **Backend (Express):** REST API with file-based storage
- **Scheduler:** Polls every 5 seconds and pushes active ads to NoviSign
- **File Storage:** All data persists in JSON files (`backend/data/`)
- **NoviSign Integration:** Direct HTTP API calls to display content

## Data Storage

All data is stored in human-readable JSON files:
- `backend/data/businesses.json` - All businesses
- `backend/data/advertisements.json` - All advertisements
- `backend/uploads/` - Uploaded images

Data persists between server restarts!

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[MANUAL_TESTING_GUIDE.md](MANUAL_TESTING_GUIDE.md)** - Detailed testing guide
- **[FILE_STORAGE_README.md](FILE_STORAGE_README.md)** - How file storage works
- **[NGROK_SETUP.md](NGROK_SETUP.md)** - Expose images publicly
- **[CLAUDE.md](CLAUDE.md)** - Technical documentation for developers

## Features

✅ Create, read, update, delete businesses
✅ Create, read, update, delete advertisements
✅ Auto-generated 8-character business codes
✅ File upload (images: JPEG, PNG, GIF, WebP - max 5MB)
✅ Input validation (required fields, date ranges)
✅ Scheduler pushes active ads to NoviSign every 5 seconds
✅ Data persists between restarts
✅ Web UI + REST API

## API Endpoints

### Businesses
- `POST /api/businesses` - Create business (auto-generates code)
- `GET /api/businesses` - List all businesses
- `GET /api/businesses/:id` - Get business by ID
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Advertisements
- `POST /api/advertisements` - Create ad (supports file upload)
- `GET /api/advertisements` - List ads (with filters)
- `GET /api/advertisements/snapshot` - Get active/upcoming ads
- `DELETE /api/advertisements/:id/stop` - Stop ad early
- `DELETE /api/advertisements/:id` - Delete ad

### Static Files
- `GET /uploads/:filename` - Access uploaded images

## Troubleshooting

**Port 3001 already in use?**
```bash
lsof -ti:3001 | xargs kill -9
```

**Want to reset all data?**
```bash
rm backend/data/*.json
```

**NoviSign credentials not configured?**
Edit `backend/.env` and add:
```env
NOVISIGN_STUDIO_DOMAIN=your-domain.novisign.com
NOVISIGN_API_KEY=your-api-key
NOVISIGN_ITEMS_GROUP=your-group-id
```

## Development Status

✅ Backend fully functional with file storage
✅ Frontend UI complete
✅ NoviSign integration working
✅ Scheduler active
✅ All endpoints tested

## Tech Stack

- **Frontend:** React 18, Axios
- **Backend:** Node.js, Express, Multer, Joi
- **Storage:** File-based JSON (easy migration to MongoDB later)
- **External API:** NoviSign HTTP API

---

**Ready to test?** See [QUICK_START.md](QUICK_START.md) for detailed instructions!
