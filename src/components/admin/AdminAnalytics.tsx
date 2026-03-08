import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getBookings } from '@/services/supabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, Users, CreditCard, Receipt } from 'lucide-react';
import type { PaymentReceipt } from '@/utils/mpesa-service';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))', 'hsl(142 76% 36%)', 'hsl(0 84% 60%)'];

const AdminAnalytics: React.FC = () => {
  const { data: receipts, isLoading: receiptsLoading } = useQuery({
    queryKey: ['admin-receipts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_receipts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PaymentReceipt[];
    },
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const { data: activityBookings, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activity-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const stats = useMemo(() => {
    const completedReceipts = receipts?.filter(r => r.status === 'completed') || [];
    const totalRevenue = completedReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalBookings = (bookings?.length || 0) + (activityBookings?.length || 0);
    const pendingBookings = (bookings?.filter(b => b.status === 'pending')?.length || 0) +
      (activityBookings?.filter(b => b.status === 'pending')?.length || 0);
    const confirmedBookings = (bookings?.filter(b => b.status === 'confirmed')?.length || 0) +
      (activityBookings?.filter(b => b.status === 'confirmed')?.length || 0);

    return { totalRevenue, totalBookings, pendingBookings, confirmedBookings, totalPayments: receipts?.length || 0 };
  }, [receipts, bookings, activityBookings]);

  const monthlyRevenue = useMemo(() => {
    if (!receipts?.length) return [];
    const months: Record<string, number> = {};
    receipts.filter(r => r.status === 'completed').forEach(r => {
      const month = format(new Date(r.created_at), 'MMM yyyy');
      months[month] = (months[month] || 0) + (r.amount || 0);
    });
    return Object.entries(months).map(([month, amount]) => ({ month, amount })).slice(-6);
  }, [receipts]);

  const bookingStatusData = useMemo(() => {
    if (!bookings?.length) return [];
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      const s = b.status || 'pending';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const isLoading = receiptsLoading || bookingsLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Room + Activity bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">Total M-Pesa transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue from completed M-Pesa payments</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No revenue data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Distribution of room booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bookingStatusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {bookingStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No booking data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Receipts
          </CardTitle>
          <CardDescription>All M-Pesa payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts && receipts.length > 0 ? receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-xs">{receipt.transaction_id?.slice(0, 12) || '—'}</TableCell>
                  <TableCell>{receipt.phone || '—'}</TableCell>
                  <TableCell className="font-semibold">KSh {receipt.amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={receipt.status === 'completed' ? 'default' : receipt.status === 'pending' ? 'secondary' : 'destructive'}>
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{receipt.booking_id?.slice(0, 8) || '—'}</TableCell>
                  <TableCell>{format(new Date(receipt.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payment receipts found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
