'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Ticket, 
  Settings, 
  Shield, 
  BarChart3, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is admin via API endpoint
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/agent/login');
        return;
      }
      
      const data = await response.json();
      if (data.user?.role !== 'admin') {
        router.push('/agent/dashboard');
        return;
      }
      
      fetchData();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/agent/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      setUsers(usersData.data || []);

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.data || []);

      // Fetch tickets
      const ticketsResponse = await fetch('/api/tickets?allTickets=true');
      const ticketsData = await ticketsResponse.json();
      setTickets(ticketsData.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">Total support tickets</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Available categories</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length > 0 ? Math.round((tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length / tickets.length) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">Resolution rate</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderUserManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
{users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <Badge variant="outline">{user.role}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge variant="secondary">{user.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Category Management</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <Card key={category._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {category.description}
                </p>
                <Badge style={{ backgroundColor: category.color }}>Active</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-slate-600 font-medium mt-2">Elite Management Control Center</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-gray-200/50">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-4 border-b-3 transition-all font-bold text-lg ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-t-lg'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-4 px-4 border-b-3 transition-all font-bold text-lg ${
                  activeTab === 'users'
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-t-lg'
                }`}
              >
                👥 User Management
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`pb-4 px-4 border-b-3 transition-all font-bold text-lg ${
                  activeTab === 'categories'
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-t-lg'
                }`}
              >
                🏷️ Categories
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'categories' && renderCategoryManagement()}
        </motion.div>
      </div>
    </div>
  );
}
