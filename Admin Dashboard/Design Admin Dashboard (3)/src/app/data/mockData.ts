// Mock data based on the API structure from the images

export interface ShopData {
  shopId: string;
  totalTransactions: number;
  totalDistributedKg: number;
  totalComplaints: number;
  totalBlackKg: number;
  complaintRatio: number;
  status: 'RED' | 'GREEN';
}

export interface UserData {
  rationCard: string;
  totalComplaints: number;
  totalBlackClaimedKg: number;
  status: 'RED' | 'GREEN';
  name: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  shopId: string;
  rationCard: string;
  distributedKg: number;
  blackMarketKg?: number;
  flagged: boolean;
}

export const shopData: ShopData[] = [
  {
    shopId: 'SHOP01',
    totalTransactions: 2,
    totalDistributedKg: 12,
    totalComplaints: 1,
    totalBlackKg: 2,
    complaintRatio: 0.5,
    status: 'RED'
  },
  {
    shopId: 'SHOP02',
    totalTransactions: 15,
    totalDistributedKg: 145,
    totalComplaints: 0,
    totalBlackKg: 0,
    complaintRatio: 0,
    status: 'GREEN'
  },
  {
    shopId: 'SHOP03',
    totalTransactions: 8,
    totalDistributedKg: 78,
    totalComplaints: 3,
    totalBlackKg: 15,
    complaintRatio: 0.375,
    status: 'RED'
  },
  {
    shopId: 'SHOP04',
    totalTransactions: 12,
    totalDistributedKg: 120,
    totalComplaints: 1,
    totalBlackKg: 5,
    complaintRatio: 0.083,
    status: 'GREEN'
  },
  {
    shopId: 'SHOP05',
    totalTransactions: 20,
    totalDistributedKg: 200,
    totalComplaints: 0,
    totalBlackKg: 0,
    complaintRatio: 0,
    status: 'GREEN'
  },
  {
    shopId: 'SHOP06',
    totalTransactions: 5,
    totalDistributedKg: 45,
    totalComplaints: 2,
    totalBlackKg: 8,
    complaintRatio: 0.4,
    status: 'RED'
  },
  {
    shopId: 'SHOP07',
    totalTransactions: 18,
    totalDistributedKg: 175,
    totalComplaints: 1,
    totalBlackKg: 3,
    complaintRatio: 0.055,
    status: 'GREEN'
  },
  {
    shopId: 'SHOP08',
    totalTransactions: 10,
    totalDistributedKg: 95,
    totalComplaints: 4,
    totalBlackKg: 20,
    complaintRatio: 0.4,
    status: 'RED'
  },
];

export const userData: UserData[] = [
  {
    rationCard: 'RC001',
    totalComplaints: 1,
    totalBlackClaimedKg: 2,
    status: 'GREEN',
    name: 'Rajesh Kumar'
  },
  {
    rationCard: 'RC002',
    totalComplaints: 0,
    totalBlackClaimedKg: 0,
    status: 'GREEN',
    name: 'Priya Sharma'
  },
  {
    rationCard: 'RC003',
    totalComplaints: 3,
    totalBlackClaimedKg: 12,
    status: 'RED',
    name: 'Amit Patel'
  },
  {
    rationCard: 'RC004',
    totalComplaints: 0,
    totalBlackClaimedKg: 0,
    status: 'GREEN',
    name: 'Sunita Devi'
  },
  {
    rationCard: 'RC005',
    totalComplaints: 2,
    totalBlackClaimedKg: 8,
    status: 'RED',
    name: 'Mohammed Ali'
  },
  {
    rationCard: 'RC006',
    totalComplaints: 0,
    totalBlackClaimedKg: 0,
    status: 'GREEN',
    name: 'Lakshmi Rao'
  },
  {
    rationCard: 'RC007',
    totalComplaints: 1,
    totalBlackClaimedKg: 3,
    status: 'GREEN',
    name: 'Vikram Singh'
  },
  {
    rationCard: 'RC008',
    totalComplaints: 5,
    totalBlackClaimedKg: 18,
    status: 'RED',
    name: 'Neha Gupta'
  },
  {
    rationCard: 'RC009',
    totalComplaints: 0,
    totalBlackClaimedKg: 0,
    status: 'GREEN',
    name: 'Ramesh Yadav'
  },
  {
    rationCard: 'RC010',
    totalComplaints: 2,
    totalBlackClaimedKg: 6,
    status: 'RED',
    name: 'Anjali Verma'
  },
];

