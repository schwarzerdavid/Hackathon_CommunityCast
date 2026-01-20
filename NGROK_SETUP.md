# Making Images Publicly Accessible with ngrok 🌐

## Current Setup

Images are already:
✅ **Saved locally** to `backend/uploads/` when uploaded
✅ **Served via HTTP** at `http://localhost:3001/uploads/filename.jpg`

Now let's make them accessible from the internet using ngrok!

## Step 1: Install ngrok

### Option A: Download from website
```bash
# Go to https://ngrok.com/download
# Download the Linux version
# Extract and move to your PATH
```

### Option B: Using snap (recommended for Ubuntu/WSL)
```bash
sudo snap install ngrok
```

### Option C: Manual install
```bash
# Download ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

# Extract
tar xvzf ngrok-v3-stable-linux-amd64.tgz

# Move to /usr/local/bin
sudo mv ngrok /usr/local/bin/

# Verify
ngrok version
```

## Step 2: Create ngrok Account (Free)

1. Go to https://dashboard.ngrok.com/signup
2. Sign up for free account
3. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
4. Configure ngrok with your token:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## Step 3: Start Your Backend Server

```bash
cd /home/schwarzer/projects/CommunityCast/backend
npm start
```

**Expected:**
```
✅ Server running on http://localhost:3001
```

## Step 4: Start ngrok

In a **new terminal**:

```bash
ngrok http 3001
```

**You'll see something like:**
```
ngrok

Session Status                online
Account                       your@email.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3001

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy the `https://abc123.ngrok-free.app` URL - this is your public URL!**

## Step 5: Test Image Access

### Upload an image

```bash
curl -X POST https://abc123.ngrok-free.app/api/advertisements \
  -F "business_id=YOUR_BUSINESS_ID" \
  -F "title=Test Ad" \
  -F "start_time=2026-01-15T09:00:00.000Z" \
  -F "end_time=2026-01-15T23:59:59.000Z" \
  -F "image=@/path/to/your/image.jpg"
```

**Response will include:**
```json
{
  "ok": true,
  "advertisement": {
    "image_path": "uploads/image-1705318800000-a1b2c3d4e5f6.jpg",
    ...
  }
}
```

### Access the image publicly

The image is now available at:
```
https://abc123.ngrok-free.app/uploads/image-1705318800000-a1b2c3d4e5f6.jpg
```

Open this URL in your browser - you'll see the image!

## Step 6: Update NoviSign to Use Public URLs

When the scheduler pushes to NoviSign, it will send:
```json
{
  "imageUrl": "uploads/image-1705318800000-a1b2c3d4e5f6.jpg"
}
```

You need to prepend your ngrok URL. Update `backend/novisign.js`:

```javascript
export async function pushToNoviSign(ad) {
  const payload = {
    data: {
      update: {
        title: ad.title,
        imageUrl: process.env.PUBLIC_URL
          ? `${process.env.PUBLIC_URL}/${ad.imageUrl}`
          : ad.imageUrl,
        businessId: ad.businessId,
        validUntil: ad.endAt
      }
    }
  };
  // ... rest of code
}
```

Add to `backend/.env`:
```env
PUBLIC_URL=https://abc123.ngrok-free.app
```

Now NoviSign will receive full URLs like:
```
https://abc123.ngrok-free.app/uploads/image-1705318800000-a1b2c3d4e5f6.jpg
```

## How It Works

```
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  ngrok (https://abc.ngrok.io)   │
└──────┬──────────────────────────┘
       │ Tunnel
       ▼
┌─────────────────────────────────┐
│  localhost:3001                 │
│  ├── /api/advertisements        │
│  ├── /api/businesses            │
│  └── /uploads/image.jpg ◄────┐  │
│      (static files)           │  │
└───────────────────────────────┼──┘
                                │
                          ┌─────┴─────┐
                          │  uploads/ │
                          │  (local)  │
                          └───────────┘
```

## File Upload Flow

