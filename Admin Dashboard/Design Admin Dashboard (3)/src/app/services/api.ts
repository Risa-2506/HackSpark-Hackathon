// API service for backend integration

const API_BASE_URL =
  "https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1";

export interface ShopStats {
  shopId: string;
  totalTransactions: number;
  totalDistributedKg: number;
  totalComplaints: number;
  totalBlackKg: number;
  complaintRatio: number;
  status: "RED" | "GREEN";
}

export interface UserStats {
  rationCard: string;
  totalComplaints: number;
  totalBlackClaimedKg: number;
  status: "RED" | "GREEN";
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

/**
 * Fetch shop statistics from backend
 */
export async function fetchShopStats(): Promise<ShopStats[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/shop-stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok warning page
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle both array response and single object response
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching shop stats:", error);
    throw error;
  }
}

/**
 * Fetch user statistics from backend
 */
export async function fetchUserStats(): Promise<UserStats[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/user-stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Skip ngrok warning page
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle both array response and single object response
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

/**
 * Fetch all dashboard data (both shop and user stats)
 */
export async function fetchDashboardData() {
  try {
    const [shopStats, userStats] = await Promise.all([
      fetchShopStats(),
      fetchUserStats(),
    ]);

    return {
      shopStats,
      userStats,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}