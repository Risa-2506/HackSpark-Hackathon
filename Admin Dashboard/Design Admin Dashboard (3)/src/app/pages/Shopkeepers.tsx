import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { AlertTriangle, CheckCircle, Search, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useShopStats } from '../hooks/useApiData';
import { LoadingSpinner, ErrorDisplay } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';

export function Shopkeepers() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch real-time shop data from API (auto-refreshes every 30 seconds)
  const { shopStats, isLoading, error, refetch } = useShopStats(30000);

  if (isLoading && shopStats.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && shopStats.length === 0) {
    return <ErrorDisplay message={error} onRetry={refetch} />;
  }

  const filteredShops = shopStats.filter(shop => 
    shop.shopId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDistributed = shopStats.reduce((sum, shop) => sum + shop.totalDistributedKg, 0);
  const totalBlackMarket = shopStats.reduce((sum, shop) => sum + shop.totalBlackKg, 0);
  const flaggedShops = shopStats.filter(s => s.status === 'RED').length;
  const safeShops = shopStats.filter(s => s.status === 'GREEN').length;

  // Chart data
  const complaintData = shopStats.map(shop => ({
    name: shop.shopId,
    complaints: shop.totalComplaints,
    ratio: shop.complaintRatio,
  })).sort((a, b) => b.complaints - a.complaints).slice(0, 6);

  const statusDistribution = [
    { name: 'Safe', value: safeShops, color: '#10b981' },
    { name: 'Flagged', value: flaggedShops, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopkeeper Monitoring</h1>
          <p className="text-muted-foreground">
            Track and analyze shopkeeper activities and fraud patterns
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shopStats.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered shops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistributed} kg</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Legitimate distribution
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Black Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBlackMarket} kg</div>
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> Diverted ration
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedShops}</div>
            <p className="text-xs text-muted-foreground mt-1">{safeShops} shops are safe</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Analysis</CardTitle>
            <CardDescription>Shops with highest complaint counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#ef4444" name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shop Status Overview</CardTitle>
            <CardDescription>Distribution of shop statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shopkeeper Watchlist Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shopkeeper Watchlist</CardTitle>
              <CardDescription>Complete list of all monitored shops</CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Shop ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop ID</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Distributed (kg)</TableHead>
                <TableHead>Black Market (kg)</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>Complaint Ratio</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.map((shop) => (
                <TableRow key={shop.shopId} className={shop.status === 'RED' ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">{shop.shopId}</TableCell>
                  <TableCell>{shop.totalTransactions}</TableCell>
                  <TableCell>{shop.totalDistributedKg}</TableCell>
                  <TableCell className={shop.totalBlackKg > 0 ? 'text-red-600 font-semibold' : ''}>
                    {shop.totalBlackKg}
                  </TableCell>
                  <TableCell>{shop.totalComplaints}</TableCell>
                  <TableCell>{shop.complaintRatio.toFixed(2)}</TableCell>
                  <TableCell>
                    {shop.status === 'RED' ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        RED
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3" />
                        GREEN
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}