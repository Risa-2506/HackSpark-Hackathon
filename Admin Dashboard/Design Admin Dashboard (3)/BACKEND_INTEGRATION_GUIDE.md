# Backend API Integration Guide

## ✅ Integration Complete!

Your dashboard is now successfully connected to your backend APIs with **real-time data synchronization**.

---

## 📡 API Endpoints Integrated

### 1. Shop Statistics API
```
GET https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/admin/shop-stats
```

**Returns:**
```json
[
  {
    "shopId": "SHOP01",
    "totalTransactions": 2,
    "totalDistributedKg": 12,
    "totalComplaints": 1,
    "totalBlackKg": 2,
    "complaintRatio": 0.5,
    "status": "RED"
  }
]
```

### 2. User Statistics API
```
GET https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/admin/user-stats
```

**Returns:**
```json
[
  {
    "rationCard": "RC001",
    "totalComplaints": 1,
    "totalBlackClaimedKg": 2,
    "status": "GREEN"
  }
]
```

---

## 🔄 Real-Time Updates

Your dashboard now features:

✅ **Auto-refresh every 30 seconds** - Data automatically updates from backend
✅ **Manual refresh button** - Users can click "Refresh Data" anytime
✅ **Loading states** - Shows spinner while fetching data
✅ **Error handling** - Displays user-friendly error messages with retry option
✅ **Dynamic charts** - All graphs update based on real API data

---

## 📁 Files Created/Modified

### New Files:
1. **`/src/app/services/api.ts`** - API service layer for backend calls
2. **`/src/app/hooks/useApiData.ts`** - React hooks for data fetching and auto-refresh
3. **`/src/app/components/LoadingSpinner.tsx`** - Loading and error display components

### Modified Files:
1. **`/src/app/pages/Dashboard.tsx`** - Now uses real API data
2. **`/src/app/pages/Shopkeepers.tsx`** - Now uses real shop statistics
3. **`/src/app/pages/Customers.tsx`** - Now uses real user statistics

---

## 🎯 How It Works

### Step 1: API Service Layer (`/src/app/services/api.ts`)
```typescript
// Fetches shop statistics from backend
export async function fetchShopStats(): Promise<ShopStats[]>

// Fetches user statistics from backend
export async function fetchUserStats(): Promise<UserStats[]>
```

### Step 2: Custom React Hooks (`/src/app/hooks/useApiData.ts`)
```typescript
// Auto-refreshing hook for all data
const { shopStats, userStats, isLoading, error, refetch } = useApiData(30000);

// Hook for only shop data
const { shopStats, isLoading, error, refetch } = useShopStats(30000);

// Hook for only user data
const { userStats, isLoading, error, refetch } = useUserStats(30000);
```

### Step 3: Component Integration
Each page now:
1. Calls the custom hook to fetch data
2. Shows loading spinner while fetching
3. Displays error with retry button if API fails
4. Auto-updates every 30 seconds
5. Has manual refresh button

---

## ⚙️ Configuration

### Change Auto-Refresh Interval
Edit the refresh interval (in milliseconds) in each page:

```typescript
// Refresh every 10 seconds
const { shopStats, userStats } = useApiData(10000);

// Refresh every 1 minute
const { shopStats, userStats } = useApiData(60000);

// Disable auto-refresh
const { shopStats, userStats } = useApiData(0);
```

### Change API Base URL
Edit `/src/app/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-new-api-url.com/api/v1';
```

---

## 🧪 Testing the Integration

### 1. Check Browser Console
Open Developer Tools → Console tab to see:
- API request logs
- Any errors
- Data fetching confirmations

### 2. Network Tab
Developer Tools → Network tab:
- See API calls being made
- Check response status codes
- View actual JSON responses

### 3. Test Error Handling
- Turn off your backend server
- Dashboard will show error message with retry button
- Click retry to attempt reconnection

---

## 🔐 CORS and Headers

If you encounter CORS errors, your backend needs to allow requests from your frontend domain:

**Backend Configuration Needed:**
```javascript
// Express.js example
app.use(cors({
  origin: '*', // or specify your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

**ngrok Headers:**
For ngrok free tier, you might need to add headers in the API service:

```typescript
const response = await fetch(`${API_BASE_URL}/admin/shop-stats`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
  },
});
```

---

## 📊 Data Flow Diagram

```
Backend APIs
    ↓
API Service (api.ts)
    ↓
Custom Hooks (useApiData.ts)
    ↓
React Components (Dashboard, Shopkeepers, Customers)
    ↓
Charts & Tables (Auto-update every 30s)
```

---

## 🎨 Features Implemented

### Dashboard Page
- ✅ KPI cards update with real data
- ✅ Shop status pie chart updates
- ✅ Distribution bar chart updates
- ✅ High-risk shopkeeper table updates
- ✅ Manual refresh button

### Shopkeepers Page
- ✅ Total shops count from API
- ✅ Distributed/Black market totals from API
- ✅ Flagged shops count from API
- ✅ Complaint analysis chart updates
- ✅ Full shopkeeper table with search
- ✅ Manual refresh button

### Customers Page
- ✅ Total customers count from API
- ✅ Flagged customers from API
- ✅ Top offenders chart updates
- ✅ Fraud risk scatter plot updates
- ✅ Full customer table with search
- ✅ Manual refresh button

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Add Authentication
```typescript
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Add WebSocket for Real-Time Updates
Replace polling with WebSocket for instant updates:
```typescript
const ws = new WebSocket('wss://your-api.com/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update state
};
```

### 3. Add Data Caching
Use React Query or SWR for better caching:
```bash
npm install @tanstack/react-query
```

### 4. Add Pagination
For large datasets, implement pagination in the API and tables.

---

## ❓ Troubleshooting

### Problem: "Failed to fetch" error
**Solution:**
- Check if backend server is running
- Verify ngrok tunnel is active
- Check browser console for CORS errors

### Problem: Data not updating
**Solution:**
- Check if auto-refresh interval is set (not 0)
- Verify API is returning data
- Check browser Network tab for failed requests

### Problem: Shows old/mock data
**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Verify API hook is being called

---

## 📞 Support

Your dashboard is now fully integrated with real-time backend data! 

All pages will automatically sync with your backend every 30 seconds, and users can manually refresh anytime using the "Refresh Data" button.

The charts, graphs, and tables will dynamically update based on the latest data from your API endpoints.
