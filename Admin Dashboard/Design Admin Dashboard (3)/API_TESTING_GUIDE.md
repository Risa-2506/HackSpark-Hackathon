# Quick API Testing Guide 🚀

## ✅ YES, Your Dashboard is Connected!

Your Figma Make dashboard is **fully integrated** with your backend APIs and will sync in real-time!

---

## 🔗 Connected API Endpoints

### 1️⃣ Shop Stats
```
GET https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/admin/shop-stats
```

### 2️⃣ User Stats
```
GET https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/admin/user-stats
```

---

## 🎯 How to Test It's Working

### Method 1: Open Browser Console
1. Open your dashboard in browser
2. Press `F12` or right-click → Inspect
3. Go to **Console** tab
4. You'll see API requests being logged every 30 seconds
5. Look for messages about data fetching

### Method 2: Check Network Tab
1. Press `F12` → **Network** tab
2. Refresh the page
3. Look for requests to:
   - `/admin/shop-stats`
   - `/admin/user-stats`
4. Click on them to see the actual JSON response

### Method 3: Watch the Connection Status
- Top right of dashboard shows: **🟢 Connected**
- When loading: **🔵 Syncing...**
- If error: **🔴 Connection Error**

---

## 🔄 Real-Time Features

### Auto-Refresh (Every 30 Seconds)
Your dashboard will automatically:
- ✅ Fetch latest shop data
- ✅ Fetch latest user data
- ✅ Update all KPI cards
- ✅ Update all charts and graphs
- ✅ Update all tables
- ✅ Show last updated timestamp

### Manual Refresh
Click the **"Refresh Data"** button anytime to:
- Force immediate data fetch
- See spinning icon while loading
- Get latest backend data

---

## 📊 What Updates Automatically

### Dashboard Page (`/`)
- Total Users count
- Transactions Today
- Fraud Detected count
- Black Market Ration total
- Pie chart (shop status distribution)
- Bar chart (distribution vs black market)
- High-risk shopkeepers table

### Shopkeepers Page (`/shopkeepers`)
- Total shops count
- Total distributed kg
- Black market kg
- Flagged shops count
- Complaint analysis chart
- Shop status pie chart
- Full shopkeeper table with all data

### Customers Page (`/customers`)
- Total customers count
- Safe customers count
- Flagged customers count
- Total complaints
- Top offenders bar chart
- Fraud risk scatter plot
- Full customer table with all data

---

## 🧪 Test Scenarios

### Scenario 1: Backend is Running
**Expected:** 
- Dashboard loads with real data from API
- Connection status shows "Connected"
- Data auto-refreshes every 30 seconds
- Charts show actual backend data

### Scenario 2: Backend is Down
**Expected:**
- Shows error message: "Error Loading Data"
- Red "Retry" button appears
- Connection status shows "Connection Error"
- Click Retry to try again

### Scenario 3: Update Backend Data
**Steps:**
1. Change data in your backend database
2. Wait 30 seconds OR click "Refresh Data"
3. Dashboard updates automatically
4. Charts and tables reflect new data

---

## 🐛 Troubleshooting

### "Failed to fetch" Error

**Possible Causes:**
1. ✗ Backend server is not running
2. ✗ ngrok tunnel expired (restart ngrok)
3. ✗ CORS issue
4. ✗ API endpoint changed

**Solutions:**
```bash
# Check if backend is running
curl https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/admin/shop-stats

# Restart ngrok if tunnel expired
ngrok http 3000

# Update API URL in /src/app/services/api.ts if changed
```

### CORS Error in Console

**Fix:** Add CORS headers to your backend:
```javascript
// In your backend (Express example)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
```

### Data Not Updating

**Check:**
1. Open Network tab → Look for 200 status codes
2. Verify JSON response has correct structure
3. Check console for errors
4. Try manual refresh button

---

## 📝 Quick Verification Checklist

- [ ] Backend server is running
- [ ] ngrok tunnel is active
- [ ] APIs return JSON data
- [ ] Dashboard opens without errors
- [ ] Connection status shows "Connected"
- [ ] Data appears in tables
- [ ] Charts display properly
- [ ] Refresh button works
- [ ] Auto-refresh happens every 30s

---

## 🎨 Visual Indicators

### Connection Status (Top Right)
```
🟢 Connected • Updated 2m ago    ← Everything working!
🔵 Syncing...                    ← Fetching data
🔴 Connection Error              ← Check backend
```

### Loading States
- **Initial Load:** Full page spinner
- **Background Refresh:** Small spinner in refresh button
- **Tables:** Show empty state if no data

---

## 🔧 Advanced Configuration

### Change Refresh Interval
Edit any page file (e.g., Dashboard.tsx):
```typescript
// Current: 30 seconds
const { shopStats, userStats } = useApiData(30000);

// Change to 10 seconds
const { shopStats, userStats } = useApiData(10000);

// Change to 1 minute
const { shopStats, userStats } = useApiData(60000);

// Disable auto-refresh (manual only)
const { shopStats, userStats } = useApiData(0);
```

### Update API URL
Edit `/src/app/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-new-url.com/api/v1';
```

---

## ✨ Summary

**Your dashboard is NOW connected to your backend!** 

✅ Real-time data synchronization every 30 seconds
✅ Manual refresh on demand
✅ Automatic error handling
✅ Loading states for better UX
✅ Connection status indicator
✅ All charts and tables update dynamically

Just make sure your backend is running and the ngrok tunnel is active, and everything will work automatically! 🎉
