import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch current user to check if admin
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
    onSuccess: (data) => {
      if (!data?.isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard',
          variant: 'destructive',
        });
        navigate('/');
      }
    },
    onError: () => {
      toast({
        title: 'Authentication Required',
        description: 'You need to log in to access the admin dashboard',
        variant: 'destructive',
      });
      navigate('/login');
    },
  });

  // Fetch all tractors
  const { data: tractors, isLoading: tractorsLoading } = useQuery({
    queryKey: ['/api/tractors'],
    enabled: !!user?.isAdmin,
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!user?.isAdmin,
  });

  // Fetch all payments
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    enabled: !!user?.isAdmin,
  });

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (userError || !user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-red-600 font-bold text-lg mb-2">Access Denied</h3>
          <p className="mb-4">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // Prepare data for category distribution chart
  const categoryData = tractors
    ? Object.entries(
        tractors.reduce((acc, tractor) => {
          acc[tractor.category] = (acc[tractor.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // Chart colors
  const COLORS = ['#2C5F2D', '#3A7D3B', '#97BC62', '#A9CA78', '#F9A825', '#E19921'];

  // Prepare data for monthly sales chart
  const monthlySalesData = [
    { name: 'Jan', sales: 12 },
    { name: 'Feb', sales: 19 },
    { name: 'Mar', sales: 15 },
    { name: 'Apr', sales: 22 },
    { name: 'May', sales: 28 },
    { name: 'Jun', sales: 31 },
    { name: 'Jul', sales: 36 },
    { name: 'Aug', sales: 43 },
    { name: 'Sep', sales: 38 },
    { name: 'Oct', sales: 32 },
    { name: 'Nov', sales: 27 },
    { name: 'Dec', sales: 24 },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | TractorTrade</title>
        <meta name="description" content="Admin dashboard for TractorTrade. Manage users, tractors, and monitor platform activity." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl">Admin Dashboard</h1>
            <p className="text-neutral-600">Manage users, tractors, and monitor platform activity</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate('/')} variant="outline" size="sm" className="mr-2">
              <i className="fas fa-arrow-left mr-2"></i> Back to Site
            </Button>
            <Button onClick={() => navigate('/sell')} size="sm">
              <i className="fas fa-plus mr-2"></i> Add Tractor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Tractors</p>
                    <h3 className="text-3xl font-bold mt-2">{tractorsLoading ? "..." : tractors?.length || 0}</h3>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <i className="fas fa-tractor text-primary"></i>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  <span className="text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 12%
                  </span>{" "}
                  since last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-secondary">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Users</p>
                    <h3 className="text-3xl font-bold mt-2">{usersLoading ? "..." : users?.length || 0}</h3>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <i className="fas fa-users text-secondary"></i>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  <span className="text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 8%
                  </span>{" "}
                  since last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-accent">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {paymentsLoading
                        ? "..."
                        : `₹${payments?.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString("en-IN") || 0}`}
                    </h3>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-full">
                    <i className="fas fa-rupee-sign text-accent"></i>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  <span className="text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 23%
                  </span>{" "}
                  since last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Completed Sales</p>
                    <h3 className="text-3xl font-bold mt-2">{paymentsLoading ? "..." : payments?.length || 0}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-check-circle text-green-600"></i>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  <span className="text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 15%
                  </span>{" "}
                  since last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tractors">Tractors</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tractor Categories</CardTitle>
                  <CardDescription>Distribution of tractors by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                  <CardDescription>Number of tractors sold per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest transactions and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {paymentsLoading ? (
                      <p>Loading recent activity...</p>
                    ) : payments && payments.length > 0 ? (
                      payments.slice(0, 5).map((payment, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="bg-primary/10 rounded-full p-3">
                            <i className="fas fa-credit-card text-primary"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">Payment Received</h4>
                              <span className="text-xs text-neutral-500">
                                {new Date(payment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              ₹{payment.amount.toLocaleString('en-IN')} for tractor #{payment.tractorId}
                            </p>
                            <p className="text-xs text-neutral-500">
                              Transaction ID: {payment.transactionId.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-neutral-500">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tractors Tab */}
          <TabsContent value="tractors">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 flex justify-between items-center bg-neutral-50 border-b">
                <h2 className="font-heading font-bold text-xl">All Tractors</h2>
                <Button size="sm" onClick={() => navigate('/sell')}>
                  <i className="fas fa-plus mr-2"></i> Add Tractor
                </Button>
              </div>
              
              {tractorsLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading tractors...</p>
                </div>
              ) : tractors && tractors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Title</th>
                        <th className="py-3 px-4 text-left font-medium">Brand</th>
                        <th className="py-3 px-4 text-left font-medium">Price</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Seller</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tractors.map((tractor) => (
                        <tr key={tractor.id} className="border-t hover:bg-neutral-50">
                          <td className="py-3 px-4">{tractor.id}</td>
                          <td className="py-3 px-4">
                            <a href={`/tractors/${tractor.id}`} className="text-primary hover:underline font-medium">
                              {tractor.title}
                            </a>
                          </td>
                          <td className="py-3 px-4">{tractor.brand}</td>
                          <td className="py-3 px-4">₹{tractor.price.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tractor.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : tractor.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tractor.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {users?.find(u => u.id === tractor.sellerId)?.username || `User #${tractor.sellerId}`}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No tractors found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b">
                <h2 className="font-heading font-bold text-xl">All Users</h2>
              </div>
              
              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading users...</p>
                </div>
              ) : users && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Username</th>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Email</th>
                        <th className="py-3 px-4 text-left font-medium">Role</th>
                        <th className="py-3 px-4 text-left font-medium">Joined</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-neutral-50">
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4 font-medium">{user.username}</td>
                          <td className="py-3 px-4">{user.name || '-'}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.isAdmin 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                <i className="fas fa-edit"></i>
                              </Button>
                              {!user.isAdmin && (
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                  <i className="fas fa-ban"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-neutral-50 border-b">
                <h2 className="font-heading font-bold text-xl">All Payments</h2>
              </div>
              
              {paymentsLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Loading payments...</p>
                </div>
              ) : payments && payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">ID</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Buyer</th>
                        <th className="py-3 px-4 text-left font-medium">Tractor ID</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-t hover:bg-neutral-50">
                          <td className="py-3 px-4">{payment.id}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(payment.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            {users?.find(u => u.id === payment.buyerId)?.username || `User #${payment.buyerId}`}
                          </td>
                          <td className="py-3 px-4">
                            <a href={`/tractors/${payment.tractorId}`} className="text-primary hover:underline">
                              #{payment.tractorId}
                            </a>
                          </td>
                          <td className="py-3 px-4 font-medium">₹{payment.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              payment.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {payment.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-500">
                            {payment.transactionId.substring(0, 10)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No payments found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
