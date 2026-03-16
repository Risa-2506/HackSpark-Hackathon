import { useState } from 'react';
import { transactionData } from '../data/mockData';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { AlertCircle, CheckCircle2, Search, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';

export function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactionData.filter(txn => 
    txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.shopId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.rationCard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTransactions = transactionData.length;
  const flaggedTransactions = transactionData.filter(t => t.flagged).length;
  const todayTransactions = transactionData.filter(t => 
    t.timestamp.startsWith('2026-02-20')
  ).length;
  const totalDistributed = transactionData.reduce((sum, t) => sum + t.distributedKg, 0);

  // Daily transaction trend
  const dailyData = transactionData.reduce((acc, txn) => {
    const date = txn.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, transactions: 0, flagged: 0 };
    }
    acc[date].transactions += 1;
    if (txn.flagged) acc[date].flagged += 1;
    return acc;
  }, {} as Record<string, { date: string; transactions: number; flagged: number }>);

  const chartData = Object.values(dailyData).sort((a, b) => 
    a.date.localeCompare(b.date)
  );

  // Hourly distribution for today
  const hourlyData = transactionData
    .filter(t => t.timestamp.startsWith('2026-02-20'))
    .reduce((acc, txn) => {
      const hour = new Date(txn.timestamp).getHours();
      const hourLabel = `${hour}:00`;
      if (!acc[hourLabel]) {
        acc[hourLabel] = { hour: hourLabel, count: 0, volume: 0 };
      }
      acc[hourLabel].count += 1;
      acc[hourLabel].volume += txn.distributedKg;
      return acc;
    }, {} as Record<string, { hour: string; count: number; volume: number }>);

  const hourlyChartData = Object.values(hourlyData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">
            Complete audit trail of all ration distribution activities
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayTransactions}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +15% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedTransactions}</div>
            <p className="text-xs text-red-600 mt-1">Requires investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistributed} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Ration distributed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Transaction Trend</CardTitle>
            <CardDescription>Transaction volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                <YAxis />
                <Tooltip labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')} />
                <Legend />
                <Area type="monotone" dataKey="transactions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Total" />
                <Area type="monotone" dataKey="flagged" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Flagged" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Hourly Distribution</CardTitle>
            <CardDescription>Transaction activity by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Transactions" />
                <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} name="Volume (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Complete Transaction Log</CardTitle>
              <CardDescription>Detailed history of all distribution events</CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Shop ID</TableHead>
                <TableHead>Ration Card</TableHead>
                <TableHead>Distributed (kg)</TableHead>
                <TableHead>Black Market (kg)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id} className={txn.flagged ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(txn.timestamp), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{txn.shopId}</TableCell>
                  <TableCell className="font-medium">{txn.rationCard}</TableCell>
                  <TableCell>{txn.distributedKg}</TableCell>
                  <TableCell className={txn.blackMarketKg ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                    {txn.blackMarketKg || '-'}
                  </TableCell>
                  <TableCell>
                    {txn.flagged ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        FLAGGED
                      </Badge>
                    ) : (
                      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        VERIFIED
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
