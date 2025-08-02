'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  LogOut,
  Send,
  MessageSquare,
  User
} from 'lucide-react';

interface TicketSummary {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  comments?: any[];
}

export default function AgentDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketSummary | null>(null);
  const [response, setResponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is agent via API endpoint
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
      if (data.user?.role !== 'agent' && data.user?.role !== 'admin') {
        router.push('/agent/login');
        return;
      }
      
      fetchAllTickets();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/agent/login');
    }
  };

  const fetchAllTickets = async () => {
    try {
      const response = await fetch('/api/tickets?allTickets=true');
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
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAllTickets();
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const addResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    try {
      const responseData = await fetch(`/api/tickets/${selectedTicket._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: response,
          isInternal: false
        }),
      });

      if (responseData.ok) {
        setResponse('');
        // Update ticket status to in-progress if it's open
        if (selectedTicket.status === 'open') {
          await updateTicketStatus(selectedTicket._id, 'in-progress');
        }
        fetchAllTickets();
      }
    } catch (error) {
      console.error('Failed to add response:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">Agent Dashboard</h1>
                <p className="text-lg text-slate-600 font-medium">Premium Support Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-white/80 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700 font-semibold px-6 py-2 rounded-xl shadow-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Tickets List */}
          <div className="col-span-12 lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Tickets ({filteredTickets.length})</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-orange-600">
                      Open: {tickets.filter(t => t.status === 'open').length}
                    </Badge>
                    <Badge variant="outline" className="text-blue-600">
                      In Progress: {tickets.filter(t => t.status === 'in-progress').length}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTicket?._id === ticket._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-gray-500">{ticket.ticketNumber}</span>
                        <Badge className={
                          ticket.status === 'open' ? 'bg-orange-100 text-orange-800' :
                          ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {ticket.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.user.name}
                        </span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Details & Response */}
          <div className="col-span-12 lg:col-span-7">
            {selectedTicket ? (
              <div className="space-y-6">
                {/* Ticket Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <span>{selectedTicket.ticketNumber}</span>
                        <Badge className={
                          selectedTicket.status === 'open' ? 'bg-orange-100 text-orange-800' :
                          selectedTicket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {selectedTicket.status}
                        </Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedTicket.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => updateTicketStatus(selectedTicket._id, 'in-progress')}
                          >
                            Take Ticket
                          </Button>
                        )}
                        {selectedTicket.status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTicketStatus(selectedTicket._id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {selectedTicket.status === 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTicketStatus(selectedTicket._id, 'closed')}
                          >
                            Close Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedTicket.subject}</h3>
                        <p className="text-gray-700">{selectedTicket.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Customer: {selectedTicket.user.name}
                        </span>
                        <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Add Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your response to the customer..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <Button onClick={addResponse} disabled={!response.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
                    <p className="text-gray-600">Choose a ticket from the list to view details and respond</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