1. **Upload image via API:**
   ```bash
   POST https://abc123.ngrok-free.app/api/advertisements
   (with file in multipart/form-data)
   ```

2. **Backend saves to:** `backend/uploads/image-timestamp-random.jpg`

3. **Backend returns:** `"image_path": "uploads/image-timestamp-random.jpg"`

4. **Image accessible at:** `https://abc123.ngrok-free.app/uploads/image-timestamp-random.jpg`

5. **NoviSign receives:** Full public URL in scheduler push

## Testing

### Test 1: Check static file serving locally
```bash
# Upload an image first, then:
curl http://localhost:3001/uploads/YOUR-IMAGE-NAME.jpg --output test.jpg
# Should download the image
```

### Test 2: Check via ngrok
```bash
curl https://abc123.ngrok-free.app/uploads/YOUR-IMAGE-NAME.jpg --output test2.jpg
# Should download the image
```

### Test 3: Open in browser
```
https://abc123.ngrok-free.app/uploads/YOUR-IMAGE-NAME.jpg
```

You should see the image!

## Important Notes

### Free ngrok Limitations
- URL changes each time you restart ngrok
- Limited to 40 connections/minute
- Session timeout after 2 hours of inactivity

### For Production
Use a permanent domain:
- ngrok paid plan for static domain
- Or deploy to Heroku/Vercel/Railway with permanent URL
- Or use cloud storage (AWS S3, Cloudinary)

### ngrok Web Interface
Visit http://127.0.0.1:4040 to see:
- All HTTP requests
- Request/response details
- Very useful for debugging!

## Troubleshooting

### ngrok not found?
```bash
# Check if installed
which ngrok

# If not, install using snap:
sudo snap install ngrok
```

### Connection refused?
Make sure your backend server is running:
```bash
curl http://localhost:3001/health
# Should return: {"ok":true}
```

### Images not loading?
Check permissions:
```bash
ls -la backend/uploads/
# Files should be readable (rw-r--r--)
```

### ngrok tunnel closed?
Free plan disconnects after inactivity. Just restart:
```bash
ngrok http 3001
```

## Complete Example

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
ngrok http 3001
# Copy the https:// URL
```

**Terminal 3:**
```bash
# Create business
NGROK_URL="https://abc123.ngrok-free.app"

curl -X POST $NGROK_URL/api/businesses \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Shop", "contact_info": "test@shop.com"}'

# Save business_id, then upload with image
curl -X POST $NGROK_URL/api/advertisements \
  -F "business_id=BUSINESS_ID_HERE" \
  -F "title=Sale" \
  -F "short_text=50% off" \
  -F "promo_text=Amazing discounts" \
  -F "start_time=2026-01-15T09:00:00.000Z" \
  -F "end_time=2026-01-15T23:59:59.000Z" \
  -F "status=active" \
  -F "image=@/path/to/image.jpg"

# Response shows: "image_path": "uploads/image-123456.jpg"

# Access image at:
# https://abc123.ngrok-free.app/uploads/image-123456.jpg
```

## Alternative: Using Image URLs Directly

If you have images already hosted somewhere (like Unsplash, Imgur, etc.), you can also pass the URL directly in the JSON body instead of uploading:

```bash
curl -X POST $NGROK_URL/api/advertisements \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "xxx",
    "title": "Sale",
    "image_path": "https://images.unsplash.com/photo-123/image.jpg",
    "start_time": "2026-01-15T09:00:00.000Z",
    "end_time": "2026-01-15T23:59:59.000Z"
  }'
```

This works too! The `image_path` field accepts both:
- Relative paths (for uploaded files): `"uploads/image.jpg"`
- Absolute URLs (for external images): `"https://example.com/image.jpg"`

---

**Summary:**
- ✅ Images already saved to `backend/uploads/`
- ✅ Images already served at `/uploads/filename.jpg`
- ✅ Use ngrok to expose publicly
- ✅ Images accessible at `https://your-ngrok-url.app/uploads/filename.jpg`
- ✅ NoviSign receives full public URLs
