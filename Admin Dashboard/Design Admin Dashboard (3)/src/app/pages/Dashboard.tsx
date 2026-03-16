import { KPICard } from '../components/KPICard';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { transactionData } from '../data/mockData';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useApiData } from '../hooks/useApiData';
import { LoadingSpinner, ErrorDisplay } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { ConnectionStatus } from '../components/ConnectionStatus';

export function Dashboard() {
  // Fetch real-time data from API (auto-refreshes every 30 seconds)
  const { shopStats, userStats, isLoading, error, refetch, lastUpdated } = useApiData(30000);

  if (isLoading && shopStats.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && shopStats.length === 0) {
    return <ErrorDisplay message={error} onRetry={refetch} />;
  }

  // Calculate KPIs from API data
  const totalUsers = userStats.length;
  const totalShops = shopStats.length;
  const transactionsToday = transactionData.filter(t => 
    t.timestamp.startsWith('2026-02-20')
  ).length;
  const totalFraudDetected = shopStats.filter(s => s.status === 'RED').length + 
                            userStats.filter(u => u.status === 'RED').length;
  const totalBlackMarketKg = shopStats.reduce((sum, shop) => sum + shop.totalBlackKg, 0);
  
  // Data for fraud trend chart
  const fraudTrendData = [
    { month: 'Sep', fraudCases: 12, resolved: 10 },
    { month: 'Oct', fraudCases: 15, resolved: 13 },
    { month: 'Nov', fraudCases: 18, resolved: 15 },
    { month: 'Dec', fraudCases: 14, resolved: 12 },
    { month: 'Jan', fraudCases: 20, resolved: 16 },
    { month: 'Feb', fraudCases: 17, resolved: 14 },
  ];

  // Data for distribution chart - using real API data
  const distributionData = shopStats.slice(0, 6).map(shop => ({
    name: shop.shopId,
    distributed: shop.totalDistributedKg,
    blackMarket: shop.totalBlackKg,
  }));

  // Data for status pie chart - using real API data
  const statusData = [
    { name: 'Safe Shops', value: shopStats.filter(s => s.status === 'GREEN').length, color: '#10b981' },
    { name: 'Flagged Shops', value: shopStats.filter(s => s.status === 'RED').length, color: '#ef4444' },
  ];

  const recentTransactions = transactionData.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of ration distribution and fraud detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus isLoading={isLoading} error={error} lastUpdated={lastUpdated || undefined} />
          <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description="Registered ration card holders"
          variant="default"
        />
        <KPICard
          title="Transactions Today"
          value={transactionsToday}
          icon={TrendingUp}
          description="Completed today"
          trend={{ value: '+12% from yesterday', isPositive: true }}
          variant="success"
        />
        <KPICard
          title="Fraud Detected"
          value={totalFraudDetected}
          icon={AlertTriangle}
          description="Active fraud cases"
          trend={{ value: '+3 new cases', isPositive: false }}
          variant="danger"
        />
        <KPICard
          title="Black Market Ration"
          value={`${totalBlackMarketKg} kg`}
          icon={Package}
          description="Total diverted ration"
          variant="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Detection Trend</CardTitle>
            <CardDescription>Monthly fraud cases vs resolved cases</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fraudCases" stroke="#ef4444" strokeWidth={2} name="Fraud Cases" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shop Status Distribution</CardTitle>
            <CardDescription>Current status of monitored shops</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ration Distribution vs Black Market</CardTitle>
          <CardDescription>Top shops by volume (in kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="distributed" fill="#3b82f6" name="Distributed (kg)" />
              <Bar dataKey="blackMarket" fill="#ef4444" name="Black Market (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Watchlist Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>High-Risk Shopkeepers</CardTitle>
            <CardDescription>Shops with suspicious activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop ID</TableHead>
                  <TableHead>Black (kg)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopStats.filter(s => s.status === 'RED').slice(0, 5).map((shop) => (
                  <TableRow key={shop.shopId}>
                    <TableCell className="font-medium">{shop.shopId}</TableCell>
                    <TableCell>{shop.totalBlackKg}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        RED
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {shopStats.filter(s => s.status === 'RED').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No high-risk shops found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest distribution activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between border-b pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{txn.shopId} → {txn.rationCard}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(txn.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{txn.distributedKg} kg</span>
                    {txn.flagged ? (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}