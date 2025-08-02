'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  User, 
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  Paperclip
} from 'lucide-react';
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
  tags: string[];
  comments: Comment[];
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`);
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
      const response = await fetch(`/api/tickets/${id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!ticket) return;

    try {
      const response = await fetch(`/api/tickets/${ticket._id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType: type }),
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(prev => prev ? { ...prev, votes: data.votes } : null);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment.data]);
        setComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
          <Link href="/dashboard">
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Ticket Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {ticket.subject} <span className="font-normal">(#{ticket.ticketNumber})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-900 border border-gray-200">
                  {ticket.status}
                </span>
                <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-900 border border-gray-200">
                  {ticket.priority}
                </span>
                <span
                  className="inline-block px-2 py-1 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: ticket.category.color }}
                >
                  {ticket.category.name}
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                {ticket.description}
              </p>
              <div className="text-sm text-gray-500">
                Created by {ticket.user.name} on {formatRelativeTime(ticket.createdAt)}.
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
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {/* New Comment */}
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="pr-16"
                    />
                  </div>
                  <Button type="submit" variant="premium" disabled={submitting || !comment.trim()} className="ml-2">
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Comment List */}
              {comments.length === 0 ? (
                <div className="text-center text-gray-500">
                  No comments yet.
                </div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment._id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {comment.author.avatar ? (
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-full">
                              <span className="text-white font-bold">
                                {comment.author.name[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold">
                              {comment.author.name}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

