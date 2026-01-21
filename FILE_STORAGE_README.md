# File-Based Storage Implementation ✅

## Overview

MongoDB has been replaced with a simple file-based JSON storage system. This allows you to test the full application immediately without configuring MongoDB Atlas.

## How It Works

### Storage Location
All data is stored in JSON files in the `backend/data/` directory:
- `backend/data/businesses.json` - All businesses
- `backend/data/advertisements.json` - All advertisements

### Features
✅ All CRUD operations work exactly as before
✅ Business code generation (8-character unique codes)
✅ Field validation
✅ Date validation
✅ Relationships (business_id references)
✅ Complex queries ($or, $lte, $gt, etc.)
✅ Population (joining business data with ads)
✅ Scheduler works with file storage

### Advantages
- **No setup required** - Works immediately
- **Human readable** - Can inspect data files directly
- **Easy debugging** - Just open JSON files
- **No external dependencies** - No cloud services needed

### Limitations
- **Not for production** - File-based storage is for development only
- **No concurrent writes** - May have issues with multiple simultaneous requests
- **Limited performance** - Loads entire file into memory for each operation
- **No advanced features** - No indexes, aggregations, or transactions

## File Structure

### businesses.json
```json
[
  {
    "_id": "uuid",
    "business_code": "ABC12345",
    "name": "Test Bakery",
    "contact_info": "test@bakery.com, 050-1234567",
    "created_at": "2026-01-15T09:09:14.551Z",
    "updated_at": "2026-01-15T09:09:14.551Z"
  }
]
```

### advertisements.json
```json
[
  {
    "_id": "uuid",
    "business_id": "business-uuid",
    "title": "Summer Sale",
    "image_path": null,
    "start_time": "2026-01-15T09:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z",
    "stop_time": null,
    "created_at": "2026-01-15T09:09:24.914Z",
    "updated_at": "2026-01-15T09:09:24.914Z"
  }
]
```

## Implementation Details

### Models
The Mongoose models were replaced with custom classes that:
- Read/write JSON files synchronously
- Support the same interface as Mongoose (find, findOne, save, etc.)
- Handle validation
- Support query builders for chaining (.populate(), .select(), .sort())

### Database Connection
The `config/database.js` now initializes file storage instead of connecting to MongoDB.

### No Breaking Changes
All controllers and routes work exactly the same - they don't know the difference between MongoDB and file storage.

## Testing

Start the server:
```bash
cd backend
npm start
```

Expected output:
```
📁 File storage initialized at: /home/schwarzer/projects/CommunityCast/backend/data
✅ File storage ready
✅ File-based storage connected successfully
⏰ Scheduler started - checking for active ads every 5 seconds
🚀 Backend + Scheduler started
✅ Server running on http://localhost:3001
📂 Environment: development
```

## Data Persistence

Data persists between server restarts because it's stored in JSON files. To reset all data:

```bash
cd backend
rm data/*.json
# Files will be recreated empty on next server start
```

## Switching Back to MongoDB

If you want to switch back to MongoDB in the future:

1. Install mongoose:
```bash
npm install mongoose
```

2. Replace `backend/config/database.js` with MongoDB connection code
3. Replace `backend/models/Business.js` and `backend/models/Advertisement.js` with Mongoose schemas
4. Update `.env` with MONGODB_URI

The controllers and routes won't need any changes!

## Performance Notes

For development and testing, file-based storage is perfectly fine. The JSON files are:
- Small (< 1MB even with hundreds of entries)
- Fast to read/write
- Easy to inspect and debug

Only switch to MongoDB when:
- You need production deployment
- You have thousands of entries
- You need concurrent access from multiple servers
- You need advanced features like aggregations

## Troubleshooting

### Data file corrupted?
Just delete it and restart the server:
```bash
rm backend/data/businesses.json
rm backend/data/advertisements.json
```

### Can't find data directory?
The directory is created automatically on first run. If missing:
```bash
mkdir -p backend/data
```

### Want to view data?
```bash
cat backend/data/businesses.json | python3 -m json.tool
cat backend/data/advertisements.json | python3 -m json.tool
```

## Migration Path

When you're ready to move to MongoDB:

1. Export your file data:
```javascript
const businesses = JSON.parse(fs.readFileSync('data/businesses.json'));
const ads = JSON.parse(fs.readFileSync('data/advertisements.json'));
```

2. Connect to MongoDB and import:
```javascript
await Business.insertMany(businesses);
await Advertisement.insertMany(ads);
```

3. Switch the models back to Mongoose
4. No controller changes needed!

---

**Current Status**: ✅ File-based storage is fully functional and tested
**Ready for**: Development, Testing, Manual QA
**Not ready for**: Production, High concurrency, Large datasets
