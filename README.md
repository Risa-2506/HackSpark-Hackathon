# ReverseOTP – Power Shift in Welfare Distribution System
Designed for rural India with intermittent connectivity and scalable fraud monitoring.

### Problem Statement:
Public Distribution System (PDS) in rural areas faces:

- Duplicate ration distribution
- Black marketing by shopkeepers
- Fake complaints by customers
- No transparency in offline environments
- Weak fraud detection mechanisms

Our system ensures secure token-based ration distribution
with offline verification and fraud detection.

### Solution Overview:

We built a secure ration distribution system that:

- Uses TOTP-based secure UTID tokens (valid for 15 minutes)
- Allows offline verification using SQLite
- Syncs transactions to MongoDB when internet is available
- Detects duplicate distribution per month
- Allows customers to file complaints
- Performs fraud detection on both shopkeepers and customers
- Provides admin analytics dashboard APIs

### Architecture:
### 👤 Customer (USSD Simulator)
- Enters ration card number
- Receives secure 15-minute UTID token

### 🏪 Shopkeeper App (Offline SQLite)
- Verifies UTID offline using secret key
- Dispenses ration
- Stores transaction locally
- Syncs when internet is available

### ☁ Backend (Node.js + MongoDB)
- Validates users
- Stores transactions
- Handles sync
- Stores complaints
- Runs fraud detection
- Provides admin analytics

### 👤 Government DashBoard
Accessible by government officials.

Provides:

- Shop-wise fraud risk status (RED / GREEN)
- Complaint ratio per shop
- Total black-market Kg detected
- Customer fraud detection
- Suspicious activity alerts
- Monthly distribution analytics

Government can:

- Identify high-risk shops
- Detect black marketing patterns
- Track repeated fake complainers
- Trigger inspections/raids


### 🛠 Tech Stack

## 📱 Frontend

- **React Native** – Shopkeeper mobile application  
- **React Native (USSD Simulator)** – Simulates SMS/USSD logic  
- **React.js** – Government Monitoring Dashboard  



## 💾 Local Storage (Offline-First Architecture)

- **SQLite** – Stores beneficiary data and transactions locally in the shopkeeper app  
- **SHA-256** – Ensures tamper-proof transaction records (Blockchain-like simulation)



## ⚙ Backend

- **Node.js** – Runtime environment  
- **Express.js** – REST API framework  
- **MongoDB Atlas** – Cloud database for centralized storage  
- **Mongoose** – MongoDB object modeling and schema management  



### 📊 Impact
- Prevents duplicate ration allocation
- Detects black marketing
- Identifies fake complaints
- Works in low-internet rural areas
- Secure token-based distribution

### 👥 Team Roles:
- Risa: Backend architecture, Sync logic (Offlien to online databse), APIs, TOTP logic, Databases
- Ketan: USSD Simulator
- Blossom: Storing data offline using sqlite, triggering sync api when internet is available, frontend for the shopkeepers app
- Manish: Dasboard for the government officials
