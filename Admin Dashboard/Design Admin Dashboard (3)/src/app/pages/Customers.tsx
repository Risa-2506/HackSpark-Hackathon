import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { AlertTriangle, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useUserStats } from '../hooks/useApiData';
import { LoadingSpinner, ErrorDisplay } from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch real-time user data from API (auto-refreshes every 30 seconds)
  const { userStats, isLoading, error, refetch } = useUserStats(30000);

  if (isLoading && userStats.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && userStats.length === 0) {
    return <ErrorDisplay message={error} onRetry={refetch} />;
  }

  const filteredUsers = userStats.filter(user => 
    user.rationCard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBlackClaimed = userStats.reduce((sum, user) => sum + user.totalBlackClaimedKg, 0);
  const flaggedUsers = userStats.filter(u => u.status === 'RED').length;
  const safeUsers = userStats.filter(u => u.status === 'GREEN').length;
  const totalComplaints = userStats.reduce((sum, user) => sum + user.totalComplaints, 0);

  // Chart data
  const topOffenders = userStats
    .filter(u => u.totalBlackClaimedKg > 0)
    .sort((a, b) => b.totalBlackClaimedKg - a.totalBlackClaimedKg)
    .slice(0, 6)
    .map(user => ({
      name: user.rationCard,
      blackClaimed: user.totalBlackClaimedKg,
      complaints: user.totalComplaints,
    }));

  const scatterData = userStats.map(user => ({
    complaints: user.totalComplaints,
    blackClaimed: user.totalBlackClaimedKg,
    name: user.rationCard,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Monitoring</h1>
          <p className="text-muted-foreground">
            Track ration card holders and detect fraudulent claims
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered ration cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safe Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{safeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">No suspicious activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedUsers}</div>
            <p className="text-xs text-red-600 mt-1">Under investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
            <p className="text-xs text-muted-foreground mt-1">Filed against customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Black Market Claimants</CardTitle>
            <CardDescription>Customers with highest fraudulent claims (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topOffenders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="blackClaimed" fill="#ef4444" name="Black Market (kg)" />
                <Bar dataKey="complaints" fill="#f59e0b" name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Risk Analysis</CardTitle>
            <CardDescription>Complaints vs Black Market Claims correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="complaints" name="Complaints" />
                <YAxis type="number" dataKey="blackClaimed" name="Black Market (kg)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Customers" data={scatterData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Watchlist Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Watchlist</CardTitle>
              <CardDescription>All ration card holders and their fraud metrics</CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Card ID..."
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
                <TableHead>Ration Card ID</TableHead>
                <TableHead>Black Claimed (kg)</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.rationCard} className={user.status === 'RED' ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">{user.rationCard}</TableCell>
                  <TableCell className={user.totalBlackClaimedKg > 0 ? 'text-red-600 font-semibold' : ''}>
                    {user.totalBlackClaimedKg}
                  </TableCell>
                  <TableCell>{user.totalComplaints}</TableCell>
                  <TableCell>
                    {user.status === 'RED' ? (
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