export const transactionData: Transaction[] = [
  {
    id: 'TXN001',
    timestamp: '2026-02-20T09:30:00',
    shopId: 'SHOP01',
    rationCard: 'RC001',
    distributedKg: 10,
    blackMarketKg: 2,
    flagged: true
  },
  {
    id: 'TXN002',
    timestamp: '2026-02-20T10:15:00',
    shopId: 'SHOP02',
    rationCard: 'RC002',
    distributedKg: 10,
    flagged: false
  },
  {
    id: 'TXN003',
    timestamp: '2026-02-20T11:00:00',
    shopId: 'SHOP03',
    rationCard: 'RC003',
    distributedKg: 8,
    blackMarketKg: 5,
    flagged: true
  },
  {
    id: 'TXN004',
    timestamp: '2026-02-20T11:45:00',
    shopId: 'SHOP02',
    rationCard: 'RC004',
    distributedKg: 10,
    flagged: false
  },
  {
    id: 'TXN005',
    timestamp: '2026-02-20T12:30:00',
    shopId: 'SHOP05',
    rationCard: 'RC006',
    distributedKg: 10,
    flagged: false
  },
  {
    id: 'TXN006',
    timestamp: '2026-02-20T13:15:00',
    shopId: 'SHOP03',
    rationCard: 'RC005',
    distributedKg: 10,
    blackMarketKg: 3,
    flagged: true
  },
  {
    id: 'TXN007',
    timestamp: '2026-02-20T14:00:00',
    shopId: 'SHOP04',
    rationCard: 'RC007',
    distributedKg: 10,
    flagged: false
  },
  {
    id: 'TXN008',
    timestamp: '2026-02-20T14:45:00',
    shopId: 'SHOP06',
    rationCard: 'RC008',
    distributedKg: 9,
    blackMarketKg: 4,
    flagged: true
  },
  {
    id: 'TXN009',
    timestamp: '2026-02-20T15:30:00',
    shopId: 'SHOP07',
    rationCard: 'RC009',
    distributedKg: 10,
    flagged: false
  },
  {
    id: 'TXN010',
    timestamp: '2026-02-20T16:15:00',
    shopId: 'SHOP08',
    rationCard: 'RC010',
    distributedKg: 8,
    blackMarketKg: 6,
    flagged: true
  },
  {
    id: 'TXN011',
    timestamp: '2026-02-19T09:00:00',
    shopId: 'SHOP01',
    rationCard: 'RC003',
    distributedKg: 2,
    flagged: false
  },
  {
    id: 'TXN012',
    timestamp: '2026-02-19T10:30:00',
    shopId: 'SHOP02',
    rationCard: 'RC001',
    distributedKg: 10,
    flagged: false
  },
];

// Calculated KPIs
export const getKPIs = () => {
  const totalUsers = userData.length;
  const totalShops = shopData.length;
  const transactionsToday = transactionData.filter(t => 
    t.timestamp.startsWith('2026-02-20')
  ).length;
  const totalFraudDetected = shopData.filter(s => s.status === 'RED').length + 
                            userData.filter(u => u.status === 'RED').length;
  const totalBlackMarketKg = shopData.reduce((sum, shop) => sum + shop.totalBlackKg, 0);
  
  return {
    totalUsers,
    totalShops,
    transactionsToday,
    totalFraudDetected,
    totalBlackMarketKg
  };
};
