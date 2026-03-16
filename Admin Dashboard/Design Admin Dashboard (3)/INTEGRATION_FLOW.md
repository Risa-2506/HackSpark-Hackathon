# Backend Integration Flow Diagram

## 🔄 Real-Time Data Synchronization

```
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR BACKEND SERVER                        │
│                                                                 │
│  ┌──────────────────────────┐  ┌─────────────────────────┐    │
│  │  MongoDB/SQLite Database │  │   Express/Node.js API   │    │
│  │                          │  │                         │    │
│  │  • Shop Data             │──│  GET /admin/shop-stats  │    │
│  │  • User Data             │  │  GET /admin/user-stats  │    │
│  │  • Transaction History   │  └─────────────────────────┘    │
│  └──────────────────────────┘                                  │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ ngrok tunnel
                         │ https://kenspeckle-norah-guiltily.ngrok-free.dev
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              FIGMA MAKE DASHBOARD (Frontend)                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  /src/app/services/api.ts                            │      │
│  │  ┌──────────────────────────────────────────────┐   │      │
│  │  │  fetchShopStats()                            │   │      │
│  │  │  • Calls GET /admin/shop-stats               │   │      │
│  │  │  • Returns ShopStats[]                       │   │      │
│  │  └──────────────────────────────────────────────┘   │      │
│  │  ┌──────────────────────────────────────────────┐   │      │
│  │  │  fetchUserStats()                            │   │      │
│  │  │  • Calls GET /admin/user-stats               │   │      │
│  │  │  • Returns UserStats[]                       │   │      │
│  │  └──────────────────────────────────────────────┘   │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  /src/app/hooks/useApiData.ts                        │      │
│  │                                                      │      │
│  │  useApiData(30000) ← Auto-refresh every 30 seconds  │      │
│  │  • Manages state (loading, error, data)             │      │
│  │  • Auto-refreshes via setInterval                   │      │
│  │  • Provides refetch() function                      │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │          REACT COMPONENTS (Pages)                    │      │
│  │                                                      │      │
│  │  Dashboard.tsx    → useApiData()                     │      │
│  │  Shopkeepers.tsx  → useShopStats()                   │      │
│  │  Customers.tsx    → useUserStats()                   │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              UI COMPONENTS                           │      │
│  │                                                      │      │
│  │  • KPI Cards       (show latest metrics)            │      │
│  │  • Charts          (update with new data)           │      │
│  │  • Tables          (display current records)        │      │
│  │  • LoadingSpinner  (shown while fetching)           │      │
│  │  • ErrorDisplay    (shown on API errors)            │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline of Events

```
T=0s     User opens dashboard
         ↓
T=0s     Initial API call to fetch shop & user stats
         → Shows LoadingSpinner
         ↓
T=2s     API responds with data
         → Hides LoadingSpinner
         → Renders charts & tables with data
         → Shows "Connected" status
         ↓
T=30s    Auto-refresh triggers
         → Shows "Syncing..." status
         → Fetches latest data from backend
         ↓
T=32s    New data received
         → Updates all charts automatically
         → Updates all tables automatically
         → Shows "Connected • Updated just now"
         ↓
T=60s    Auto-refresh triggers again
         → Cycle repeats every 30 seconds
```

---

## 🔄 Data Flow Example

### Example: Shopkeeper Data Update

```
1. Backend Database
   ┌────────────────────────────┐
   │ SHOP01: 12kg distributed   │
   │         2kg black market   │
   │         Status: RED        │
   └────────────────────────────┘
                  ↓
2. Backend API (Your Server)
   ┌────────────────────────────┐
   │ GET /admin/shop-stats      │
   │ Returns JSON:              │
   │ [{                         │
   │   shopId: "SHOP01",        │
   │   totalDistributedKg: 12,  │
   │   totalBlackKg: 2,         │
   │   status: "RED"            │
   │ }]                         │
   └────────────────────────────┘
                  ↓
3. API Service (api.ts)
   ┌────────────────────────────┐
   │ fetchShopStats()           │
   │ • Makes HTTP request       │
   │ • Parses JSON response     │
   │ • Returns ShopStats[]      │
   └────────────────────────────┘
                  ↓
4. React Hook (useApiData.ts)
   ┌────────────────────────────┐
   │ useShopStats()             │
   │ • Stores data in state     │
   │ • Triggers re-render       │
   │ • Schedules next refresh   │
   └────────────────────────────┘
                  ↓
