# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CommunityCast is a digital marketplace platform enabling small and medium-sized businesses in shopping centers to independently manage digital advertising on Point-of-Sale screens. The system integrates with NoviSign for content display and broadcasting.

## Architecture

### Three-Tier Architecture
1. **Frontend (React)**: User interface at `frontend/` - runs on port 3000, proxies API requests to backend
2. **Backend (Node.js/Express)**: REST API at `backend/` - runs on port 3001
3. **NoviSign Integration**: External digital signage system accessed via HTTP API

### Backend Data Flow
- **store.js**: In-memory ad storage with time-based filtering (active/upcoming ads)
- **server.js**: Express API with endpoints for creating and retrieving ads
- **scheduler.js**: Polls every 5 seconds for active ad changes and pushes updates to NoviSign
- **novisign.js**: HTTP client for NoviSign Catalog Items API
- **index.js**: Entry point that starts both server and scheduler

### Key Backend Mechanism
The scheduler uses SHA-1 hashing to detect state changes. It only calls NoviSign when:
1. The active ad changes (different ad or no ad)
2. There IS an active ad (critical: never calls NoviSign when no ad exists)

### Frontend Structure
- **App.js**: Main component with two modal launchers (Business, Advertisement)
- **components/BusinessModal.js**: Business creation form (currently posts to `/api/businesses` but backend doesn't implement this endpoint yet)
- **components/AdvertisementModal.js**: Ad creation form posting to `/ads` endpoint
- Fully supports RTL (Hebrew text)

## Development Commands

### Backend
```bash
cd backend
npm install
npm run dev    # or npm start - runs index.js which starts server + scheduler
```

### Frontend
```bash
cd frontend
npm install
npm start      # Opens browser at http://localhost:3000
npm run build  # Production build
npm test       # Run tests
```

### Environment Variables (Backend)
Required in `backend/.env`:
- `NOVISIGN_STUDIO_DOMAIN`: NoviSign studio domain
- `NOVISIGN_API_KEY`: API key for NoviSign authentication
- `NOVISIGN_ITEMS_GROUP`: Target items group ID

## Important Implementation Notes

### Current State (PoC Phase)
- **No database**: Ads stored in-memory (lost on restart) in `backend/store.js`
- **No authentication**: Business codes and auth tokens mentioned in data models but not implemented
- **Simplified NoviSign integration**: Direct synchronous HTTP calls instead of async queue-based architecture
- **File uploads**: Frontend references image paths, but actual upload functionality not implemented
- **API mismatch**: Frontend posts to `/api/businesses` but backend only implements `/ads` and `/ads` GET

### Data Models
**Advertisement** (as implemented in store.js):
- `id`: UUID (auto-generated)
- `businessId`: Reference to business
- `title`: Ad title
- `imageUrl`: Image URL/path
- `startAt`: ISO timestamp when ad becomes active
- `endAt`: ISO timestamp when ad expires
- `createdAt`: Creation timestamp

**Business** (defined in frontend but not in backend):
- `business_id`, `business_code`, `name`, `contact_info`

### NoviSign Payload Structure
The backend sends to NoviSign Catalog Items API:
```json
{
  "data": {
    "update": {
      "title": "...",
      "imageUrl": "...",
      "businessId": "...",
      "validUntil": "..."
    }
  }
}
```

## Future Roadmap (from ADR)
- Move from in-memory storage to MongoDB for persistence
- Implement async Pub/Sub architecture for NoviSign communication
- Add file upload to cloud object storage (AWS S3)
- Implement authentication and authorization
- Create dedicated Scheduler Service
- Add business management endpoints
