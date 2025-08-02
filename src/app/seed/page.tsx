'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SeedPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const seedDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ success: false, error: 'Failed to seed database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-3xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">🌱</span>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
            Database Seeding Portal
          </CardTitle>
          <p className="text-lg text-slate-600 font-medium mt-2">Initialize Your QuickDesk Environment</p>
        </CardHeader>
        <CardContent className="text-center px-8 pb-8">
          <p className="mb-8 text-xl text-slate-700 leading-relaxed">
            Launch your QuickDesk platform with pre-configured <strong>admin users</strong>, <strong>agent accounts</strong>, and <strong>support categories</strong> ready for immediate use.
          </p>
          
          <Button 
            onClick={seedDatabase} 
            disabled={loading}
            size="lg"
            className="mb-8 px-12 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Seeding Database...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>🚀</span>
                Launch Seed Process
              </div>
            )}
          </Button>

          {results && (
            <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">✅ Seeding Results:</h3>
              <pre className="text-sm text-left bg-white p-4 rounded-xl border shadow-inner overflow-auto max-h-64">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <h4 className="text-xl font-bold text-slate-800 mb-4">🔐 Default Credentials</h4>
            <div className="grid md:grid-cols-2 gap-4 text-lg">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-purple-700">👑 Admin Access</p>
                <p className="text-slate-700"><strong>Email:</strong> admin@quickdesk.com</p>
                <p className="text-slate-700"><strong>Password:</strong> Admin@123456</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-emerald-700">🛡️ Agent Access</p>
                <p className="text-slate-700"><strong>Email:</strong> agent@quickdesk.com</p>
                <p className="text-slate-700"><strong>Password:</strong> agent123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
