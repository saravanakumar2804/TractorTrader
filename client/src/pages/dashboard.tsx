import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import TractorCard from '@/components/tractors/TractorCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch current user
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/auth/me'],
    onError: () => {
      toast({
        title: 'Authentication Required',
        description: 'You need to log in to access your dashboard',
        variant: 'destructive',
      });
      navigate('/login');
    },
  });

  // Fetch user's tractors
  const { data: tractors, isLoading: tractorsLoading } = useQuery({
    queryKey: ['/api/tractors', { sellerId: user?.id }],
    enabled: !!user,
  });

  // Fetch user's favorite tractors
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  // Fetch user's payments
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    enabled: !!user,
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

  if (userError || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-red-600 font-bold text-lg mb-2">Authentication Required</h3>
          <p className="mb-4">You need to be logged in to view your dashboard.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  // Sample chart data (in a real app, this would come from the API)
  const viewsData = [
    { name: 'Mon', views: 24 },
    { name: 'Tue', views: 32 },
    { name: 'Wed', views: 42 },
    { name: 'Thu', views: 35 },
    { name: 'Fri', views: 48 },
    { name: 'Sat', views: 55 },
    { name: 'Sun', views: 43 },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | TractorTrade</title>
        <meta name="description" content="Manage your tractor listings, view your favorites, and track your payments." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl">Your Dashboard</h1>
            <p className="text-neutral-600">Manage your tractors, favorites, and payments</p>
          </div>
          <Button onClick={() => navigate('/sell')} size="lg">
            <i className="fas fa-plus mr-2"></i> Sell a Tractor
          </Button>
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-white text-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-heading font-bold text-lg">{user.name || user.username}</h3>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-neutral-500">{user.phone}</p>
                    )}
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/profile')}>
                  <i className="fas fa-user-edit mr-2"></i> Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Listings</CardTitle>
                <CardDescription>Tractors you're selling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary mb-1">
                    {tractorsLoading ? (
                      <span className="text-2xl">Loading...</span>
                    ) : (
                      tractors?.filter(t => t.sellerId === user.id)?.length || 0
                    )}
                  </p>
                  <p className="text-sm text-neutral-500">Active Listings</p>
                </div>
                <Separator className="my-2" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('listings')}>
                  <i className="fas fa-list mr-2"></i> View All Listings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Payments</CardTitle>
                <CardDescription>Your transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary mb-1">
                    {paymentsLoading ? (
                      <span className="text-2xl">Loading...</span>
                    ) : (
                      `₹${payments?.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString('en-IN') || 0}`
                    )}
                  </p>
                  <p className="text-sm text-neutral-500">Total Payments</p>
                </div>
                <Separator className="my-2" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('payments')}>
                  <i className="fas fa-credit-card mr-2"></i> View All Payments
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Listing Views</CardTitle>
                  <CardDescription>Views of your tractors in the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentsLoading ? (
                      <p>Loading recent activity...</p>
                    ) : payments && payments.length > 0 ? (
                      payments.slice(0, 5).map((payment, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="bg-primary/10 rounded-full p-2">
                            <i className="fas fa-credit-card text-primary"></i>
                          </div>
                          <div>
                            <p className="font-medium">Payment Received</p>
                            <p className="text-sm text-neutral-500">₹{payment.amount.toLocaleString('en-IN')} for tractor #{payment.tractorId}</p>
                            <p className="text-xs text-neutral-400">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-500">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <h2 className="font-heading font-bold text-2xl mb-6">Your Tractor Listings</h2>
            {tractorsLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading your listings...</p>
              </div>
            ) : tractors && tractors.filter(t => t.sellerId === user.id).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tractors
                  .filter(t => t.sellerId === user.id)
                  .map(tractor => (
                    <motion.div
                      key={tractor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TractorCard tractor={tractor} />
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <i className="fas fa-tractor text-neutral-300 text-5xl mb-4"></i>
                <h3 className="font-heading font-bold text-xl mb-2">No Tractors Listed Yet</h3>
                <p className="text-neutral-600 mb-6">You haven't listed any tractors for sale.</p>
                <Button onClick={() => navigate('/sell')}>
                  <i className="fas fa-plus mr-2"></i> Sell a Tractor
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <h2 className="font-heading font-bold text-2xl mb-6">Your Favorite Tractors</h2>
            {favoritesLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading your favorites...</p>
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map(tractor => (
                  <motion.div
                    key={tractor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TractorCard tractor={tractor} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <i className="fas fa-heart text-neutral-300 text-5xl mb-4"></i>
                <h3 className="font-heading font-bold text-xl mb-2">No Favorites Yet</h3>
                <p className="text-neutral-600 mb-6">You haven't added any tractors to your favorites.</p>
                <Button onClick={() => navigate('/tractors')}>
                  Browse Tractors
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <h2 className="font-heading font-bold text-2xl mb-6">Your Payments</h2>
            {paymentsLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading your payments...</p>
              </div>
            ) : payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="py-4 px-6 text-left">Date</th>
                      <th className="py-4 px-6 text-left">Tractor</th>
                      <th className="py-4 px-6 text-left">Amount</th>
                      <th className="py-4 px-6 text-left">Status</th>
                      <th className="py-4 px-6 text-left">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index} className="border-b hover:bg-neutral-50">
                        <td className="py-4 px-6">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <a href={`/tractors/${payment.tractorId}`} className="text-primary hover:underline">
                            {payment.tractor ? payment.tractor.title : `Tractor #${payment.tractorId}`}
                          </a>
                        </td>
                        <td className="py-4 px-6 font-medium">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            payment.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-neutral-500">
                          {payment.transactionId.substring(0, 12)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <i className="fas fa-credit-card text-neutral-300 text-5xl mb-4"></i>
                <h3 className="font-heading font-bold text-xl mb-2">No Payments Yet</h3>
                <p className="text-neutral-600 mb-6">You haven't made any payments yet.</p>
                <Button onClick={() => navigate('/tractors')}>
                  Browse Tractors
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
