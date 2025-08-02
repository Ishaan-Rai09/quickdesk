'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, CheckCircle, Loader2, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime, getStatusColor, getPriorityColor } from '@/lib/utils';

interface Comment {
  _id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'agent' | 'admin';
    avatar?: string;
  };
  isInternal: boolean;
  createdAt: string;
}

interface TicketDetail {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: {
    name: string;
    color: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  comments: Comment[];
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export default function AgentTicketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    // Check if agent is authenticated
    const token = localStorage.getItem('agent-token');
    if (!token) {
      router.push('/agent/login');
      return;
    }
    
    fetchTicket();
    fetchComments();
  }, []);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch(`/api/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTicket(data.data || null);
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch(`/api/tickets/${id}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch(`/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: comment,
          isInternal 
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment.data]);
        setComment('');
        setIsInternal(false);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTicketStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('agent-token');
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Ticket not found
          </h3>
          <p className="text-gray-600 mb-6">
            The ticket you are looking for does not exist.
          </p>
          <Link href="/agent/dashboard">
            <Button variant="premium">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/agent/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {ticket.subject} <span className="font-normal">(#{ticket.ticketNumber})</span>
                </CardTitle>
                <div className="flex gap-2">
                  {ticket.status !== 'closed' && (
                    <>
                      {ticket.status === 'open' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus('in-progress')}
                        >
                          Take Ticket
                        </Button>
                      )}
                      {ticket.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus('resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      {ticket.status === 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus('closed')}
                        >
                          Close Ticket
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge
                  style={{ 
                    backgroundColor: ticket.category.color,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {ticket.category.name}
                </Badge>
                {ticket.assignedTo && (
                  <Badge variant="outline">
                    Assigned to {ticket.assignedTo.name}
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-700 mb-4">
                {ticket.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Created by {ticket.user.name} ({ticket.user.email})
                </span>
                <span>Created {formatRelativeTime(ticket.createdAt)}</span>
                <span>Last updated {formatRelativeTime(ticket.lastActivity)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Comments & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              {/* New Comment */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Add a comment or response..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="internal" className="text-sm text-gray-600">
                        Internal note (not visible to customer)
                      </label>
                    </div>
                    
                    <Button
                      type="submit"
                      variant="premium"
                      disabled={submitting || !comment.trim()}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {submitting ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Comment List */}
              {comments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to respond!
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`border-l-4 pl-4 py-3 ${
                        comment.isInternal
                          ? 'border-yellow-400 bg-yellow-50'
                          : comment.author.role === 'user'
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-green-400 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {comment.author.avatar ? (
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              comment.author.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                              {comment.author.role === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Shield className="w-5 h-5 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold">
                              {comment.author.name}
                            </h4>
                            <Badge
                              variant={comment.author.role === 'user' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {comment.author.role}
                            </Badge>
                            {comment.isInternal && (
                              <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-400">
                                Internal
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
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