5. React Component (Shopkeepers.tsx)
   ┌────────────────────────────┐
   │ const { shopStats } =      │
   │   useShopStats()           │
   │                            │
   │ Renders:                   │
   │ • Table row for SHOP01     │
   │ • Red badge                │
   │ • Chart point              │
   └────────────────────────────┘
                  ↓
6. User Sees
   ┌────────────────────────────┐
   │ SHOP01 | 12kg | 2kg | 🔴RED│
   └────────────────────────────┘
```

---

## 🎯 State Management

### Component State Flow

```
┌─────────────────────────────────────────────────┐
│  useApiData Hook                                │
│                                                 │
│  State:                                         │
│  ├─ shopStats: ShopStats[]      ← API data     │
│  ├─ userStats: UserStats[]      ← API data     │
│  ├─ isLoading: boolean          ← Loading flag │
│  ├─ error: string | null        ← Error state  │
│  └─ lastUpdated: Date | null    ← Timestamp    │
│                                                 │
│  Effects:                                       │
│  ├─ Initial fetch on mount                     │
│  └─ Auto-refresh every 30 seconds              │
│                                                 │
│  Returns:                                       │
│  ├─ All state values                           │
│  └─ refetch() function                         │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Component (e.g., Dashboard)                    │
│                                                 │
│  const { shopStats, isLoading, error } =        │
│         useApiData(30000);                      │
│                                                 │
│  Conditional Rendering:                         │
│  ├─ if (isLoading) → LoadingSpinner            │
│  ├─ if (error) → ErrorDisplay                  │
│  └─ else → Charts & Tables                     │
└─────────────────────────────────────────────────┘
```

---

## 🛡️ Error Handling Flow

```
┌──────────────────┐
│   API Request    │
└────────┬─────────┘
         │
         ▼
    ┌─────────┐
    │Success? │
    └────┬────┘
         │
    Yes  │  No
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌────────┐
│ Update │  │  Set   │
│ State  │  │ Error  │
│ with   │  │ State  │
│ Data   │  └───┬────┘
└───┬────┘      │
    │           │
    ▼           ▼
┌────────┐  ┌────────────┐
│ Render │  │   Show     │
│ Charts │  │ ErrorDisplay│
│   &    │  │    with    │
│ Tables │  │  Retry Btn │
└────────┘  └────────────┘
                │
          Click Retry
                │
                ▼
         ┌──────────────┐
         │ Call refetch()│
         └──────────────┘
                │
                ▼
         (Back to start)
```

---

## 🔄 Auto-Refresh Mechanism

```javascript
// Inside useApiData hook

useEffect(() => {
  // Initial fetch when component mounts
  fetchData();
  
  // Set up interval for auto-refresh
  if (refreshInterval > 0) {
    const intervalId = setInterval(() => {
      fetchData();  // Fetch new data every 30s
    }, refreshInterval);
    
    // Cleanup: clear interval when component unmounts
    return () => clearInterval(intervalId);
  }
}, [fetchData, refreshInterval]);
```

### What Happens:

1. **T=0s:** Component mounts → Fetch data immediately
2. **T=30s:** Interval triggers → Fetch data again
3. **T=60s:** Interval triggers → Fetch data again
4. **T=90s:** Interval triggers → Fetch data again
5. **...**
6. Component unmounts → Interval cleared automatically

---

## 📊 Example: Real-Time Dashboard Update

### Before Auto-Refresh (T=0s)
```
Dashboard shows:
┌──────────────────────┐
│ Total Shops: 8       │
│ Black Market: 35 kg  │
│ Flagged: 4          │
└──────────────────────┘
```

### Backend Changes (T=15s)
```
Admin adds new fraudulent shop in database:
- SHOP09: 10kg distributed, 5kg black market, RED
```

### After Auto-Refresh (T=30s)
```
Dashboard automatically updates to:
┌──────────────────────┐
│ Total Shops: 9       │  ← Changed!
│ Black Market: 40 kg  │  ← Changed!
│ Flagged: 5          │  ← Changed!
└──────────────────────┘

Charts automatically redraw
Tables automatically update
No page reload needed!
```

---

## 🎉 Summary

**Your dashboard is now a real-time monitoring system!**

✅ Fetches data from your backend APIs
✅ Updates every 30 seconds automatically  
✅ Shows loading states while fetching
✅ Handles errors gracefully
✅ Updates all visualizations dynamically
✅ No manual refresh needed (but available)
✅ Connection status always visible

**Everything is connected and working!** 🚀
