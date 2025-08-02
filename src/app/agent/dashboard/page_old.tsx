'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  LogOut,
  Send,
  MessageSquare
} from 'lucide-react';

interface TicketSummary {
  _id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category?: {
    name: string;
    color: string;
  };
  user: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  lastActivity: string;
  createdAt: string;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [queueFilter, setQueueFilter] = useState('all'); // 'all', 'assigned', 'unassigned'

  const stats = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: Ticket,
      color: 'bg-blue-500'
    },
    {
      title: 'Open',
      value: tickets.filter(t => t.status === 'open').length,
      icon: AlertCircle,
      color: 'bg-orange-500'
    },
    {
      title: 'In Progress',
      value: tickets.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Resolved',
      value: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  useEffect(() => {
    // Check if agent is authenticated
    const token = localStorage.getItem('agent-token');
    if (!token) {
      router.push('/agent/login');
      return;
    }
    
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch('/api/tickets?allTickets=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh tickets
        fetchAllTickets();
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agent-token');
    router.push('/agent/login');
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    const matchesQueue = queueFilter === 'all' || 
                        (queueFilter === 'assigned' && ticket.assignedTo) ||
                        (queueFilter === 'unassigned' && !ticket.assignedTo);
    
    return matchesSearch && matchesStatus && matchesQueue;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Agent Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and respond to customer support tickets
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex items-center gap-4">
              <Link href="/agent/tickets/new">
                <Button variant="premium" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search tickets, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={queueFilter}
                    onChange={(e) => setQueueFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Tickets</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="assigned">Assigned</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tickets found
                  </h3>
                  <p className="text-gray-600">
                    No tickets match your current filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-gray-600">
                              {ticket.ticketNumber}
                            </span>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            {ticket.assignedTo && (
                              <Badge variant="outline">
                                <Users className="w-3 h-3 mr-1" />
                                {ticket.assignedTo.name}
                              </Badge>
                            )}
                          </div>
                          
                          <Link href={`/agent/tickets/${ticket._id}`}>
                            <h3 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 cursor-pointer">
                              {ticket.subject}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: ticket.category?.color || '#6366f1' }}
                              />
                              {ticket.category?.name || 'Uncategorized'}
                            </span>
                            <span>By {ticket.user.name}</span>
                            <span>Updated {formatRelativeTime(ticket.lastActivity)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {ticket.status !== 'closed' && (
                            <div className="flex gap-1">
                              {ticket.status === 'open' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTicketStatus(ticket._id, 'in-progress')}
                                >
                                  Take
                                </Button>
                              )}
                              {ticket.status === 'in-progress' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTicketStatus(ticket._id, 'resolved')}
                                >
                                  Resolve
                                </Button>
                              )}
                              {ticket.status === 'resolved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTicketStatus(ticket._id, 'closed')}
                                >
                                  Close
                                </Button>
                              )}
                            </div>
                          )}
                          <Link href={`/agent/tickets/${ticket._id}`}>
                            <Button size="sm" variant="premium">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
